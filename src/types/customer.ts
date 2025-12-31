export type CustomerType = 'Domestic Customer' | 'Business Customer' | 'Commercial Customer';

export interface Address {
  id?: string;
  title: string;
  houseNumber?: string;
  street?: string;
  block?: string;
  sector?: string;
  society?: string;
  landmark?: string;
  city: string;
  province?: string;
  country: string;
  postalCode?: string;
  access?: 'stairs' | 'lift' | 'service_lift' | 'none';
  concatenatedAddress?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface BuildingAccessInfo {
  mapLocation?: string;
  googleMapLocation?: string;
  ownershipStatus: string;
  deliveryAccessLevel: string;
  floorPosition?: '1st' | '2nd' | '3rd' | '4th' | 'other';
  basementPosition?: 'LG1' | 'LG2' | 'LG3' | 'LG4' | 'other';
  accessOptions?: string[];
  liftServiceStartTime?: string;
  liftServiceCloseTime?: string;
  liftStartTime?: string;
  liftCloseTime?: string;
  accessNotes?: string;
}

export interface Preferences {
  preferredDeliveryTime: 'morning' | 'afternoon' | 'evening1' | 'evening2' | 'flexible';
  deliveryFrequency: 'daily' | 'alternate' | 'twiceWeek' | 'weekly' | 'onCall';
  bottleHandlingPreference: 'doorstep' | 'inside' | 'stairs_lift' | 'pickup_refill';
  billingOption: 'cod' | 'weekly' | 'fortnightly' | 'monthly';
  paymentMode: 'cash' | 'online' | 'cheque';
  monthlyConsumption: '<20' | '20-50' | '51-100' | '100+';
  customerRating?: string;
  securitySummary?: string;
  additionalRequests?: string;
}

export interface LinkedAccount {
  id?: string;
  title: string;
  photo?: string;
  contactNumber: string;
  visibility: 'public' | 'private';
  status: 'active' | 'inactive' | 'pending' | 'left';
  authorizedAddress: string;
  authorizedAddressId?: string;
}

export interface Referral {
  id?: string;
  referrerCustomerId: string;
  remarks?: string;
  createdDate: string;
  status: 'active' | 'inactive';
}

export interface ReferralInfo {
  referrals?: Referral[];
}

export interface Security {
  numberOfBottles?: number;
  securityAmount?: number;
  securityPerBottle?: number;
  advancePayment?: number;
  emptyWithoutSecurity?: number;
  emptyReceivedWithoutSecurity?: number;
  bottlesReturn?: number;
  refundBottlesSecurity?: number;
  // Legacy fields for backward compatibility
  bottlesIssued?: number;
  emptyBottlesWithoutSecurity?: number;
  emptyReceived?: number;
  emptyBottlesReceived?: number;
  bottlesReturned?: number;
  refundSecurityBottles?: number;
  securityRefunded?: number;
  numBottlesIssued?: number;
  refundDue?: number;
}

export interface DomesticCustomer {
  // Basic Profile
  customerId?: string;
  creationDate: string;
  customerType?: string;
  profilePhoto?: string;
  profilePictureAssetId?: string;
  profilePictureFileUrl?: string;
  title: 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Mx' | 'Mr.' | 'Mrs.' | 'Ms.' | 'Miss.' | 'Mx.';
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  confirmPassword?: string;

  // Additional Personal Information
  fatherHusbandName?: string;
  motherName?: string;
  dateOfBirth: string;
  nationality?: string;
  cnicNumber?: string;
  gender: string;
  maritalStatus: string;
  alternateContactNumber: string;
  preferredContactMethod: 'whatsapp' | 'phone' | 'sms' | 'email';
  presentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactNumber?: string;
  alternateEmergencyContact?: string;

  // Building / Access Information
  buildingAccessInfo: BuildingAccessInfo;

  // Addresses
  deliveryAddresses: Address[];
  billingAddress?: Address;
  sameAsBillingAddress: boolean;

  // Preferences
  preferences: Preferences;

  // Linked Accounts
  linkedAccounts: LinkedAccount[];

  // Referral
  referral?: Referral;
  referrals?: Referral[];

  // Security & Empties
  security: Security;

  // Additional Instructions
  specialDeliveryNotes?: string;
  gatePass?: string;
  preferredDeliveryBoy?: string;
  accessInstructions?: string;
  discount?: number; // Discount percentage or amount
  additionalNotes?: string;
}

export interface BusinessContactPerson {
  customerId?: string;
  profilePhoto?: string;
  profilePictureFileUrl?: string;
  title: 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Mx';
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  designation?: string;
  fatherHusbandName?: string;
  motherName?: string;
  dateOfBirth: string;
  nationality?: string;
  cnicNumber?: string;
  gender: string;
  maritalStatus: string;
  alternateContactNumber?: string;
  preferredContactMethod: 'whatsapp' | 'phone' | 'sms' | 'email';
}

export interface BusinessCustomer extends DomesticCustomer {
  // Business Details
  businessName: string;
  businessType: 'corporate' | 'retail' | 'industrial' | 'healthcare' | 'public' | 'hospitality' | 'other';
  
  // Contact Person
  contactPerson: BusinessContactPerson;

  // Business Addresses
  businessAddresses: Address[];
}

export interface CustomerFormState {
  customerType: CustomerType | null;
  currentStep: number;
  data: DomesticCustomer | BusinessCustomer | null;
  errors: Record<string, string>;
}

export interface PersonalInfo {
  id: string;
  staffProfileId: string | null;
  customerProfileId: string;
  fathersName: string;
  mothersName: string;
  dateOfBirth: string;
  nationality: string;
  nationalId: string;
  gender: string;
  maritalStatus: string;
  alternateContactNumber: string;
  secondaryEmailAddress: string;
  presentAddress: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;
  alternateEmergencyContact: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePictureAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  storageKey: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingProgress {
  'Basic Profile': boolean;
  'Additional Information': boolean;
  'Addresses Added': boolean;
  'Building Information': boolean;
  'Preferences Set': boolean;
  'Security & Empties': boolean;
  'progress percentage': number;
}

export interface ActualCustomerProfile {
  id: string;
  customerId: string;
  userId: string;
  vendorId: string;
  customerType: string;
  status: string;
  title: string;
  firstName: string;
  lastName: string;
  profilePictureAssetId: string;
  additionalRequests: string | null;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  username: string;
  personalInfo: PersonalInfo;
  profilePictureAsset: ProfilePictureAsset;
  onboardingProgress: OnboardingProgress;
}

export interface CustomerUser {
  id: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  firstName: string;
  lastName: string;
}

export interface CustomerProfile {
  id: string;
  customerId: string;
  userId: string;
  user: CustomerUser;
  vendorId: string;
  customerType: 'domestic' | 'business' | 'commercial' | null;
  motherName: string | null;
  nationality: string | null;
  alternateContact: string | null;
  preferredContactMethod: string | null;
  category: string;
  accountType: string;
  customerStatus: 'active' | 'inactive';
  masterAccountId: string | null;
  openingBalance: string;
  deliveryCharges: string;
  discountPercentage: string;
  bottleSecurityDeposit: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CustomersResponse {
  data: ActualCustomerProfile[];
  pagination: Pagination;
}
