"""
Patient Service for AetherFlow v2.0
Handles patient management, assessments, and medical data
"""

import os
from datetime import datetime
from typing import List, Optional
from uuid import UUID

import httpx
from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from shared.models import (
    Patient, PatientCreate, PatientUpdate,
    Assessment, AssessmentCreate, AssessmentUpdate,
    User, Provider, APIResponse, HealthCheck, PaginatedResponse
)
from shared.database import get_db_session

app = FastAPI(
    title="AetherFlow Patient Service",
    description="Patient management service for AetherFlow v2.0",
    version="2.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")

# Auth client
auth_client = httpx.AsyncClient(base_url=AUTH_SERVICE_URL)


async def get_current_user(authorization: str = None) -> dict:
    """Get current user from auth service"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        response = await auth_client.get(
            "/verify",
            headers={"Authorization": authorization}
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return response.json()
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service unavailable"
        )


def require_role(allowed_roles: List[str]):
    """Require specific user roles"""
    async def role_checker(
        authorization: str = None,
        current_user: dict = Depends(get_current_user)
    ):
        if current_user["role"] not in allowed_roles and current_user["role"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker


# Health check
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    try:
        # Test auth service connection
        response = await auth_client.get("/health", timeout=5.0)
        auth_status = "healthy" if response.status_code == 200 else "unhealthy"
    except Exception:
        auth_status = "unhealthy"
    
    return HealthCheck(
        service="patient-service",
        status="healthy" if auth_status == "healthy" else "degraded",
        timestamp=datetime.utcnow(),
        version="2.0.0",
        dependencies={"auth-service": auth_status}
    )


# Patient endpoints
@app.post("/patients", response_model=APIResponse)
async def create_patient(
    patient_data: PatientCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "admin"]))
):
    """Create new patient"""
    
    # Check if MRN already exists (if provided)
    if patient_data.mrn:
        result = await db.execute(
            select(Patient).where(Patient.mrn == patient_data.mrn)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=400,
                detail="Patient with this MRN already exists"
            )
    
    # Create patient
    db_patient = Patient(
        **patient_data.dict(),
        created_at=datetime.utcnow()
    )
    
    db.add(db_patient)
    await db.commit()
    await db.refresh(db_patient)
    
    return APIResponse(
        success=True,
        message="Patient created successfully",
        data={"patient_id": str(db_patient.id)}
    )


@app.get("/patients", response_model=PaginatedResponse)
async def get_patients(
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "admin"])),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    genotype: Optional[str] = Query(None),
    provider_id: Optional[UUID] = Query(None)
):
    """Get patients with filtering and pagination"""
    
    # Build query
    query = select(Patient).options(
        selectinload(Patient.user),
        selectinload(Patient.provider)
    ).where(Patient.is_active == True)
    
    # Apply filters
    if search:
        search_filter = or_(
            Patient.first_name.ilike(f"%{search}%"),
            Patient.last_name.ilike(f"%{search}%"),
            Patient.mrn.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
    
    if genotype:
        query = query.where(Patient.genotype == genotype)
    
    if provider_id:
        query = query.where(Patient.provider_id == provider_id)
    elif current_user["role"] == "provider":
        # Providers can only see their own patients
        query = query.where(Patient.provider_id == current_user["id"])
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    # Execute query
    result = await db.execute(query)
    patients = result.scalars().all()
    
    return PaginatedResponse(
        items=[patient.dict() for patient in patients],
        total=total,
        page=page,
        per_page=per_page,
        has_next=(offset + per_page) < total,
        has_prev=page > 1
    )


@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(
    patient_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "patient", "admin"]))
):
    """Get patient by ID"""
    
    query = select(Patient).options(
        selectinload(Patient.user),
        selectinload(Patient.provider)
    ).where(Patient.id == patient_id)
    
    # Access control
    if current_user["role"] == "patient":
        query = query.where(Patient.user_id == current_user["id"])
    elif current_user["role"] == "provider":
        query = query.where(Patient.provider_id == current_user["id"])
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    return patient


@app.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(
    patient_id: UUID,
    patient_update: PatientUpdate,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "admin"]))
):
    """Update patient information"""
    
    query = select(Patient).where(Patient.id == patient_id)
    
    # Providers can only update their own patients
    if current_user["role"] == "provider":
        query = query.where(Patient.provider_id == current_user["id"])
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    # Update patient
    for field, value in patient_update.dict(exclude_unset=True).items():
        setattr(patient, field, value)
    
    patient.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(patient)
    
    return patient


@app.delete("/patients/{patient_id}", response_model=APIResponse)
async def delete_patient(
    patient_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "admin"]))
):
    """Soft delete patient (deactivate)"""
    
    query = select(Patient).where(Patient.id == patient_id)
    
    # Providers can only delete their own patients
    if current_user["role"] == "provider":
        query = query.where(Patient.provider_id == current_user["id"])
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    patient.is_active = False
    patient.updated_at = datetime.utcnow()
    await db.commit()
    
    return APIResponse(
        success=True,
        message="Patient deactivated successfully"
    )


# Assessment endpoints
@app.post("/patients/{patient_id}/assessments", response_model=APIResponse)
async def create_assessment(
    patient_id: UUID,
    assessment_data: AssessmentCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "admin"]))
):
    """Create new assessment for patient"""
    
    # Verify patient exists and user has access
    query = select(Patient).where(Patient.id == patient_id)
    if current_user["role"] == "provider":
        query = query.where(Patient.provider_id == current_user["id"])
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    # Create assessment
    assessment_data.patient_id = patient_id
    if current_user["role"] == "provider":
        assessment_data.provider_id = current_user["id"]
    
    db_assessment = Assessment(
        **assessment_data.dict(),
        assessment_date=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    
    db.add(db_assessment)
    await db.commit()
    await db.refresh(db_assessment)
    
    return APIResponse(
        success=True,
        message="Assessment created successfully",
        data={"assessment_id": str(db_assessment.id)}
    )


@app.get("/patients/{patient_id}/assessments", response_model=PaginatedResponse)
async def get_patient_assessments(
    patient_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "patient", "admin"])),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """Get assessments for specific patient"""
    
    # Verify patient access
    patient_query = select(Patient).where(Patient.id == patient_id)
    if current_user["role"] == "patient":
        patient_query = patient_query.where(Patient.user_id == current_user["id"])
    elif current_user["role"] == "provider":
        patient_query = patient_query.where(Patient.provider_id == current_user["id"])
    
    patient_result = await db.execute(patient_query)
    patient = patient_result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    # Get assessments
    query = select(Assessment).options(
        selectinload(Assessment.provider)
    ).where(Assessment.patient_id == patient_id).order_by(Assessment.assessment_date.desc())
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    assessments = result.scalars().all()
    
    return PaginatedResponse(
        items=[assessment.dict() for assessment in assessments],
        total=total,
        page=page,
        per_page=per_page,
        has_next=(offset + per_page) < total,
        has_prev=page > 1
    )


@app.get("/assessments/{assessment_id}", response_model=Assessment)
async def get_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(require_role(["provider", "patient", "admin"]))
):
    """Get specific assessment"""
    
    query = select(Assessment).options(
        selectinload(Assessment.patient),
        selectinload(Assessment.provider)
    ).where(Assessment.id == assessment_id)
    
    result = await db.execute(query)
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )
    
    # Access control
    if current_user["role"] == "patient":
        if assessment.patient.user_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Access denied")
    elif current_user["role"] == "provider":
        if assessment.provider_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return assessment


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)