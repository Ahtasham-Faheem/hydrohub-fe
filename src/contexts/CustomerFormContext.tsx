import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  DomesticCustomer,
  BusinessCustomer,
  CustomerType,
  CustomerFormState,
  Address,
  LinkedAccount,
} from '../types/customer';

interface CustomerFormContextType {
  state: CustomerFormState;
  fieldErrors: Record<string, string>;
  setFieldErrors: (errors: Record<string, string>) => void;
  setCustomerType: (type: CustomerType) => void;
  setCurrentStep: (step: number) => void;
  updateFormData: (path: string, value: any) => void;
  addAddress: (type: 'delivery' | 'billing' | 'business', address: Address) => void;
  updateAddress: (type: 'delivery' | 'billing' | 'business', index: number, address: Address) => void;
  removeAddress: (type: 'delivery' | 'billing' | 'business', index: number) => void;
  addLinkedAccount: (account: LinkedAccount) => void;
  updateLinkedAccount: (index: number, account: LinkedAccount) => void;
  removeLinkedAccount: (index: number) => void;
  resetForm: () => void;
  validateRequiredFields: () => { isValid: boolean; errors: string[]; fieldErrors: Record<string, string> };
}

const defaultDomesticCustomer: DomesticCustomer = {
  title: 'Mr',
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  customerType: 'Domestic Customer',
  alternateContactNumber: '',
  creationDate: new Date().toISOString(),
  preferredContactMethod: 'whatsapp',
  buildingAccessInfo: {
    ownershipStatus: '',
    deliveryAccessLevel: '',
  },
  deliveryAddresses: [],
  sameAsBillingAddress: true,
  preferences: {
    preferredDeliveryTime: 'flexible',
    deliveryFrequency: 'daily',
    bottleHandlingPreference: 'doorstep',
    billingOption: 'cod',
    paymentMode: 'cash',
    monthlyConsumption: '<20',
  },
  linkedAccounts: [],
  security: {
    bottlesIssued: 0,
    securityAmount: 0,
    securityPerBottle: 0,
    advancePayment: 0,
    emptyBottlesWithoutSecurity: 0,
    emptyReceived: 0,
    bottlesReturned: 0,
    refundSecurityBottles: 0,
  },
};

const CustomerFormContext = createContext<CustomerFormContextType | undefined>(undefined);

