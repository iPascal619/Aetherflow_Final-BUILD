-- Sample data for development and testing
-- AetherFlow v2.0 Database Seed Data

-- Insert sample users (passwords are hashed version of 'password123')
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@aetherflow.com', '$2b$12$LQv3c1yqBwEHxyyQfwExdaxtd7mKatmH.MqJKKumrDrfLw/ZmA5EO', 'admin', true, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'dr.johnson@hospital.com', '$2b$12$LQv3c1yqBwEHxyyQfwExdaxtd7mKatmH.MqJKKumrDrfLw/ZmA5EO', 'provider', true, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'dr.smith@clinic.com', '$2b$12$LQv3c1yqBwEHxyyQfwExdaxtd7mKatmH.MqJKKumrDrfLw/ZmA5EO', 'provider', true, true),
    ('550e8400-e29b-41d4-a716-446655440004', 'patient1@email.com', '$2b$12$LQv3c1yqBwEHxyyQfwExdaxtd7mKatmH.MqJKKumrDrfLw/ZmA5EO', 'patient', true, true),
    ('550e8400-e29b-41d4-a716-446655440005', 'patient2@email.com', '$2b$12$LQv3c1yqBwEHxyyQfwExdaxtd7mKatmH.MqJKKumrDrfLw/ZmA5EO', 'patient', true, true);

-- Insert healthcare providers
INSERT INTO providers (id, user_id, license_number, specialty, organization, phone, address) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 
     '550e8400-e29b-41d4-a716-446655440002', 
     'MD123456', 
     'Hematology', 
     'City General Hospital', 
     '+1-555-0101', 
     '{"street": "123 Medical Drive", "city": "Healthcare City", "state": "HC", "zip": "12345"}'),
    ('650e8400-e29b-41d4-a716-446655440002', 
     '550e8400-e29b-41d4-a716-446655440003', 
     'MD789012', 
     'Internal Medicine', 
     'Community Health Clinic', 
     '+1-555-0102', 
     '{"street": "456 Wellness Way", "city": "Healthcare City", "state": "HC", "zip": "12346"}');

-- Insert sample patients
INSERT INTO patients (id, user_id, provider_id, mrn, first_name, last_name, date_of_birth, gender, phone, genotype, diagnosis_date, blood_type, emergency_contacts, current_medications, medical_history) VALUES
    ('750e8400-e29b-41d4-a716-446655440001',
     '550e8400-e29b-41d4-a716-446655440004',
     '650e8400-e29b-41d4-a716-446655440001',
     'MRN001234',
     'John',
     'Doe',
     '1995-06-15',
     'Male',
     '+1-555-0201',
     'HbSS',
     '1997-01-15',
     'O+',
     '[{"name": "Jane Doe", "relationship": "Mother", "phone": "+1-555-0301"}, {"name": "Emergency Services", "phone": "911"}]',
     '[{"name": "Hydroxyurea", "dosage": "500mg", "frequency": "daily"}, {"name": "Folic Acid", "dosage": "5mg", "frequency": "daily"}]',
     '{"previous_crises": 5, "hospitalizations": 3, "last_crisis": "2024-08-15", "chronic_conditions": ["Sickle Cell Disease", "Chronic Pain"], "surgical_history": []}'),
    ('750e8400-e29b-41d4-a716-446655440002',
     '550e8400-e29b-41d4-a716-446655440005',
     '650e8400-e29b-41d4-a716-446655440001',
     'MRN005678',
     'Sarah',
     'Wilson',
     '1988-03-22',
     'Female',
     '+1-555-0202',
     'HbSC',
     '1990-05-10',
     'A+',
     '[{"name": "Michael Wilson", "relationship": "Spouse", "phone": "+1-555-0302"}, {"name": "Emergency Services", "phone": "911"}]',
     '[{"name": "Hydroxyurea", "dosage": "750mg", "frequency": "daily"}, {"name": "Iron Chelation", "dosage": "20mg/kg", "frequency": "daily"}]',
     '{"previous_crises": 12, "hospitalizations": 8, "last_crisis": "2024-09-01", "chronic_conditions": ["Sickle Cell Disease", "Iron Overload"], "surgical_history": ["Splenectomy 2010"]}');

