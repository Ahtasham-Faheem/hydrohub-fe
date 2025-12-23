import axios from 'axios';
import type { UsersResponse, StaffResponse } from '../types/user';
import type { CustomersResponse } from '../types/customer';
import type { 
  CatalogueItem, 
  Category, 
  Collection 
} from '../types/catalogue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

// Static vendor portal header required by backend for all requests
const VENDOR_PORTAL = "waterinn.hydrohub.ai";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
    'x-vendor-portal': VENDOR_PORTAL,
    'ngrok-skip-browser-warning': 'true',
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
      // Only redirect if NOT on login page - let login page handle the error
      const currentPath = window.location.hash;
      if (!currentPath.includes('/login')) {
        // Clear auth data and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/#/login';
      }
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

export interface SendLoginCodeData {
  email?: string;
  phone?: string;
}

export interface SendLoginCodeResponse {
  message: string;
  success: boolean;
}

export interface VerifyLoginCodeData {
  email?: string;
  phone?: string;
  code: string;
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

  sendLoginCode: async (data: SendLoginCodeData): Promise<SendLoginCodeResponse> => {
    const response = await api.post('/auth/staff/send-login-code', data);
    return response.data;
  },

  verifyLoginCode: async (data: VerifyLoginCodeData): Promise<LoginResponse> => {
    const response = await api.post('/auth/staff/verify-login-code', data);
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
  email: string;
  phone: string;
  username: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  profilePictureAssetId?: string;
  role: string;
}

export interface CreateStaffResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdditionalPersonalInfoData {
  fathersName?: string;
  mothersName?: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalId?: string;
  gender?: string;
  maritalStatus?: string;
  alternateContactNumber?: string;
  secondaryEmailAddress?: string;
  presentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactNumber?: string;
  alternateEmergencyContact?: string;
}

export interface EmploymentDetailsData {
  jobTitle?: string;
  department?: string;
  employmentType?: string;
  supervisorId?: string;
  workLocation?: string;
  shiftType?: string;
  status?: string;
}

export interface SalaryBenefitsData {
  basicSalary?: number;
  allowances?: string;
  providentFund?: string;
  salaryPaymentMode?: string;
  bankName?: string;
  bankAccountTitle?: string;
  bankAccountNumber?: string;
  taxStatus?: string;
}

export interface IdentificationVerificationData {
  identityDocumentName?: string;
  idCardNumber?: string;
  idCardIssuanceDate?: string;
  idCardExpiryDate?: string;
  referralPersonName?: string;
  referralRelation?: string;
  referralContact?: string;
  policeVerification?: string;
  remarks?: string;
}

export interface AssetsAndEquipmentData {
  equipmentType?: string;
  assetId?: string;
  assignedDate?: string;
  quantity?: number;
  unitOfMeasure?: string;
  issueBy?: string;
  remarks?: string;
}

export interface DocumentData {
  documentType?: string;
  assetId?: string;
  documentName?: string;
}

export interface DocumentUploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface CreateCustomerData {
  email: string;
  phone: string;
  username: string;
  password: string;
  customerType: 'Domestic Customer' | 'Business Customer' | 'Commercial Customer';
  title?: string;
  firstName: string;
  lastName: string;
  profilePictureAssetId?: string;
}

export interface UpdateAdditionalPersonalInfoData {
  fathersName?: string;
  mothersName?: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalId?: string;
  gender?: string;
  maritalStatus?: string;
  alternateContactNumber?: string;
  secondaryEmailAddress?: string;
  presentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactNumber?: string;
  alternateEmergencyContact?: string;
}

export interface UpdateBuildingInfoData {
  mapLocation?: string;
  ownership: string;
  accessLevel: string;
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

// Catalog Types
export interface CreateCatalogueItemData {
  name: string;
  subHeading?: string;
  description?: string;
  type: 'product' | 'service';
  categoryId?: string;
  collectionId?: string;
  costPrice: number;
  sellingPrice: number;
  discountPercent: number;
  discountAmount: number;
  salePrice: number;
  markSale: boolean;
  stockManaged: boolean;
  openingStock: number;
  emptiesTrackable?: boolean;
  sku?: string;
  productId?: string;
  barcode?: string;
  countryOrigin?: string;
  link?: string;
  images?: string[];
  tags: string[];
  rating: number;
}

export interface UpdateCatalogueItemData extends Partial<CreateCatalogueItemData> {}

export interface CatalogueItemsResponse {
  data: CatalogueItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCollectionData extends Partial<CreateCollectionData> {}

export interface CollectionsResponse {
  data: Collection[];
  total: number;
  page: number;
  limit: number;
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

