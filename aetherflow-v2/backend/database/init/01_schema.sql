-- AetherFlow v2.0 Database Schema
-- Modern PostgreSQL schema with proper normalization and indexing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'patient',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Healthcare providers
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100),
    specialty VARCHAR(100),
    organization VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients table with comprehensive medical information
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id),
    mrn VARCHAR(50) UNIQUE, -- Medical Record Number
    
    -- Basic Demographics
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    
    -- Medical Information
    genotype VARCHAR(20) NOT NULL, -- HbSS, HbSC, HbS-beta
    diagnosis_date DATE,
    blood_type VARCHAR(10),
    
    -- Emergency Contacts
    emergency_contacts JSONB DEFAULT '[]',
    
    -- Medical History
    allergies TEXT[],
    current_medications JSONB DEFAULT '[]',
    medical_history JSONB DEFAULT '{}',
    
    -- System fields
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table for storing evaluation data
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id),
    
    -- Assessment metadata
    assessment_type VARCHAR(50) DEFAULT 'crisis_risk', -- crisis_risk, routine_checkup, emergency
    assessment_date TIMESTAMPTZ DEFAULT NOW(),
    
    -- Clinical data (structured as JSONB for flexibility)
    symptoms JSONB NOT NULL DEFAULT '{}',
    vital_signs JSONB DEFAULT '{}',
    laboratory_results JSONB DEFAULT '{}',
    pain_assessment JSONB DEFAULT '{}',
    
    -- Risk factors
    environmental_factors JSONB DEFAULT '{}',
    lifestyle_factors JSONB DEFAULT '{}',
    medication_adherence JSONB DEFAULT '{}',
    
    -- Assessment notes
    clinical_notes TEXT,
    patient_reported_symptoms TEXT,
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML Predictions table
CREATE TABLE ml_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    
    -- Model information
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    
    -- Prediction results
    risk_score DECIMAL(5,3) NOT NULL, -- 0.000 to 1.000
    risk_level VARCHAR(20) NOT NULL, -- low, medium, high, critical
    confidence_score DECIMAL(5,3),
    
    -- Prediction timeline
    prediction_horizon_hours INTEGER DEFAULT 48,
    predicted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Explanations and interpretability
    feature_importance JSONB DEFAULT '{}',
    shap_values JSONB DEFAULT '{}',
    risk_factors JSONB DEFAULT '{}',
    
    -- Recommendations
    recommendations JSONB DEFAULT '[]',
    alert_level VARCHAR(20) DEFAULT 'none', -- none, low, medium, high, emergency
    
    -- Model metadata
    processing_time_ms INTEGER,
    model_drift_score DECIMAL(5,3),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient vitals time series (for trend analysis)
CREATE TABLE patient_vitals (
    time TIMESTAMPTZ NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Vital signs
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    temperature DECIMAL(4,1),
    oxygen_saturation INTEGER,
    respiratory_rate INTEGER,
    
    -- Pain assessment
    pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
    pain_location TEXT[],
    
    -- Source information
    source VARCHAR(50) DEFAULT 'manual', -- manual, device, ehr_import
    device_id VARCHAR(100),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laboratory results time series
CREATE TABLE laboratory_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id),
    
    -- Lab metadata
    lab_date TIMESTAMPTZ NOT NULL,
    lab_facility VARCHAR(255),
    ordering_provider VARCHAR(255),
    
    -- Hematology
    hemoglobin DECIMAL(4,1),
    hematocrit DECIMAL(4,1),
    white_blood_cells DECIMAL(6,1),
    platelets INTEGER,
    reticulocytes DECIMAL(4,1),
    
    -- Chemistry
    lactate_dehydrogenase INTEGER,
    bilirubin_total DECIMAL(4,1),
    bilirubin_direct DECIMAL(4,1),
    
    -- Sickle cell specific
    fetal_hemoglobin_percent DECIMAL(4,1),
    sickle_cell_count DECIMAL(4,1),
    
    -- Inflammatory markers
    crp DECIMAL(6,1), -- C-reactive protein
    esr INTEGER, -- Erythrocyte sedimentation rate
    
    -- Other relevant labs
    creatinine DECIMAL(4,1),
    blood_urea_nitrogen INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication tracking
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Medication details
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(50),
    
    -- Treatment period
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Adherence tracking
    prescribed_by VARCHAR(255),
    indication TEXT,
    side_effects TEXT[],
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crisis episodes tracking
CREATE TABLE crisis_episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Episode details
    onset_date TIMESTAMPTZ NOT NULL,
    resolution_date TIMESTAMPTZ,
    severity VARCHAR(20) NOT NULL, -- mild, moderate, severe, life_threatening
    
    -- Clinical presentation
    trigger_factors TEXT[],
    symptoms JSONB NOT NULL DEFAULT '{}',
    pain_locations TEXT[],
    max_pain_level INTEGER,
    
    -- Treatment
    treatment_location VARCHAR(100), -- home, clinic, emergency_room, hospital
    hospitalization_required BOOLEAN DEFAULT FALSE,
    length_of_stay_hours INTEGER,
    
    -- Interventions
    medications_used JSONB DEFAULT '[]',
    procedures_performed TEXT[],
    
    -- Outcomes
    complications TEXT[],
    resolution_notes TEXT,
    
    -- Prediction accuracy (if predicted)
    was_predicted BOOLEAN DEFAULT FALSE,
    prediction_accuracy DECIMAL(5,3),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    patient_id UUID REFERENCES patients(id),
    
    -- Action details
    action VARCHAR(100) NOT NULL, -- login, view_patient, update_assessment, etc.
    resource_type VARCHAR(50),
    resource_id UUID,
    
    -- Request details
    ip_address INET,
    user_agent TEXT,
    endpoint VARCHAR(255),
    http_method VARCHAR(10),
    
    -- Data changes (for update/delete actions)
    old_values JSONB,
    new_values JSONB,
    
    -- Timestamps
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(255)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_provider ON patients(provider_id);
CREATE INDEX idx_patients_genotype ON patients(genotype);
CREATE INDEX idx_assessments_patient ON assessments(patient_id);
CREATE INDEX idx_assessments_date ON assessments(assessment_date);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_predictions_assessment ON ml_predictions(assessment_id);
CREATE INDEX idx_predictions_model ON ml_predictions(model_name, model_version);
CREATE INDEX idx_predictions_risk ON ml_predictions(risk_level, risk_score);
CREATE INDEX idx_vitals_patient_time ON patient_vitals(patient_id, time);
CREATE INDEX idx_labs_patient_date ON laboratory_results(patient_id, lab_date);
CREATE INDEX idx_medications_patient_active ON medications(patient_id, is_active);
CREATE INDEX idx_crisis_patient_date ON crisis_episodes(patient_id, onset_date);
CREATE INDEX idx_audit_user_timestamp ON audit_logs(user_id, timestamp);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crisis_episodes_updated_at BEFORE UPDATE ON crisis_episodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();