import axios from 'axios';
import type { UsersResponse, StaffResponse } from '../types/user';
import type { CustomersResponse } from '../types/customer';

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
  userRole: string;
  twoFactorAuth: boolean;
}

export interface CreateCustomerData {
  userId: string;
  customerType: 'domestic' | 'business' | 'commercial';
  motherName?: string;
  nationality?: string;
  alternateContact?: string;
  preferredContactMethod?: string;
  category?: string;
  accountType?: string;
}

export interface UpdateBuildingInfoData {
  mapLocation?: string;
  ownership: 'personal' | 'rental' | 'mortgage' | 'other';
  accessLevel: 'basement' | 'ground' | 'upstairs';
  floorPosition?: string;
  basementPosition?: string;
  liftStartTime?: string;
  liftEndTime?: string;
  accessNotes?: string;
}

export interface UpdatePreferencesData {
  preferredDeliveryTime?: string;
  deliveryFrequency?: string;
  bottleHandling?: string;
  billingOption?: string;
  paymentMode?: string;
  expectedConsumption?: string;
  customerRating?: string;
  securitySummary?: string;
  additionalRequests?: string;
}

export interface CreateLinkedAccountData {
  linkedAccountTitle: string;
  parentProfilePicture?: string;
  contactNo: string;
  accountVisibilityLevel: string;
  accountStatus: string;
  authorizedAddressId?: string;
}

export interface UpdateLinkedAccountData extends Partial<CreateLinkedAccountData> {
  id?: string;
}

export interface LinkedAccountResponse {
  id: string;
  linkedAccountTitle: string;
  parentProfilePicture?: string;
  contactNo: string;
  accountVisibilityLevel: 'public' | 'private';
  accountStatus: 'active' | 'inactive' | 'pending' | 'left';
  authorizedAddressId?: string;
}

export interface LinkedAccountsResponse {
  data: LinkedAccountResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAddressData {
  addressType: 'residential' | 'commercial' | 'business';
  addressTitle: string;
  ownership: 'personal' | 'rental' | 'mortgage' | 'other';
  buildingNumber?: string;
  access?: string;
  street?: string;
  block?: string;
  sector?: string;
  societyTown?: string;
  city: string;
  province?: string;
  country: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id?: string;
}

export interface AddressResponse {
  id: string;
  addressType: string;
  addressTitle: string;
  ownership: string;
  buildingNumber?: string;
  access?: string;
  street?: string;
  block?: string;
  sector?: string;
  societyTown?: string;
  city: string;
  province?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface AddressesResponse {
  data: AddressResponse[];
  total: number;
  page: number;
  limit: number;
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

  getStaff: async (vendorId: string, page = 1, limit = 10): Promise<StaffResponse> => {
    const response = await api.get(`/staff`, {
      params: {
        vendorId,
        page,
        limit,
      },
    });
    return response.data;
  },
};

export const customerService = {
  createCustomer: async (customerData: CreateCustomerData): Promise<any> => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  getCustomers: async (vendorId: string, page = 1, limit = 10): Promise<CustomersResponse> => {
    const response = await api.get(`/customers`, {
      params: {
        vendorId,
        page,
        limit,
      },
    });
    return response.data;
  },

  updateBuildingInfo: async (customerProfileId: string, buildingData: UpdateBuildingInfoData): Promise<any> => {
    const response = await api.patch(`/customers/${customerProfileId}/building-info`, buildingData);
    return response.data;
  },

  updatePreferences: async (customerProfileId: string, preferencesData: UpdatePreferencesData): Promise<any> => {
    const response = await api.patch(`/customers/${customerProfileId}/preferences`, preferencesData);
    return response.data;
  },

  // Address CRUD operations
  getAddresses: async (customerProfileId: string): Promise<AddressesResponse> => {
    const response = await api.get(`/customer-addresses/${customerProfileId}`);
    return response.data;
  },

  createAddress: async (customerProfileId: string, addressData: CreateAddressData): Promise<AddressResponse> => {
    const response = await api.post(`/customer-addresses/${customerProfileId}`, addressData);
    return response.data;
  },

  updateAddress: async (customerProfileId: string, addressId: string, addressData: UpdateAddressData): Promise<AddressResponse> => {
    const response = await api.patch(`/customer-addresses/${customerProfileId}/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (customerProfileId: string, addressId: string): Promise<any> => {
    const response = await api.delete(`/customer-addresses/${customerProfileId}/${addressId}`);
    return response.data;
  },

  // Linked Accounts CRUD operations
  getLinkedAccounts: async (customerProfileId: string): Promise<LinkedAccountsResponse> => {
    const response = await api.get(`/customer-linked-accounts/${customerProfileId}`);
    return response.data;
  },

  createLinkedAccount: async (customerProfileId: string, accountData: CreateLinkedAccountData): Promise<LinkedAccountResponse> => {
    const response = await api.post(`/customer-linked-accounts/${customerProfileId}`, accountData);
    return response.data;
  },

  updateLinkedAccount: async (customerProfileId: string, accountId: string, accountData: UpdateLinkedAccountData): Promise<LinkedAccountResponse> => {
    const response = await api.patch(`/customer-linked-accounts/${customerProfileId}/${accountId}`, accountData);
    return response.data;
  },

  deleteLinkedAccount: async (customerProfileId: string, accountId: string): Promise<any> => {
    const response = await api.delete(`/customer-linked-accounts/${customerProfileId}/${accountId}`);
    return response.data;
  },
};

export default api;