  deleteAsset: async (assetId: string): Promise<void> => {
    await api.delete(`/assets/${assetId}`);
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
  createStaff: async (staffData: CreateStaffData): Promise<CreateStaffResponse> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.post('/staff', staffData, {
      params: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  updateAdditionalPersonalInfo: async (staffProfileId: string, data: AdditionalPersonalInfoData): Promise<any> => {
    const response = await api.patch(`/staff/${staffProfileId}/additional-personal-info`, data);
    return response.data;
  },

  updateEmploymentDetails: async (staffProfileId: string, data: EmploymentDetailsData): Promise<any> => {
    const response = await api.patch(`/staff/${staffProfileId}/employment-details`, data);
    return response.data;
  },

  updateSalaryBenefits: async (staffProfileId: string, data: SalaryBenefitsData): Promise<any> => {
    const response = await api.patch(`/staff/${staffProfileId}/salary-benefits`, data);
    return response.data;
  },

  updateIdentificationVerification: async (staffProfileId: string, data: IdentificationVerificationData): Promise<any> => {
    const response = await api.patch(`/staff/${staffProfileId}/referral-information`, data);
    return response.data;
  },

  updateAssetsAndEquipment: async (staffProfileId: string, data: AssetsAndEquipmentData): Promise<any> => {
    const response = await api.post(`/staff/${staffProfileId}/equipment`, data);
    return response.data;
  },

  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", 'image');
    const response = await api.post("/assets/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  createDocument: async (staffProfileId: string, data: DocumentData): Promise<any> => {
    const response = await api.post(`/staff/${staffProfileId}/documents`, data);
    return response.data;
  },

  deleteDocument: async (staffProfileId: string, documentId: string): Promise<any> => {
    const response = await api.delete(`/staff/${staffProfileId}/documents/${documentId}`);
    return response.data;
  },

  getDocuments: async (staffProfileId: string): Promise<any[]> => {
    const response = await api.get(`/staff/${staffProfileId}/documents`);
    return response.data;
  },

  getSupervisors: async (vendorId: string): Promise<any[]> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const resolvedVendorId = vendorId || userData?.vendorId || userData?.id || '';

    const response = await api.get(`/staff`, {
      headers: {
        'x-vendorId': resolvedVendorId,
      },
      params: {
        'x-vendorId': resolvedVendorId,
        role: 'supervisor',
        limit: 100,
      },
    });
    return response.data?.data || response.data || [];
  },

  getStaff: async (vendorId: string, page = 1, limit = 10, filters?: any): Promise<StaffResponse> => {
    const response = await api.get(`/staff`, {
      params: {
        vendorId,
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  },

  getStaffById: async (staffId: string): Promise<any> => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  },

  updateStaffBasicProfile: async (staffId: string, data: {
    title?: string;
    firstName?: string;
    lastName?: string;
    profilePictureAssetId?: string;
    status?: string;
    role?: string;
  }): Promise<any> => {
    const response = await api.patch(`/staff/${staffId}`, data);
    return response.data;
  },

  deleteStaff: async (staffId: string): Promise<any> => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
  },
};

export const customerService = {
  createCustomer: async (customerData: CreateCustomerData): Promise<any> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.post('/customers', customerData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  updateAdditionalPersonalInfo: async (customerProfileId: string, personalData: UpdateAdditionalPersonalInfoData): Promise<any> => {
    const response = await api.patch(`/customers/${customerProfileId}/additional-personal-info`, personalData);
    return response.data;
  },

  getCustomers: async (vendorId: string, page = 1, limit = 10, filters?: any): Promise<CustomersResponse> => {
    const response = await api.get(`/customers`, {
      params: {
        vendorId,
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  },

  getCustomerById: async (customerId: string): Promise<any> => {
    const response = await api.get(`/customers/${customerId}`);
    return response.data;
  },

  updateCustomerBasicProfile: async (customerId: string, data: {
    title?: string;
    firstName?: string;
    lastName?: string;
    profilePictureAssetId?: string;
    status?: string;
  }): Promise<any> => {
    const response = await api.patch(`/customers/${customerId}`, data);
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

  deleteCustomer: async (customerId: string): Promise<any> => {
    const response = await api.delete(`/customers/${customerId}`);
    return response.data;
  },
};

// Catalog Service - Products API (Full CRUD)
export const catalogService = {
  // Products CRUD
  getProducts: async (page = 1, limit = 10, filters?: any): Promise<CatalogueItemsResponse> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.get('/catalog/products', {
      headers: {
        'x-vendorId': vendorId,
      },
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  },

  getProductById: async (productId: string): Promise<CatalogueItem> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.get(`/catalog/products/${productId}`, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  createProduct: async (productData: CreateCatalogueItemData): Promise<CatalogueItem> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.post('/catalog/products', productData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  updateProduct: async (productId: string, productData: UpdateCatalogueItemData): Promise<CatalogueItem> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.patch(`/catalog/products/${productId}`, productData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    await api.delete(`/catalog/products/${productId}`, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
  },

  toggleProductStatus: async (productId: string): Promise<CatalogueItem> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.patch(`/catalog/products/${productId}/toggle-status`, {}, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  // Categories CRUD
  getCategories: async (page = 1, limit = 100): Promise<CategoriesResponse> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.get('/catalog/categories', {
      headers: {
        'x-vendorId': vendorId,
      },
      params: {
        page,
        limit,
      },
    });
    
    return response.data;
  },

  getCategoryById: async (categoryId: string): Promise<Category> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.get(`/catalog/categories/${categoryId}`, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  createCategory: async (categoryData: CreateCategoryData): Promise<Category> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.post('/catalog/categories', categoryData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  updateCategory: async (categoryId: string, categoryData: UpdateCategoryData): Promise<Category> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.patch(`/catalog/categories/${categoryId}`, categoryData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    await api.delete(`/catalog/categories/${categoryId}`, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
  },

  // Collections CRUD
  getCollections: async (page = 1, limit = 100): Promise<CollectionsResponse> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.get('/catalog/collections', {
      headers: {
        'x-vendorId': vendorId,
      },
      params: {
        page,
        limit,
      },
    });
    
    return response.data;
  },

  getCollectionById: async (collectionId: string): Promise<Collection> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.get(`/catalog/collections/${collectionId}`, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  createCollection: async (collectionData: CreateCollectionData): Promise<Collection> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.post('/catalog/collections', collectionData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  updateCollection: async (collectionId: string, collectionData: UpdateCollectionData): Promise<Collection> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    const response = await api.patch(`/catalog/collections/${collectionId}`, collectionData, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
    return response.data;
  },

  deleteCollection: async (collectionId: string): Promise<void> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    await api.delete(`/catalog/collections/${collectionId}`, {
      headers: {
        'x-vendorId': vendorId,
      },
    });
  },

  // Bulk operations
  bulkUpdateProducts: async (productIds: string[], updateData: Partial<CatalogueItem>): Promise<CatalogueItem[]> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    // Use individual PATCH requests since there's no bulk-update API
    const updatePromises = productIds.map(productId => 
      api.patch(`/catalog/products/${productId}`, updateData, {
        headers: {
          'x-vendorId': vendorId,
        },
      })
    );
    
    const responses = await Promise.all(updatePromises);
    return responses.map(response => response.data);
  },

  bulkDeleteProducts: async (productIds: string[]): Promise<void> => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const vendorId = userData?.vendorId || userData?.id || '';
    
    await api.delete('/catalog/products/bulk-delete', {
      headers: {
        'x-vendorId': vendorId,
      },
      data: { productIds },
    });
  },
};

export default api;