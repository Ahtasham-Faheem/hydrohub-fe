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