export const CustomerFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CustomerFormState>({
    customerType: null,
    currentStep: 0,
    data: null,
    errors: {},
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setCustomerType = (type: CustomerType) => {
    let initialData: DomesticCustomer | BusinessCustomer;

    if (type === 'Business Customer') {
      initialData = {
        ...defaultDomesticCustomer,
        businessName: '',
        businessType: 'corporate',
        contactPerson: {
          title: 'Mr',
          firstName: '',
          lastName: '',
          email: '',
          mobileNumber: '',
          username: '',
          password: '',
          dateOfBirth: '',
          maritalStatus: '',
          preferredContactMethod: 'whatsapp',
        } as any,
        businessAddresses: [],
      };
    } else {
      initialData = { ...defaultDomesticCustomer };
    }

    setState((prev) => ({
      ...prev,
      customerType: type,
      data: initialData,
      currentStep: 0,
    }));
  };

  const setCurrentStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const updateFormData = (path: string, value: any) => {
    setState((prev) => {
      if (!prev.data) return prev;

      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev.data));
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return {
        ...prev,
        data: newData,
      };
    });
  };

  const addAddress = (type: 'delivery' | 'billing' | 'business', address: Address) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));

      if (type === 'delivery') {
        newData.deliveryAddresses.push(address);
      } else if (type === 'billing') {
        newData.billingAddress = address;
      } else if (type === 'business' && 'businessAddresses' in newData) {
        newData.businessAddresses.push(address);
      }

      return { ...prev, data: newData };
    });
  };

  const updateAddress = (type: 'delivery' | 'billing' | 'business', index: number, address: Address) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));

      if (type === 'delivery') {
        newData.deliveryAddresses[index] = address;
      } else if (type === 'billing') {
        newData.billingAddress = address;
      } else if (type === 'business' && 'businessAddresses' in newData) {
        newData.businessAddresses[index] = address;
      }

      return { ...prev, data: newData };
    });
  };

  const removeAddress = (type: 'delivery' | 'billing' | 'business', index: number) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));

      if (type === 'delivery') {
        newData.deliveryAddresses.splice(index, 1);
      } else if (type === 'business' && 'businessAddresses' in newData) {
        newData.businessAddresses.splice(index, 1);
      }

      return { ...prev, data: newData };
    });
  };

  const addLinkedAccount = (account: LinkedAccount) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));
      newData.linkedAccounts.push(account);
      return { ...prev, data: newData };
    });
  };

  const updateLinkedAccount = (index: number, account: LinkedAccount) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));
      newData.linkedAccounts[index] = account;
      return { ...prev, data: newData };
    });
  };

  const removeLinkedAccount = (index: number) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));
      newData.linkedAccounts.splice(index, 1);
      return { ...prev, data: newData };
    });
  };

  const resetForm = () => {
    setState({
      customerType: null,
      currentStep: 0,
      data: null,
      errors: {},
    });
  };

  const validateRequiredFields = () => {
    const errors: string[] = [];
    const fieldErrorsMap: Record<string, string> = {};

    if (!state.data) {
      errors.push('Form data is missing');
      return { isValid: false, errors, fieldErrors: fieldErrorsMap };
    }

    // Basic required fields
    if (!state.data.firstName) {
      errors.push('First Name is required');
      fieldErrorsMap['firstName'] = 'First Name is required';
    }
    if (!state.data.lastName) {
      errors.push('Last Name is required');
      fieldErrorsMap['lastName'] = 'Last Name is required';
    }
    if (!state.data.email) {
      errors.push('Email is required');
      fieldErrorsMap['email'] = 'Email is required';
    }
    if (!state.data.mobileNumber) {
      errors.push('Mobile Number is required');
      fieldErrorsMap['mobileNumber'] = 'Mobile Number is required';
    }
    if (!state.data.username) {
      errors.push('Username is required');
      fieldErrorsMap['username'] = 'Username is required';
    }
    if (!state.data.password) {
      errors.push('Password is required');
      fieldErrorsMap['password'] = 'Password is required';
    }
    if (!state.data.profilePictureAssetId) {
      errors.push('Profile Picture is required');
      fieldErrorsMap['profilePictureAssetId'] = 'Profile Picture is required';
    }

    // Confirm Password validation
    if (!state.data.confirmPassword) {
      const confirmPasswordError = 'Please confirm your password';
      errors.push(confirmPasswordError);
      fieldErrorsMap['confirmPassword'] = confirmPasswordError;
    } else if (state.data.password && state.data.confirmPassword !== state.data.password) {
      const confirmPasswordError = 'Passwords do not match';
      errors.push(confirmPasswordError);
      fieldErrorsMap['confirmPassword'] = confirmPasswordError;
    }

    // Email validation
    if (state.data.email && !/\S+@\S+\.\S+/.test(state.data.email)) {
      const emailError = 'Email must be a valid email address';
      errors.push(emailError);
      fieldErrorsMap['email'] = emailError;
    }

    // Date of Birth validation - must be ISO 8601 format
    if (state.data.dateOfBirth) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(state.data.dateOfBirth)) {
        const dateError = 'Date of Birth must be in YYYY-MM-DD format';
        errors.push(dateError);
        fieldErrorsMap['dateOfBirth'] = dateError;
      }
    }

    // National ID/CNIC validation - must be 13 digits if provided
    if (state.data.cnicNumber && state.data.cnicNumber.toString().trim()) {
      if (!/^\d+$/.test(state.data.cnicNumber.toString())) {
        const cnicError = 'CNIC/National ID must contain only numbers';
        errors.push(cnicError);
        fieldErrorsMap['cnicNumber'] = cnicError;
      } else if (state.data.cnicNumber.toString().length !== 13) {
        const cnicError = 'CNIC/National ID must be exactly 13 digits';
        errors.push(cnicError);
        fieldErrorsMap['cnicNumber'] = cnicError;
      }
    }

    if ('businessName' in state.data) {
      if (!state.data.businessName) {
        errors.push('Business Name is required');
        fieldErrorsMap['businessName'] = 'Business Name is required';
      }
    }

    setFieldErrors(fieldErrorsMap);

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors: fieldErrorsMap,
    };
  };

  const value: CustomerFormContextType = {
    state,
    fieldErrors,
    setFieldErrors,
    setCustomerType,
    setCurrentStep,
    updateFormData,
    addAddress,
    updateAddress,
    removeAddress,
    addLinkedAccount,
    updateLinkedAccount,
    removeLinkedAccount,
    resetForm,
    validateRequiredFields,
  };

  return (
    <CustomerFormContext.Provider value={value}>
      {children}
    </CustomerFormContext.Provider>
  );
};

export const useCustomerForm = () => {
  const context = useContext(CustomerFormContext);
  if (!context) {
    throw new Error('useCustomerForm must be used within CustomerFormProvider');
  }
  return context;
};
