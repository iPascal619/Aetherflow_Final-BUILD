"""
ML Service for AetherFlow v2.0
Advanced machine learning service for sickle cell crisis prediction
"""

import os
import time
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

import httpx
import shap
from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sklearn.ensemble import RandomForestClassifier
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models import (
    Assessment, MLPrediction, MLPredictionCreate,
    FeatureImportance, Recommendation, RiskLevel, AlertLevel,
    APIResponse, HealthCheck
)
from shared.database import get_db_session

app = FastAPI(
    title="AetherFlow ML Service",
    description="Machine learning service for sickle cell crisis prediction",
    version="2.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
MODEL_PATH = os.getenv("MODEL_PATH", "/app/models")

# Auth client
auth_client = httpx.AsyncClient(base_url=AUTH_SERVICE_URL)

# Global model variables
model = None
explainer = None
feature_names = []
model_version = "2.1.0"
model_name = "enhanced_sickle_cell_ensemble"


class MLModelManager:
    """Manages ML model loading and predictions"""
    
    def __init__(self):
        self.model = None
        self.explainer = None
        self.feature_names = []
        self.model_loaded = False
    
    def load_model(self):
        """Load the ML model and setup explainer"""
        try:
            # Load the trained model
            model_file = os.path.join(MODEL_PATH, "enhanced_sickle_cell_model.pkl")
            if os.path.exists(model_file):
                self.model = joblib.load(model_file)
                
                # Define feature names (should match training data)
                self.feature_names = [
                    'age', 'sex_encoded', 'genotype_encoded',
                    'pain_level', 'hbf_percent', 'wbc_count', 'ldh', 'crp',
                    'fatigue', 'fever', 'joint_pain', 'dactylitis', 'shortness_of_breath',
                    'prior_crises', 'history_of_acs', 'coexisting_asthma',
                    'hydroxyurea', 'pain_med', 'medication_adherence',
                    'hydration_encoded', 'sleep_quality', 'stress_level',
                    'temperature', 'humidity'
                ]
                
                # Initialize SHAP explainer for model interpretability
                # Create sample data for explainer initialization
                X_sample = np.random.random((100, len(self.feature_names)))
                self.explainer = shap.TreeExplainer(self.model)
                
                self.model_loaded = True
                print(f"✅ Model loaded successfully: {model_file}")
                
            else:
                print(f"❌ Model file not found: {model_file}")
                # Create a dummy model for development
                self.create_dummy_model()
                
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.create_dummy_model()
    
    def create_dummy_model(self):
        """Create a dummy model for development/testing"""
        print("🔧 Creating dummy model for development...")
        
        self.feature_names = [
            'age', 'sex_encoded', 'genotype_encoded',
            'pain_level', 'hbf_percent', 'wbc_count', 'ldh', 'crp',
            'fatigue', 'fever', 'joint_pain', 'dactylitis', 'shortness_of_breath',
            'prior_crises', 'history_of_acs', 'coexisting_asthma',
            'hydroxyurea', 'pain_med', 'medication_adherence',
            'hydration_encoded', 'sleep_quality', 'stress_level',
            'temperature', 'humidity'
        ]
        
        # Create simple random forest for testing
        X_dummy = np.random.random((1000, len(self.feature_names)))
        y_dummy = np.random.binomial(1, 0.3, 1000)  # 30% positive class
        
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.model.fit(X_dummy, y_dummy)
        
        self.explainer = shap.TreeExplainer(self.model)
        self.model_loaded = True
        print("✅ Dummy model created successfully")
    
    def preprocess_assessment_data(self, assessment: Assessment) -> np.ndarray:
        """Convert assessment data to model features"""
        features = {}
        
        # Extract patient demographics (would need patient data from assessment)
        features['age'] = 25  # Default/estimated
        features['sex_encoded'] = 1  # 1=Male, 0=Female (would get from patient)
        features['genotype_encoded'] = 2  # 0=HbSC, 1=HbS-beta, 2=HbSS
        
        # Pain assessment
        pain_level = 0
        if assessment.pain_assessment:
            pain_level = assessment.pain_assessment.get('current_pain_level', 0)
        features['pain_level'] = pain_level
        
        # Laboratory results
        lab_results = assessment.laboratory_results or {}
        features['hbf_percent'] = lab_results.get('fetal_hemoglobin_percent', 8.0)
        features['wbc_count'] = lab_results.get('white_blood_cells', 8.0)
        features['ldh'] = lab_results.get('lactate_dehydrogenase', 400)
        features['crp'] = lab_results.get('crp', 5.0)
        
        # Symptoms (boolean converted to int)
        symptoms = assessment.symptoms or {}
        features['fatigue'] = int(symptoms.get('fatigue', False))
        features['fever'] = int(symptoms.get('fever', False))
        features['joint_pain'] = int(symptoms.get('joint_pain', False))
        features['dactylitis'] = int(symptoms.get('dactylitis', False))
        features['shortness_of_breath'] = int(symptoms.get('shortness_of_breath', False))
        
        # Medical history (would need from patient record)
        features['prior_crises'] = 3  # Default
        features['history_of_acs'] = 0
        features['coexisting_asthma'] = 0
        
        # Medications
        features['hydroxyurea'] = 1  # Assume on hydroxyurea
        features['pain_med'] = 1 if pain_level > 5 else 0
        
        # Lifestyle factors
        lifestyle = assessment.lifestyle_factors or {}
        features['medication_adherence'] = lifestyle.get('medication_adherence', 0.8)
        features['sleep_quality'] = lifestyle.get('sleep_hours', 7) / 12 * 6  # Convert to 1-6 scale
        features['stress_level'] = lifestyle.get('stress_level', 5)
        
        # Hydration (encode categorical to numeric)
        hydration = lifestyle.get('hydration_level', 'medium')
        hydration_map = {'low': 0, 'medium': 1, 'high': 2}
        features['hydration_encoded'] = hydration_map.get(hydration.lower(), 1)
        
        # Environmental factors
        env = assessment.environmental_factors or {}
        features['temperature'] = env.get('temperature', 72)
        features['humidity'] = env.get('humidity', 50)
        
        # Convert to numpy array in correct order
        feature_array = np.array([features[name] for name in self.feature_names])
        return feature_array.reshape(1, -1)
    
    def predict(self, assessment: Assessment) -> Dict[str, Any]:
        """Make prediction for assessment"""
        if not self.model_loaded:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded"
            )
        
        start_time = time.time()
        
        # Preprocess data
        X = self.preprocess_assessment_data(assessment)
        
        # Make prediction
        prediction_proba = self.model.predict_proba(X)[0]
        risk_score = prediction_proba[1]  # Probability of crisis
        
        # Determine risk level
        if risk_score < 0.2:
            risk_level = RiskLevel.LOW
            alert_level = AlertLevel.NONE
        elif risk_score < 0.4:
            risk_level = RiskLevel.MEDIUM
            alert_level = AlertLevel.LOW
        elif risk_score < 0.7:
            risk_level = RiskLevel.HIGH
            alert_level = AlertLevel.MEDIUM
        else:
            risk_level = RiskLevel.CRITICAL
            alert_level = AlertLevel.HIGH
        
        # Calculate SHAP values for interpretability
        try:
            shap_values = self.explainer.shap_values(X)
            if isinstance(shap_values, list):
                shap_values = shap_values[1]  # Get positive class SHAP values
            
            # Create feature importance list
            feature_importance = []
            for i, (feature, importance) in enumerate(zip(self.feature_names, shap_values[0])):
                feature_importance.append({
                    'feature_name': feature,
                    'importance_score': float(abs(importance)),
                    'description': self.get_feature_description(feature)
                })
            
            # Sort by importance
            feature_importance.sort(key=lambda x: x['importance_score'], reverse=True)
            
        except Exception as e:
            print(f"Error calculating SHAP values: {e}")
            # Fallback to model feature importance
            if hasattr(self.model, 'feature_importances_'):
                importances = self.model.feature_importances_
                feature_importance = [
                    {
                        'feature_name': feature,
                        'importance_score': float(importance),
                        'description': self.get_feature_description(feature)
                    }
                    for feature, importance in zip(self.feature_names, importances)
                ]
                feature_importance.sort(key=lambda x: x['importance_score'], reverse=True)
            else:
                feature_importance = []
        
        # Generate recommendations
        recommendations = self.generate_recommendations(risk_level, assessment, feature_importance)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            'risk_score': float(risk_score),
            'risk_level': risk_level,
            'confidence_score': 0.85,  # Would be calculated from model uncertainty
            'feature_importance': feature_importance[:10],  # Top 10 features
            'recommendations': recommendations,
            'alert_level': alert_level,
            'processing_time_ms': processing_time
        }
    
    def get_feature_description(self, feature_name: str) -> str:
        """Get human-readable description for feature"""
        descriptions = {
            'age': 'Patient age',
            'pain_level': 'Current pain level (0-10)',
            'hbf_percent': 'Fetal hemoglobin percentage',
            'wbc_count': 'White blood cell count',
            'ldh': 'Lactate dehydrogenase level',
            'crp': 'C-reactive protein',
            'fatigue': 'Presence of fatigue',
            'fever': 'Presence of fever',
            'joint_pain': 'Joint pain symptoms',
            'stress_level': 'Reported stress level',
            'medication_adherence': 'Medication compliance',
            'hydration_encoded': 'Hydration level',
            'temperature': 'Environmental temperature',
            'humidity': 'Environmental humidity'
        }
        return descriptions.get(feature_name, feature_name.replace('_', ' ').title())
    
    def generate_recommendations(self, risk_level: RiskLevel, assessment: Assessment, 
                               feature_importance: List[Dict]) -> List[Dict]:
        """Generate clinical recommendations based on prediction"""
        recommendations = []
        
        if risk_level == RiskLevel.CRITICAL:
            recommendations.extend([
                {
                    'category': 'immediate_action',
                    'message': 'Seek immediate medical attention - high crisis risk detected',
                    'priority': 'urgent',
                    'action_required': True
                },
                {
                    'category': 'monitoring',
                    'message': 'Monitor vital signs closely and prepare for potential hospitalization',
                    'priority': 'urgent',
                    'action_required': True
                }
            ])
        
        elif risk_level == RiskLevel.HIGH:
            recommendations.extend([
                {
                    'category': 'medical_care',
                    'message': 'Contact healthcare provider within 4-6 hours',
                    'priority': 'high',
                    'action_required': True
                },
                {
                    'category': 'pain_management',
                    'message': 'Initiate pain management protocol if not already started',
                    'priority': 'high',
                    'action_required': True
                }
            ])
        
        # Add specific recommendations based on top risk factors
        for factor in feature_importance[:3]:
            if factor['feature_name'] == 'pain_level' and factor['importance_score'] > 0.1:
                recommendations.append({
                    'category': 'pain_management',
                    'message': 'Pain level is a significant risk factor - ensure adequate pain control',
                    'priority': 'high',
                    'action_required': True
                })
            elif factor['feature_name'] == 'hydration_encoded' and factor['importance_score'] > 0.1:
                recommendations.append({
                    'category': 'lifestyle',
                    'message': 'Increase fluid intake to 3-4 liters per day',
                    'priority': 'medium',
                    'action_required': False
                })
        
        # Always include general recommendations
        recommendations.extend([
            {
                'category': 'hydration',
                'message': 'Maintain adequate hydration throughout the day',
                'priority': 'medium',
                'action_required': False
            },
            {
                'category': 'medication',
                'message': 'Continue prescribed medications as directed',
                'priority': 'medium',
                'action_required': False
            }
        ])
        
        return recommendations


