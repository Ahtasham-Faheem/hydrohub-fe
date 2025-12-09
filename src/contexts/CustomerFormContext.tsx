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
  validateRequiredFields: () => { isValid: boolean; errors: string[] };
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
  gender: 'male',
  maritalStatus: 'single',
  customerType: 'Domestic Customer',
  alternateContactNumber: '',
  creationDate: new Date().toISOString(),
  preferredContactMethod: 'whatsapp',
  buildingAccessInfo: {
    ownershipStatus: 'personal',
    deliveryAccessLevel: 'ground',
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
          maritalStatus: 'single',
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

    if (!state.data) {
      errors.push('Form data is missing');
      return { isValid: false, errors };
    }

    // Basic required fields
    if (!state.data.firstName) errors.push('First Name is required');
    if (!state.data.lastName) errors.push('Last Name is required');
    if (!state.data.email) errors.push('Email is required');
    if (!state.data.mobileNumber) errors.push('Mobile Number is required');
    if (!state.data.username) errors.push('Username is required');
    if (!state.data.password) errors.push('Password is required');

    if ('businessName' in state.data) {
      if (!state.data.businessName) errors.push('Business Name is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const value: CustomerFormContextType = {
    state,
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
