import axios, { AxiosError, AxiosResponse } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
  Assessment,
  CreateAssessmentRequest,
  PredictionRequest,
  PredictionResponse,
  ModelInfo,
  PaginatedResponse,
  APIError,
} from './types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.headers?.['X-Retry']
    ) {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            originalRequest.headers['X-Retry'] = 'true';
          }

          return api(originalRequest);
        }
      } catch {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API endpoint helpers
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/api/auth/login', data),
  
  register: (data: RegisterRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/api/auth/register', data),
  
  logout: () => api.post('/api/auth/logout'),
  
  refresh: (refreshToken: string) =>
    api.post('/api/auth/refresh', { refresh_token: refreshToken }),
  
  validate: () => api.get('/api/auth/validate'),
};

export const patientAPI = {
  getAll: (params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<PaginatedResponse<Patient>>> => 
    api.get('/api/patients', { params }),
  
  getById: (id: string): Promise<AxiosResponse<Patient>> => 
    api.get(`/api/patients/${id}`),
  
  create: (data: CreatePatientRequest): Promise<AxiosResponse<Patient>> => 
    api.post('/api/patients', data),
  
  update: (id: string, data: UpdatePatientRequest): Promise<AxiosResponse<Patient>> => 
    api.put(`/api/patients/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/patients/${id}`),
  
  getAssessments: (patientId: string): Promise<AxiosResponse<Assessment[]>> =>
    api.get(`/api/patients/${patientId}/assessments`),
  
  createAssessment: (patientId: string, data: CreateAssessmentRequest): Promise<AxiosResponse<Assessment>> =>
    api.post(`/api/patients/${patientId}/assessments`, data),
};

export const mlAPI = {
  predict: (data: PredictionRequest): Promise<AxiosResponse<PredictionResponse>> => 
    api.post('/api/ml/predict', data),
  
  getModelInfo: (): Promise<AxiosResponse<ModelInfo>> => 
    api.get('/api/ml/model-info'),
};

// Error handling utility
export const handleAPIError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data as APIError;
    const message = errorData?.detail || 'An error occurred';
    return { message, status: error.response.status };
  } else if (error.request) {
    // Request made but no response received
    return { message: 'Network error. Please check your connection.', status: 0 };
  } else {
    // Something else happened
    return { message: error.message, status: 0 };
  }
};