-- Insert sample assessments
INSERT INTO assessments (id, patient_id, provider_id, assessment_type, assessment_date, symptoms, vital_signs, laboratory_results, pain_assessment, environmental_factors, lifestyle_factors, clinical_notes) VALUES
    ('850e8400-e29b-41d4-a716-446655440001',
     '750e8400-e29b-41d4-a716-446655440001',
     '650e8400-e29b-41d4-a716-446655440001',
     'crisis_risk',
     '2024-09-20 10:30:00+00',
     '{"fatigue": true, "fever": false, "joint_pain": true, "dactylitis": false, "shortness_of_breath": false, "abdominal_pain": true}',
     '{"heart_rate": 95, "blood_pressure_systolic": 128, "blood_pressure_diastolic": 82, "temperature": 98.6, "oxygen_saturation": 97, "respiratory_rate": 16}',
     '{"hemoglobin": 8.2, "hematocrit": 24.5, "white_blood_cells": 11.2, "platelets": 450000, "ldh": 580, "crp": 15.5, "fetal_hemoglobin": 8.5}',
     '{"current_pain_level": 6, "pain_locations": ["lower_back", "joints"], "pain_duration_hours": 12, "pain_quality": "sharp", "pain_triggers": ["stress", "dehydration"]}',
     '{"temperature": 78, "humidity": 45, "weather": "clear", "season": "fall"}',
     '{"hydration_level": "medium", "sleep_hours": 6, "stress_level": 7, "physical_activity": "light", "medication_adherence": 0.9}',
     'Patient reports increasing pain over past 12 hours. Mild dehydration noted. Recommending increased fluid intake and pain management.'),
    ('850e8400-e29b-41d4-a716-446655440002',
     '750e8400-e29b-41d4-a716-446655440002',
     '650e8400-e29b-41d4-a716-446655440001',
     'routine_checkup',
     '2024-09-18 14:15:00+00',
     '{"fatigue": false, "fever": false, "joint_pain": false, "dactylitis": false, "shortness_of_breath": false, "abdominal_pain": false}',
     '{"heart_rate": 72, "blood_pressure_systolic": 118, "blood_pressure_diastolic": 75, "temperature": 98.2, "oxygen_saturation": 99, "respiratory_rate": 14}',
     '{"hemoglobin": 9.8, "hematocrit": 29.1, "white_blood_cells": 7.8, "platelets": 380000, "ldh": 420, "crp": 3.2, "fetal_hemoglobin": 12.1}',
     '{"current_pain_level": 2, "pain_locations": [], "pain_duration_hours": 0, "pain_quality": "none", "pain_triggers": []}',
     '{"temperature": 72, "humidity": 55, "weather": "partly_cloudy", "season": "fall"}',
     '{"hydration_level": "high", "sleep_hours": 8, "stress_level": 3, "physical_activity": "moderate", "medication_adherence": 0.95}',
     'Routine follow-up. Patient doing well on current regimen. Continue current medications.');

