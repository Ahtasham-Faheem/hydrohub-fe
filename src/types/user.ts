export interface VendorRole {
  vendorId: string | null;
  role: string;
}

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
  profilePictureAssetId: string | null;
  createdAt: string;
  vendorRoles: VendorRole[];
}

export interface UserData {
  id: string;
  email: string;
  phone: string;
  status: string;
  firstName: string;
  lastName: string;
  profilePictureAssetId?: string;
  username?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface StaffMember {
  id: string;
  staffId: string;
  userId: string;
  user: UserData;
  vendorId: string;
  userRole: string;
  accessLevel: string;
  accessExpiry: string;
  branchAssignment: string;
  twoFactorAuth: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsersResponse {
  data: User[];
  pagination: PaginationInfo;
}

export interface StaffResponse {
  data: StaffMember[];
  pagination: PaginationInfo;
}