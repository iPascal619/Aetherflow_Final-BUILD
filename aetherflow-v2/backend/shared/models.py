"""
Shared data models and types for AetherFlow v2.0
Used across all microservices for consistent data structures
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any, Literal
from uuid import UUID
from pydantic import BaseModel, Field, validator
from enum import Enum


# Enums for standardized values
class UserRole(str, Enum):
    ADMIN = "admin"
    PROVIDER = "provider"
    PATIENT = "patient"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class GenotypeType(str, Enum):
    HBSS = "HbSS"
    HBSC = "HbSC"
    HBS_BETA = "HbS-beta"
    HBS_BETA_PLUS = "HbS-beta+"
    HBS_BETA_ZERO = "HbS-beta0"


class AssessmentType(str, Enum):
    CRISIS_RISK = "crisis_risk"
    ROUTINE_CHECKUP = "routine_checkup"
    EMERGENCY = "emergency"
    FOLLOW_UP = "follow_up"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertLevel(str, Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EMERGENCY = "emergency"


class CrisisSeverity(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    LIFE_THREATENING = "life_threatening"


# Base models
class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: Optional[datetime] = None


class UUIDMixin(BaseModel):
    id: UUID


# User and Authentication models
class UserBase(BaseModel):
    email: str = Field(..., max_length=255)
    role: UserRole = UserRole.PATIENT
    is_active: bool = True
    is_verified: bool = False


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=255)


class UserUpdate(BaseModel):
    email: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class User(UUIDMixin, UserBase, TimestampMixin):
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Provider models
class ProviderBase(BaseModel):
    license_number: Optional[str] = Field(None, max_length=100)
    specialty: Optional[str] = Field(None, max_length=100)
    organization: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[Dict[str, Any]] = None


class ProviderCreate(ProviderBase):
    user_id: UUID


class ProviderUpdate(ProviderBase):
    pass


class Provider(UUIDMixin, ProviderBase, TimestampMixin):
    user_id: UUID
    user: Optional[User] = None
    
    class Config:
        from_attributes = True


# Patient models
class EmergencyContact(BaseModel):
    name: str
    relationship: str
    phone: str
    email: Optional[str] = None


class Medication(BaseModel):
    name: str
    generic_name: Optional[str] = None
    dosage: str
    frequency: str
    start_date: date
    end_date: Optional[date] = None
    is_active: bool = True


class PatientBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    date_of_birth: date
    gender: Optional[Gender] = None
    phone: Optional[str] = Field(None, max_length=20)
    genotype: GenotypeType
    diagnosis_date: Optional[date] = None
    blood_type: Optional[str] = Field(None, max_length=10)
    emergency_contacts: List[EmergencyContact] = []
    allergies: List[str] = []
    current_medications: List[Medication] = []
    medical_history: Dict[str, Any] = {}


class PatientCreate(PatientBase):
    user_id: Optional[UUID] = None
    provider_id: Optional[UUID] = None
    mrn: Optional[str] = Field(None, max_length=50)


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    emergency_contacts: Optional[List[EmergencyContact]] = None
    allergies: Optional[List[str]] = None
    current_medications: Optional[List[Medication]] = None
    medical_history: Optional[Dict[str, Any]] = None


class Patient(UUIDMixin, PatientBase, TimestampMixin):
    user_id: Optional[UUID] = None
    provider_id: Optional[UUID] = None
    mrn: Optional[str] = None
    is_active: bool = True
    user: Optional[User] = None
    provider: Optional[Provider] = None
    
    class Config:
        from_attributes = True


# Assessment models
class VitalSigns(BaseModel):
    heart_rate: Optional[int] = Field(None, ge=30, le=250)
    blood_pressure_systolic: Optional[int] = Field(None, ge=50, le=300)
    blood_pressure_diastolic: Optional[int] = Field(None, ge=30, le=200)
    temperature: Optional[float] = Field(None, ge=90.0, le=110.0)
    oxygen_saturation: Optional[int] = Field(None, ge=70, le=100)
    respiratory_rate: Optional[int] = Field(None, ge=5, le=60)


class Symptoms(BaseModel):
    fatigue: bool = False
    fever: bool = False
    joint_pain: bool = False
    dactylitis: bool = False
    shortness_of_breath: bool = False
    abdominal_pain: bool = False
    chest_pain: bool = False
    headache: bool = False
    nausea: bool = False
    vomiting: bool = False


class PainAssessment(BaseModel):
    current_pain_level: int = Field(..., ge=0, le=10)
    pain_locations: List[str] = []
    pain_duration_hours: Optional[int] = Field(None, ge=0)
    pain_quality: Optional[str] = None
    pain_triggers: List[str] = []


class LaboratoryResults(BaseModel):
    hemoglobin: Optional[float] = Field(None, ge=3.0, le=20.0)
    hematocrit: Optional[float] = Field(None, ge=10.0, le=60.0)
    white_blood_cells: Optional[float] = Field(None, ge=1.0, le=50.0)
    platelets: Optional[int] = Field(None, ge=10000, le=2000000)
    reticulocytes: Optional[float] = Field(None, ge=0.0, le=20.0)
    lactate_dehydrogenase: Optional[int] = Field(None, ge=100, le=2000)
    bilirubin_total: Optional[float] = Field(None, ge=0.1, le=30.0)
    fetal_hemoglobin_percent: Optional[float] = Field(None, ge=0.0, le=30.0)
    crp: Optional[float] = Field(None, ge=0.0, le=500.0)
    creatinine: Optional[float] = Field(None, ge=0.3, le=15.0)


class EnvironmentalFactors(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = Field(None, ge=0, le=100)
    weather: Optional[str] = None
    season: Optional[str] = None
    altitude: Optional[int] = None


class LifestyleFactors(BaseModel):
    hydration_level: Optional[Literal["low", "medium", "high"]] = None
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    stress_level: Optional[int] = Field(None, ge=0, le=10)
    physical_activity: Optional[Literal["none", "light", "moderate", "vigorous"]] = None
    medication_adherence: Optional[float] = Field(None, ge=0.0, le=1.0)


class AssessmentBase(BaseModel):
    assessment_type: AssessmentType = AssessmentType.CRISIS_RISK
    symptoms: Symptoms
    vital_signs: Optional[VitalSigns] = None
    laboratory_results: Optional[LaboratoryResults] = None
    pain_assessment: Optional[PainAssessment] = None
    environmental_factors: Optional[EnvironmentalFactors] = None
    lifestyle_factors: Optional[LifestyleFactors] = None
    clinical_notes: Optional[str] = None
    patient_reported_symptoms: Optional[str] = None


class AssessmentCreate(AssessmentBase):
    patient_id: UUID
    provider_id: Optional[UUID] = None


class AssessmentUpdate(BaseModel):
    symptoms: Optional[Symptoms] = None
    vital_signs: Optional[VitalSigns] = None
    laboratory_results: Optional[LaboratoryResults] = None
    pain_assessment: Optional[PainAssessment] = None
    environmental_factors: Optional[EnvironmentalFactors] = None
    lifestyle_factors: Optional[LifestyleFactors] = None
    clinical_notes: Optional[str] = None
    patient_reported_symptoms: Optional[str] = None


class Assessment(UUIDMixin, AssessmentBase, TimestampMixin):
    patient_id: UUID
    provider_id: Optional[UUID] = None
    assessment_date: datetime
    patient: Optional[Patient] = None
    provider: Optional[Provider] = None
    
    class Config:
        from_attributes = True


# ML Prediction models
class FeatureImportance(BaseModel):
    feature_name: str
    importance_score: float
    description: Optional[str] = None


class Recommendation(BaseModel):
    category: str
    message: str
    priority: Literal["low", "medium", "high", "urgent"]
    action_required: bool = False


class MLPredictionBase(BaseModel):
    model_name: str
    model_version: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: RiskLevel
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    prediction_horizon_hours: int = 48
    feature_importance: List[FeatureImportance] = []
    recommendations: List[Recommendation] = []
    alert_level: AlertLevel = AlertLevel.NONE
    processing_time_ms: Optional[int] = None


class MLPredictionCreate(MLPredictionBase):
    assessment_id: UUID


class MLPrediction(UUIDMixin, MLPredictionBase):
    assessment_id: UUID
    predicted_at: datetime
    assessment: Optional[Assessment] = None
    
    class Config:
        from_attributes = True


# Crisis Episode models
class CrisisEpisodeBase(BaseModel):
    onset_date: datetime
    resolution_date: Optional[datetime] = None
    severity: CrisisSeverity
    trigger_factors: List[str] = []
    symptoms: Dict[str, Any] = {}
    pain_locations: List[str] = []
    max_pain_level: Optional[int] = Field(None, ge=0, le=10)
    treatment_location: Optional[str] = None
    hospitalization_required: bool = False
    length_of_stay_hours: Optional[int] = None
    medications_used: List[str] = []
    procedures_performed: List[str] = []
    complications: List[str] = []
    resolution_notes: Optional[str] = None
    was_predicted: bool = False
    prediction_accuracy: Optional[float] = None


class CrisisEpisodeCreate(CrisisEpisodeBase):
    patient_id: UUID


class CrisisEpisodeUpdate(BaseModel):
    resolution_date: Optional[datetime] = None
    severity: Optional[CrisisSeverity] = None
    complications: Optional[List[str]] = None
    resolution_notes: Optional[str] = None
    prediction_accuracy: Optional[float] = None


class CrisisEpisode(UUIDMixin, CrisisEpisodeBase, TimestampMixin):
    patient_id: UUID
    patient: Optional[Patient] = None
    
    class Config:
        from_attributes = True


# API Response models
class APIResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool


class HealthCheck(BaseModel):
    service: str
    status: Literal["healthy", "unhealthy"]
    timestamp: datetime
    version: str
    dependencies: Dict[str, str] = {}


# Token models for authentication
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None


class TokenData(BaseModel):
    user_id: Optional[UUID] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None
    scopes: List[str] = []