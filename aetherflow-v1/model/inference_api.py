# FastAPI Inference Server for Sickle Cell Crisis Prediction
# AetherFlow Medical AI - Lightweight & Interpretable Model

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import joblib
import pandas as pd
import numpy as np
from typing import Optional, List, Dict
import uvicorn
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AetherFlow Sickle Cell Crisis Prediction API",
    description="Lightweight, interpretable AI model for predicting sickle cell crisis within 48 hours",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model_package = None

class PatientData(BaseModel):
    """Patient data model for API input validation."""
    
    # Basic demographics
    age: int = Field(..., ge=0, le=120, description="Patient age in years")
    sex: str = Field(..., description="Patient sex (Male/Female)")
    genotype: str = Field(..., description="Sickle cell genotype (HbSS, HbSC, HbS-beta)")
    
    # Clinical measurements
    pain_level: int = Field(..., ge=0, le=10, description="Current pain level (0-10 scale)")
    hbf_percent: float = Field(..., ge=0, le=100, description="Fetal hemoglobin percentage")
    wbc_count: float = Field(..., ge=0, description="White blood cell count (x10^9/L)")
    ldh: float = Field(..., ge=0, description="Lactate dehydrogenase level (U/L)")
    crp: float = Field(..., ge=0, description="C-reactive protein (mg/L)")
    
    # Symptoms (0 or 1)
    fatigue: int = Field(..., ge=0, le=1, description="Presence of fatigue (0=No, 1=Yes)")
    fever: int = Field(..., ge=0, le=1, description="Presence of fever (0=No, 1=Yes)")
    joint_pain: int = Field(..., ge=0, le=1, description="Presence of joint pain (0=No, 1=Yes)")
    dactylitis: int = Field(..., ge=0, le=1, description="Presence of dactylitis (0=No, 1=Yes)")
    shortness_of_breath: int = Field(..., ge=0, le=1, description="Shortness of breath (0=No, 1=Yes)")
    
    # Medical history
    prior_crises: int = Field(..., ge=0, description="Number of prior crises in past year")
    history_of_acs: int = Field(..., ge=0, le=1, description="History of acute chest syndrome (0=No, 1=Yes)")
    coexisting_asthma: int = Field(..., ge=0, le=1, description="Coexisting asthma (0=No, 1=Yes)")
    
    # Medications
    hydroxyurea: int = Field(..., ge=0, le=1, description="Taking hydroxyurea (0=No, 1=Yes)")
    pain_med: int = Field(..., ge=0, le=1, description="Taking pain medication (0=No, 1=Yes)")
    medication_adherence: float = Field(..., ge=0, le=1, description="Medication adherence (0-1 scale)")
    
    # Lifestyle factors
    hydration_level: str = Field(..., description="Hydration level (Low, Medium, High)")
    sleep_quality: int = Field(..., ge=1, le=6, description="Sleep quality (1-6 scale)")
    reported_stress_level: int = Field(..., ge=0, le=10, description="Stress level (0-10 scale)")
    
    # Environmental factors
    temperature: float = Field(..., description="Ambient temperature (Celsius)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    
    @validator('sex')
    def validate_sex(cls, v):
        if v.lower() not in ['male', 'female', 'm', 'f']:
            raise ValueError('Sex must be Male, Female, M, or F')
        return v.title()
    
    @validator('genotype')
    def validate_genotype(cls, v):
        valid_genotypes = ['HbSS', 'HbSC', 'HbS-beta', 'HbS-Beta']
        if v not in valid_genotypes:
            raise ValueError(f'Genotype must be one of: {valid_genotypes}')
        return v
    
    @validator('hydration_level')
    def validate_hydration(cls, v):
        if v.lower() not in ['low', 'medium', 'high']:
            raise ValueError('Hydration level must be Low, Medium, or High')
        return v.title()

class RiskFactor(BaseModel):
    """Risk factor model."""
    factor: str = Field(..., description="Risk factor name")
    contribution: float = Field(..., description="Contribution score")

class PredictionResponse(BaseModel):
    """Response model for crisis prediction."""
    crisis_probability: float = Field(..., description="Probability of crisis in next 48 hours (0-1)")
    risk_level: str = Field(..., description="Risk level (Low, Medium, High)")
    confidence: str = Field(..., description="Model confidence level")
    top_risk_factors: List[RiskFactor] = Field(..., description="Top contributing risk factors")
    recommendations: List[str] = Field(..., description="Clinical recommendations")
    model_version: str = Field(..., description="Model version used")
    prediction_timestamp: str = Field(..., description="Timestamp of prediction")

def load_model():
    """Load the trained model package."""
    global model_package
    try:
        # Get the directory where this script is located
        import os
        import sys
        
        # Check if running as PyInstaller executable
        if getattr(sys, 'frozen', False):
            # Running as executable - model files are in the same directory as the executable
            script_dir = sys._MEIPASS
        else:
            # Running as script - model files are in the same directory as the script
            script_dir = os.path.dirname(os.path.abspath(__file__))
        
        model_path = os.path.join(script_dir, 'enhanced_sickle_cell_model.pkl')
        
        model_package = joblib.load(model_path)
        logger.info(f"Model loaded successfully from {model_path}")
        return True
    except FileNotFoundError:
        logger.error("Model file not found. Please train the model first.")
        return False
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

def create_advanced_features(df):
    """Create the same advanced features used during training."""
    # Pain-related interaction features
    df['PainLevel_squared'] = df['PainLevel'] ** 2
    df['PainLevel_cubed'] = df['PainLevel'] ** 3
    df['Pain_Fatigue_interaction'] = df['PainLevel'] * df['Fatigue']
    df['Pain_JointPain_interaction'] = df['PainLevel'] * df['JointPain']
    
    # Lab marker ratios and combinations
    df['WBC_LDH_ratio'] = df['WBC_Count'] / (df['LDH'] + 1e-6)
    df['CRP_WBC_ratio'] = df['CRP'] / (df['WBC_Count'] + 1e-6)
    df['Lab_crisis_score'] = df['WBC_Count'] * 0.1 + df['LDH'] * 0.001 + df['CRP'] * 0.1
    
    # Symptom clustering
    df['Respiratory_symptoms'] = df['Shortness_of_Breath'] + df['Coexisting_Asthma']
    df['Total_symptoms'] = (df['Fatigue'] + df['Fever'] + df['JointPain'] + 
                           df['Dactylitis'] + df['Shortness_of_Breath'])
    
    # Medication effectiveness
    df['Med_adherence_HU_interaction'] = df['MedicationAdherence'] * df['Hydroxyurea']
    df['Total_medications'] = df['Hydroxyurea'] + df['PainMed']
    
    # Environmental stress factors
    df['Temp_deviation'] = np.abs(df['Temperature'] - 25)
    df['Humidity_stress'] = np.where(df['Humidity'] > 70, df['Humidity'] - 70, 0)
    df['Environmental_stress'] = df['Temp_deviation'] + df['Humidity_stress'] * 0.1
    
    # Age-genotype interactions
    df['Age_HbSS_interaction'] = df['Age'] * (df['Genotype'] == 'HbSS').astype(int)
    df['Age_squared'] = df['Age'] ** 2
    
    # Crisis history patterns
    df['Crisis_risk_score'] = (df['PriorCrises'] * 2 + df['History_of_ACS'] * 3 + 
                              df['Coexisting_Asthma'] * 1.5)
    
    # Sleep and stress combined
    df['Sleep_stress_combined'] = (6 - df['Sleep_Quality']) + df['Reported_Stress_Level']
    
    # HbF protective effect
    df['HbF_protective_score'] = np.where(df['HbF_percent'] > 5, 
                                         (df['HbF_percent'] - 5) * -0.2, 0)
    
    return df

def get_risk_level(probability):
    """Determine risk level based on probability."""
    if probability < 0.3:
        return "Low"
    elif probability < 0.7:
        return "Medium"
    else:
        return "High"

def get_confidence_level(probability):
    """Determine confidence level based on probability distribution."""
    if probability < 0.1 or probability > 0.9:
        return "High"
    elif probability < 0.2 or probability > 0.8:
        return "Medium"
    else:
        return "Moderate"

def get_top_risk_factors(patient_df, feature_importance):
    """Get top contributing risk factors for this patient."""
    risk_factors = []
    
    # Get feature values for the patient
    for _, row in feature_importance.iterrows():
        feature_name = row['feature']
        importance = row['importance']
        
        if feature_name in patient_df.columns:
            value = patient_df[feature_name].iloc[0]
            risk_factors.append(RiskFactor(
                factor=feature_name.replace('_', ' ').title(),
                contribution=float(importance * value)
            ))
    
    # Sort by contribution and return top 5
    risk_factors.sort(key=lambda x: abs(x.contribution), reverse=True)
    return risk_factors[:5]

def get_recommendations(probability, patient_data):
    """Generate clinical recommendations based on risk level."""
    recommendations = []
    
    if probability > 0.7:
        recommendations.extend([
            "Immediate medical attention recommended",
            "Consider hospitalization or emergency care",
            "Increase pain management protocols",
            "Monitor vital signs closely"
        ])
    elif probability > 0.3:
        recommendations.extend([
            "Close monitoring recommended",
            "Ensure adequate hydration",
            "Review pain management strategy",
            "Consider preventive interventions"
        ])
    else:
        recommendations.extend([
            "Continue routine care",
            "Maintain medication adherence",
            "Monitor for symptom changes"
        ])
    
    # Add specific recommendations based on patient factors
    if patient_data.pain_level > 7:
        recommendations.append("Address high pain levels immediately")
    
    if patient_data.medication_adherence < 0.8:
        recommendations.append("Improve medication adherence")
    
    if patient_data.hydration_level.lower() == 'low':
        recommendations.append("Increase fluid intake")
    
    return recommendations

@app.on_event("startup")
async def startup_event():
    """Load model on startup."""
    success = load_model()
    if not success:
        logger.error("Failed to load model on startup")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "AetherFlow Sickle Cell Crisis Prediction API",
        "version": "1.0.0",
        "status": "active",
        "model_loaded": model_package is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model_package is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_crisis(patient_data: PatientData):
    """Predict sickle cell crisis probability for a patient."""
    
    if model_package is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert patient data to DataFrame
        patient_dict = patient_data.dict()
        
        # Map field names to match training data
        field_mapping = {
            'pain_level': 'PainLevel',
            'hbf_percent': 'HbF_percent',
            'wbc_count': 'WBC_Count',
            'ldh': 'LDH',
            'crp': 'CRP',
            'fatigue': 'Fatigue',
            'fever': 'Fever',
            'joint_pain': 'JointPain',
            'dactylitis': 'Dactylitis',
            'shortness_of_breath': 'Shortness_of_Breath',
            'prior_crises': 'PriorCrises',
            'history_of_acs': 'History_of_ACS',
            'coexisting_asthma': 'Coexisting_Asthma',
            'hydroxyurea': 'Hydroxyurea',
            'pain_med': 'PainMed',
            'medication_adherence': 'MedicationAdherence',
            'hydration_level': 'HydrationLevel',
            'sleep_quality': 'Sleep_Quality',
            'reported_stress_level': 'Reported_Stress_Level',
            'temperature': 'Temperature',
            'humidity': 'Humidity',
            'age': 'Age',
            'sex': 'Sex',
            'genotype': 'Genotype'
        }
        
        # Apply field mapping
        mapped_data = {}
        for api_field, model_field in field_mapping.items():
            if api_field in patient_dict:
                mapped_data[model_field] = patient_dict[api_field]
        
        patient_df = pd.DataFrame([mapped_data])
        
        # Create advanced features
        patient_df = create_advanced_features(patient_df)
        
        # Apply label encoding for categorical variables
        for col in ['Sex', 'Genotype', 'HydrationLevel']:
            if col in patient_df.columns and col in model_package['label_encoders']:
                patient_df[col] = model_package['label_encoders'][col].transform(patient_df[col].astype(str))
        
        # Ensure all features are present
        for feature in model_package['feature_names']:
            if feature not in patient_df.columns:
                patient_df[feature] = 0
        
        # Select and order features
        X = patient_df[model_package['feature_names']]
        
        # Preprocess and select features
        X_processed = model_package['preprocessor'].transform(X)
        X_selected = model_package['feature_selector'].transform(X_processed)
        
        # Make prediction
        probability = model_package['model'].predict_proba(X_selected)[:, 1][0]
        
        # Get feature importance for interpretation
        selected_features = model_package['feature_selector'].get_support()
        selected_feature_names = [model_package['feature_names'][i] for i in range(len(selected_features)) if selected_features[i]]
        
        importance = np.abs(model_package['model'].coef_[0])
        importance_df = pd.DataFrame({
            'feature': selected_feature_names,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        # Generate response
        risk_level = get_risk_level(probability)
        confidence = get_confidence_level(probability)
        top_risk_factors = get_top_risk_factors(patient_df, importance_df.head(10))
        recommendations = get_recommendations(probability, patient_data)
        
        response = PredictionResponse(
            crisis_probability=float(probability),
            risk_level=risk_level,
            confidence=confidence,
            top_risk_factors=top_risk_factors,
            recommendations=recommendations,
            model_version=model_package['model_info'].get('best_model', 'Unknown'),
            prediction_timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"Prediction made: {probability:.4f} risk level: {risk_level}")
        return response
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model."""
    if model_package is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_info": model_package.get('model_info', {}),
        "feature_count": len(model_package.get('feature_names', [])),
        "model_type": type(model_package['model']).__name__
    }

if __name__ == "__main__":
    # Run the API server
    uvicorn.run(
        "inference_api:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
