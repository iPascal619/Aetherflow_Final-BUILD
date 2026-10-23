// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'nurse' | 'admin';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: string;
}

// Patient types
export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_type: string;
  phone: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  diagnosis_date: string;
  current_medications: string[];
  allergies: string[];
  medical_history: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreatePatientRequest {
  name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_type: string;
  phone: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  diagnosis_date: string;
  current_medications?: string[];
  allergies?: string[];
  medical_history?: string[];
}

export type UpdatePatientRequest = Partial<CreatePatientRequest>;

// Assessment types
export interface Assessment {
  id: string;
  patient_id: string;
  assessment_date: string;
  vital_signs: {
    systolic_bp: number;
    diastolic_bp: number;
    heart_rate: number;
    temperature: number;
    respiratory_rate: number;
    o2_saturation: number;
  };
  lab_results: {
    hb_level: number;
    wbc_count: number;
    platelet_count: number;
    creatinine: number;
    bilirubin: number;
    reticulocyte_count: number;
  };
  symptoms: string[];
  pain_score: number;
  crisis_occurred: boolean;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface CreateAssessmentRequest {
  assessment_date: string;
  vital_signs: {
    systolic_bp: number;
    diastolic_bp: number;
    heart_rate: number;
    temperature: number;
    respiratory_rate: number;
    o2_saturation: number;
  };
  lab_results: {
    hb_level: number;
    wbc_count: number;
    platelet_count: number;
    creatinine: number;
    bilirubin: number;
    reticulocyte_count: number;
  };
  symptoms: string[];
  pain_score: number;
  crisis_occurred?: boolean;
  notes?: string;
}

// ML Prediction types
export interface PredictionRequest {
  patient_id?: string;
  age: number;
  hb_level: number;
  pain_score: number;
  systolic_bp: number;
  diastolic_bp: number;
  heart_rate: number;
  temperature: number;
  respiratory_rate: number;
  wbc_count: number;
  platelet_count: number;
  creatinine: number;
  bilirubin: number;
  reticulocyte_count: number;
  o2_saturation: number;
  previous_crises_6_months?: number;
  days_since_last_crisis?: number;
  current_medications?: string[];
  symptoms?: string[];
}

export interface PredictionResponse {
  patient_id?: string;
  prediction: {
    crisis_probability: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    confidence_score: number;
  };
  explanation: {
    top_risk_factors: Array<{
      feature: string;
      importance: number;
      value: number;
      description: string;
    }>;
    protective_factors: Array<{
      feature: string;
      importance: number;
      value: number;
      description: string;
    }>;
  };
  recommendations: {
    immediate_actions: string[];
    monitoring_suggestions: string[];
    medication_adjustments: string[];
    lifestyle_recommendations: string[];
  };
  timestamp: string;
  model_version: string;
}

export interface ModelInfo {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  features: string[];
  training_date: string;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface APIError {
  detail: string;
  status_code?: number;
}

// Chart/Visualization types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface RiskTrendData {
  date: string;
  risk_level: number;
  crisis_occurred: boolean;
  pain_score: number;
}

// Dashboard types
export interface DashboardStats {
  total_patients: number;
  high_risk_patients: number;
  recent_assessments: number;
  crisis_rate_30_days: number;
  average_risk_score: number;
}