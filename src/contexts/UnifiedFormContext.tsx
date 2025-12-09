import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  CustomerType,
  Address,
  LinkedAccount,
} from '../types/customer';

// Unified form data that supports both Staff and Customer forms
export interface UnifiedFormData {
  // Form type & metadata
  formType: 'staff' | 'customer'; // Distinguish between staff and customer forms
  customerType?: CustomerType; // Only for customer forms
  currentStep: number;
  profileId?: string; // staffProfileId or customerId

  // Common personal fields
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  title?: string;

  // Staff-specific personal fields
  fathersName?: string;
  mothersName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  maritalStatus?: string;
  nationality?: string;

  // Contact Information fields
  secondaryEmail?: string;
  secondaryEmailAddress?: string;
  presentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactNumber?: string;
  alternateContactNumber?: string;
  alternateEmergencyContact?: string;

  // Staff: Employment Details fields
  joiningDate?: string;
  jobTitle?: string;
  department?: string;
  employmentType?: string;
  supervisor?: string;
  supervisorId?: string;
  workLocation?: string;
  shiftType?: string;
  employmentStatus?: string;

  // Staff: Salary & Benefits fields
  basicSalary?: string;
  allowances?: string;
  providentFund?: string;
  salaryPaymentMode?: string;
  bankName?: string;
  bankAccountTitle?: string;
  bankAccountNumber?: string;
  taxStatus?: string;

  // Staff: Identification & Verification fields
  identityDocumentName?: string;
  idCardNumber?: string;
  idCardIssuanceDate?: string;
  idCardExpiryDate?: string;
  policeVerification?: string;
  referralPersonName?: string;
  referralRelation?: string;
  referralContact?: string;
  remarks?: string;

  // Staff: Attendance & Duty Info fields
  attendanceCode?: string;
  dutyArea?: string;
  weeklyOffDay?: string;
  leaveBalance?: string;

  // Staff: Assets & Equipment fields
  equipmentType?: string;
  assetId?: string;
  assignedDate?: string;
  quantity?: number;
  unitOfMeasure?: string;
  issueBy?: string;

  // Staff: System fields
  userRole?: string;
  accessLevel?: string;
  accessExpiry?: string;
  branchAssignment?: string;
  twoFactorAuth?: boolean;

  // Customer-specific fields
  businessName?: string;
  businessType?: string;
  preferredContactMethod?: string;
  buildingAccessInfo?: {
    ownershipStatus: 'personal' | 'rental' | 'mortgage' | 'other';
    deliveryAccessLevel: 'basement' | 'ground' | 'upstairs';
    floorPosition?: string;
    accessNotes?: string;
  };
  deliveryAddresses?: Address[];
  billingAddress?: Address;
  businessAddresses?: Address[];
  sameAsBillingAddress?: boolean;
  preferences?: {
    preferredDeliveryTime?: string;
    deliveryFrequency?: string;
    bottleHandlingPreference?: string;
    billingOption?: string;
    paymentMode?: string;
    monthlyConsumption?: string;
  };
  linkedAccounts?: LinkedAccount[];
  security?: {
    bottlesIssued: number;
    securityAmount: number;
    securityPerBottle: number;
    advancePayment: number;
    emptyBottlesWithoutSecurity: number;
    emptyReceived: number;
    bottlesReturned: number;
    refundSecurityBottles: number;
  };

  // Common optional fields
  profilePictureAssetId?: string;
  status?: string;
}

interface UnifiedFormContextType {
  formData: UnifiedFormData;
  updateFormData: (field: keyof UnifiedFormData, value: any) => void;
  updateMultipleFields: (fields: Partial<UnifiedFormData>) => void;
  updateNestedField: (path: string, value: any) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  validateRequiredFields: (type: 'staff' | 'customer') => { isValid: boolean; errors: string[] };
  addAddress: (type: 'delivery' | 'billing' | 'business', address: Address) => void;
  updateAddress: (type: 'delivery' | 'billing' | 'business', index: number, address: Address) => void;
  removeAddress: (type: 'delivery' | 'billing' | 'business', index: number) => void;
  addLinkedAccount: (account: LinkedAccount) => void;
  updateLinkedAccount: (index: number, account: LinkedAccount) => void;
  removeLinkedAccount: (index: number) => void;
}

