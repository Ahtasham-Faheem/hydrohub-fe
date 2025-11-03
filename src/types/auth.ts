export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt: string;
  profilePictureAssetId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  role: 'super_admin' | 'admin' | 'staff' | 'customer';
  employeeId: string | null;
  customerId: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}