# Initialize model manager
ml_manager = MLModelManager()


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


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    ml_manager.load_model()


@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    try:
        # Test auth service connection
        response = await auth_client.get("/health", timeout=5.0)
        auth_status = "healthy" if response.status_code == 200 else "unhealthy"
    except Exception:
        auth_status = "unhealthy"
    
    model_status = "healthy" if ml_manager.model_loaded else "unhealthy"
    
    return HealthCheck(
        service="ml-service",
        status="healthy" if all([auth_status == "healthy", model_status == "healthy"]) else "degraded",
        timestamp=datetime.utcnow(),
        version="2.0.0",
        dependencies={
            "auth-service": auth_status,
            "ml-model": model_status
        }
    )


@app.post("/predict/{assessment_id}", response_model=MLPrediction)
async def predict_crisis_risk(
    assessment_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """Predict crisis risk for assessment"""
    
    # Get assessment
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )
    
    # Make prediction
    prediction_data = ml_manager.predict(assessment)
    
    # Create prediction record
    ml_prediction = MLPrediction(
        assessment_id=assessment_id,
        model_name=model_name,
        model_version=model_version,
        risk_score=prediction_data['risk_score'],
        risk_level=prediction_data['risk_level'],
        confidence_score=prediction_data['confidence_score'],
        feature_importance=prediction_data['feature_importance'],
        recommendations=prediction_data['recommendations'],
        alert_level=prediction_data['alert_level'],
        processing_time_ms=prediction_data['processing_time_ms'],
        predicted_at=datetime.utcnow()
    )
    
    db.add(ml_prediction)
    await db.commit()
    await db.refresh(ml_prediction)
    
    return ml_prediction


@app.get("/models/info")
async def get_model_info():
    """Get information about the loaded model"""
    return {
        "model_name": model_name,
        "model_version": model_version,
        "model_loaded": ml_manager.model_loaded,
        "feature_count": len(ml_manager.feature_names),
        "features": ml_manager.feature_names
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)