import axios from 'axios';
import type { UsersResponse } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

// Static vendor portal header required by backend for all requests
const VENDOR_PORTAL = "waterinn.hydrohub.ai";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
    'x-vendor-portal': VENDOR_PORTAL,
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (!config.headers) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers = {};
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-vendor-portal'] = VENDOR_PORTAL;

  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/#/login-access';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    // Add other user fields as needed
  };
}

export interface RequestResetPasswordData {
  email?: string;
  phone?: string;
}

export interface ResetPasswordData {
  email?: string;
  phone?: string;
  code: string;
  newPassword: string;
}

export const authService = {
  login: async (credentials: LoginCredentials, userType: string): Promise<LoginResponse> => {
    const response = await api.post(`/auth/${userType}/login`, credentials);
    return response.data;
  },
  
  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/getProfile');
    return response.data;
  },
  
  requestResetPassword: async (data: RequestResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/request-password-reset', data);
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};

export interface CreateUserData {
  username: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  firstName: string;
  lastName: string;
  fathersName?: string;
  userRole: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  maritalStatus?: string;
  profilePictureAssetId?: string;
}

export interface CreateStaffData {
  userId: string;
  accessLevel: string;
  accessExpiry: string;
  branchAssignment: string;
  twoFactorAuth: boolean;
}

export interface CreateUserResponse {
  id: string;
  username: string;
  email: string;
}

export interface UploadResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export const assetsService = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'image');
    
    const response = await api.post('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const usersService = {
  getUsers: async (page = 1, limit = 10): Promise<UsersResponse> => {
    const response = await api.get(`/users`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },
  
  createUser: async (userData: CreateUserData): Promise<CreateUserResponse> => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

export const staffService = {
  createStaff: async (staffData: CreateStaffData): Promise<any> => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },
};

export default api;