const initialFormData: UnifiedFormData = {
  formType: 'staff',
  currentStep: 0,
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  title: '',
  profilePictureAssetId: '',
  status: 'active',
  userRole: 'vendor_admin',
  accessLevel: 'Limited',
  accessExpiry: '2025-12-31',
  branchAssignment: 'Lahore Head Office',
  twoFactorAuth: false,
};

const UnifiedFormContext = createContext<UnifiedFormContextType | undefined>(undefined);

export const useUnifiedForm = () => {
  const context = useContext(UnifiedFormContext);
  if (!context) {
    throw new Error('useUnifiedForm must be used within UnifiedFormProvider');
  }
  return context;
};

// Legacy hooks for backward compatibility
export const useFormContext = useUnifiedForm;
export const useCustomerForm = useUnifiedForm;

interface UnifiedFormProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export const UnifiedFormProvider: React.FC<UnifiedFormProviderProps> = ({
  children,
  storageKey = 'hydrofe_form_data',
}) => {
  const [formData, setFormData] = useState<UnifiedFormData>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialFormData;
  });

  const updateFormData = (field: keyof UnifiedFormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const updateMultipleFields = (fields: Partial<UnifiedFormData>) => {
    const newData = { ...formData, ...fields };
    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const updateNestedField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(formData));
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const setCurrentStep = (step: number) => {
    updateFormData('currentStep', step);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    localStorage.removeItem(storageKey);
  };

  const validateRequiredFields = (type: 'staff' | 'customer') => {
    const errors: string[] = [];

    // Common validations
    if (!formData.firstName) errors.push('First Name is required');
    if (!formData.lastName) errors.push('Last Name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.phone) errors.push('Phone is required');
    if (!formData.username) errors.push('Username is required');
    if (!formData.password) errors.push('Password is required');

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Type-specific validations
    if (type === 'customer') {
      if (!formData.customerType) errors.push('Customer Type is required');
      if (formData.customerType === 'Business Customer' && !formData.businessName) {
        errors.push('Business Name is required');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const addAddress = (type: 'delivery' | 'billing' | 'business', address: Address) => {
    const newData = JSON.parse(JSON.stringify(formData));

    if (type === 'delivery' && !newData.deliveryAddresses) {
      newData.deliveryAddresses = [];
    }
    if (type === 'delivery') {
      newData.deliveryAddresses.push(address);
    } else if (type === 'billing') {
      newData.billingAddress = address;
    } else if (type === 'business' && !newData.businessAddresses) {
      newData.businessAddresses = [];
      newData.businessAddresses.push(address);
    }

    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const updateAddress = (type: 'delivery' | 'billing' | 'business', index: number, address: Address) => {
    const newData = JSON.parse(JSON.stringify(formData));

    if (type === 'delivery') {
      newData.deliveryAddresses[index] = address;
    } else if (type === 'billing') {
      newData.billingAddress = address;
    } else if (type === 'business') {
      newData.businessAddresses[index] = address;
    }

    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const removeAddress = (type: 'delivery' | 'billing' | 'business', index: number) => {
    const newData = JSON.parse(JSON.stringify(formData));

    if (type === 'delivery') {
      newData.deliveryAddresses.splice(index, 1);
    } else if (type === 'business') {
      newData.businessAddresses.splice(index, 1);
    }

    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const addLinkedAccount = (account: LinkedAccount) => {
    const newData = JSON.parse(JSON.stringify(formData));
    if (!newData.linkedAccounts) {
      newData.linkedAccounts = [];
    }
    newData.linkedAccounts.push(account);
    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const updateLinkedAccount = (index: number, account: LinkedAccount) => {
    const newData = JSON.parse(JSON.stringify(formData));
    newData.linkedAccounts[index] = account;
    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const removeLinkedAccount = (index: number) => {
    const newData = JSON.parse(JSON.stringify(formData));
    newData.linkedAccounts.splice(index, 1);
    setFormData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const value: UnifiedFormContextType = {
    formData,
    updateFormData,
    updateMultipleFields,
    updateNestedField,
    setCurrentStep,
    resetForm,
    validateRequiredFields,
    addAddress,
    updateAddress,
    removeAddress,
    addLinkedAccount,
    updateLinkedAccount,
    removeLinkedAccount,
  };

  return (
    <UnifiedFormContext.Provider value={value}>
      {children}
    </UnifiedFormContext.Provider>
  );
};

// Also export as legacy names for backward compatibility
export const FormProvider = UnifiedFormProvider;
export const CustomerFormProvider = UnifiedFormProvider;