-- Insert ML predictions for the assessments
INSERT INTO ml_predictions (id, assessment_id, model_name, model_version, risk_score, risk_level, confidence_score, feature_importance, recommendations, alert_level) VALUES
    ('950e8400-e29b-41d4-a716-446655440001',
     '850e8400-e29b-41d4-a716-446655440001',
     'enhanced_sickle_cell_model',
     'v2.1.0',
     0.735,
     'high',
     0.87,
     '{"pain_level": 0.28, "hemoglobin": 0.19, "ldh": 0.15, "stress_level": 0.12, "hydration": 0.08, "weather": 0.05}',
     '["Increase fluid intake to 3-4 liters per day", "Consider pain management protocol", "Monitor for worsening symptoms", "Follow up in 24 hours", "Consider hospitalization if pain increases"]',
     'medium'),
    ('950e8400-e29b-41d4-a716-446655440002',
     '850e8400-e29b-41d4-a716-446655440002',
     'enhanced_sickle_cell_model',
     'v2.1.0',
     0.125,
     'low',
     0.92,
     '{"fetal_hemoglobin": 0.35, "medication_adherence": 0.22, "hemoglobin": 0.18, "stress_level": 0.10, "sleep_quality": 0.08, "activity_level": 0.07}',
     '["Continue current medication regimen", "Maintain good hydration habits", "Regular exercise as tolerated", "Routine follow-up in 3 months"]',
     'none');

-- Insert sample vital signs time series
INSERT INTO patient_vitals (time, patient_id, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, temperature, oxygen_saturation, pain_level, source) VALUES
    ('2024-09-20 08:00:00+00', '750e8400-e29b-41d4-a716-446655440001', 88, 125, 80, 98.4, 98, 4, 'manual'),
    ('2024-09-20 12:00:00+00', '750e8400-e29b-41d4-a716-446655440001', 92, 128, 82, 98.6, 97, 6, 'manual'),
    ('2024-09-20 16:00:00+00', '750e8400-e29b-41d4-a716-446655440001', 98, 132, 85, 99.1, 96, 7, 'manual'),
    ('2024-09-18 09:00:00+00', '750e8400-e29b-41d4-a716-446655440002', 70, 115, 72, 98.1, 99, 1, 'manual'),
    ('2024-09-18 14:00:00+00', '750e8400-e29b-41d4-a716-446655440002', 72, 118, 75, 98.2, 99, 2, 'manual');

-- Insert sample medications
INSERT INTO medications (id, patient_id, medication_name, generic_name, dosage, frequency, route, start_date, prescribed_by, indication) VALUES
    ('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Hydroxyurea', 'hydroxyurea', '500mg', 'once daily', 'oral', '2020-01-15', 'Dr. Johnson', 'Sickle cell disease management'),
    ('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Folic Acid', 'folic acid', '5mg', 'once daily', 'oral', '2020-01-15', 'Dr. Johnson', 'Prevent folate deficiency'),
    ('a50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'Hydroxyurea', 'hydroxyurea', '750mg', 'once daily', 'oral', '2019-05-10', 'Dr. Johnson', 'Sickle cell disease management'),
    ('a50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 'Deferasirox', 'deferasirox', '20mg/kg', 'once daily', 'oral', '2021-03-20', 'Dr. Johnson', 'Iron chelation therapy');

-- Insert sample crisis episodes
INSERT INTO crisis_episodes (id, patient_id, onset_date, resolution_date, severity, trigger_factors, symptoms, max_pain_level, treatment_location, hospitalization_required, length_of_stay_hours, was_predicted) VALUES
    ('b50e8400-e29b-41d4-a716-446655440001', 
     '750e8400-e29b-41d4-a716-446655440001', 
     '2024-08-15 06:30:00+00', 
     '2024-08-18 10:00:00+00', 
     'moderate', 
     '["dehydration", "stress", "weather_change"]', 
     '{"severe_pain": true, "fever": true, "fatigue": true, "shortness_of_breath": false}',
     9, 
     'hospital', 
     true, 
     72, 
     false),
    ('b50e8400-e29b-41d4-a716-446655440002', 
     '750e8400-e29b-41d4-a716-446655440002', 
     '2024-09-01 14:20:00+00', 
     '2024-09-02 08:00:00+00', 
     'mild', 
     '["menstrual_cycle", "stress"]', 
     '{"mild_pain": true, "fatigue": true, "fever": false}',
     5, 
     'home', 
     false, 
     NULL, 
     true);