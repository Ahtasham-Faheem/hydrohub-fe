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
import {
  customerStep1Schema,
  customerStep2Schema,
  customerStep3Schema,
  customerStep5Schema,
  customerStep7Schema,
  validateFormStep,
} from '../utils/validationSchemas';

interface CustomerFormContextType {
  state: CustomerFormState;
  fieldErrors: Record<string, string>;
  originalData: DomesticCustomer | BusinessCustomer | null;
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
  clearProgress: () => void;
  setOriginalData: (data: DomesticCustomer | BusinessCustomer) => void;
  hasChangesInStep: (step: number) => boolean;
  validateRequiredFields: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep2: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep3: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep5: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep7: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
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
    numberOfBottles: 0,
    securityAmount: 0,
    securityPerBottle: 0,
    advancePayment: 0,
    emptyWithoutSecurity: 0,
    emptyReceivedWithoutSecurity: 0,
    bottlesReturn: 0,
    refundBottlesSecurity: 0,
  },
};

const CustomerFormContext = createContext<CustomerFormContextType | undefined>(undefined);

export const CustomerFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CustomerFormState>(() => {
    const saved = localStorage.getItem("createCustomerFormState");
    return saved ? JSON.parse(saved) : {
      customerType: null,
      currentStep: 0,
      data: null,
      errors: {},
    };
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState<DomesticCustomer | BusinessCustomer | null>(null);

  const setCustomerType = (type: CustomerType) => {
    setState((prevState) => {
      let initialData: DomesticCustomer | BusinessCustomer;

      if (type === 'Business Customer') {
        initialData = {
          ...defaultDomesticCustomer,
          customerType: type, // Set the correct customer type
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
        initialData = { 
          ...defaultDomesticCustomer,
          customerType: type // Set the correct customer type
        };
      }

      const newState = {
        ...prevState,
        customerType: type,
        data: initialData,
        currentStep: 0,
      };

      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
    });
  };

  const setCurrentStep = (step: number) => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        currentStep: step,
      };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
    });
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

      const newState = {
        ...prev,
        data: newData,
      };

      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
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

      const newState = { ...prev, data: newData };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
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

      const newState = { ...prev, data: newData };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
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

      const newState = { ...prev, data: newData };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
    });
  };

  const addLinkedAccount = (account: LinkedAccount) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));
      newData.linkedAccounts.push(account);
      const newState = { ...prev, data: newData };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
    });
  };

  const updateLinkedAccount = (index: number, account: LinkedAccount) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));
      newData.linkedAccounts[index] = account;
      const newState = { ...prev, data: newData };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
    });
  };

  const removeLinkedAccount = (index: number) => {
    setState((prev) => {
      if (!prev.data) return prev;
      const newData = JSON.parse(JSON.stringify(prev.data));
      newData.linkedAccounts.splice(index, 1);
      const newState = { ...prev, data: newData };
      localStorage.setItem("createCustomerFormState", JSON.stringify(newState));
      return newState;
    });
  };

  const resetForm = () => {
    const initialState = {
      customerType: null,
      currentStep: 0,
      data: null,
      errors: {},
    };
    setState(initialState);
    setOriginalData(null);
    localStorage.removeItem("createCustomerFormState");
    localStorage.removeItem("createCustomerProfileId");
  };

  const clearProgress = () => {
    localStorage.removeItem("createCustomerFormState");
  };

  const hasChangesInStep = (step: number): boolean => {
    if (!originalData || !state.data) return true; // If no original data, assume changes exist

    const deepEqual = (obj1: any, obj2: any): boolean => {
      if (obj1 === obj2) return true;
      if (obj1 == null || obj2 == null) return false;
      if (typeof obj1 !== typeof obj2) return false;
      
      if (typeof obj1 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        if (keys1.length !== keys2.length) return false;
        
        for (let key of keys1) {
          if (!keys2.includes(key)) return false;
          if (!deepEqual(obj1[key], obj2[key])) return false;
        }
        return true;
      }
      
      return obj1 === obj2;
    };

    const getStepData = (data: any, stepNumber: number) => {
      switch (stepNumber) {
        case 0:
          return {
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            profilePictureAssetId: data.profilePictureAssetId,
          };
        case 1:
          return {
            fatherHusbandName: data.fatherHusbandName,
            motherName: data.motherName,
            dateOfBirth: data.dateOfBirth,
            cnicNumber: data.cnicNumber,
            nationality: data.nationality,
            gender: data.gender,
            maritalStatus: data.maritalStatus,
            alternateContactNumber: data.alternateContactNumber,
            presentAddress: data.presentAddress,
            permanentAddress: data.permanentAddress,
            emergencyContactName: data.emergencyContactName,
            emergencyContactRelation: data.emergencyContactRelation,
            emergencyContactNumber: data.emergencyContactNumber,
            alternateEmergencyContact: data.alternateEmergencyContact,
          };
        case 2:
          return {
            buildingAccessInfo: data.buildingAccessInfo,
          };
        case 3:
          return {
            deliveryAddresses: data.deliveryAddresses,
            billingAddress: data.billingAddress,
            businessAddresses: data.businessAddresses,
          };
        case 4:
          return {
            preferences: data.preferences,
          };
        case 5:
          return {
            linkedAccounts: data.linkedAccounts,
          };
        default:
          return {};
      }
    };

    const currentStepData = getStepData(state.data, step);
    const originalStepData = getStepData(originalData, step);

    return !deepEqual(currentStepData, originalStepData);
  };

  const validateRequiredFields = async () => {
    if (!state.data) {
      const fieldErrorsMap = { general: 'Form data is missing' };
      setFieldErrors(fieldErrorsMap);
      return { isValid: false, errors: ['Form data is missing'], fieldErrors: fieldErrorsMap };
    }

    const validationData = {
      customerType: state.data.customerType,
      title: state.data.title,
      firstName: state.data.firstName,
      lastName: state.data.lastName,
      email: state.data.email,
      mobileNumber: state.data.mobileNumber,
      username: state.data.username,
      password: state.data.password,
      confirmPassword: state.data.confirmPassword,
      profilePictureAssetId: state.data.profilePictureAssetId,
    };

    const result = await validateFormStep(customerStep1Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep2 = async () => {
    if (!state.data) {
      const fieldErrorsMap = { general: 'Form data is missing' };
      setFieldErrors(fieldErrorsMap);
      return { isValid: false, errors: ['Form data is missing'], fieldErrors: fieldErrorsMap };
    }

    const data = state.data as any;
    const validationData = {
      fatherHusbandName: data.fatherHusbandName,
      motherName: data.motherName,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      cnicNumber: data.cnicNumber,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      alternateContactNumber: data.alternateContactNumber,
      presentAddress: data.presentAddress,
      permanentAddress: data.permanentAddress,
      emergencyContactName: data.emergencyContactName,
      emergencyContactRelation: data.emergencyContactRelation,
      emergencyContactNumber: data.emergencyContactNumber,
      alternateEmergencyContact: data.alternateEmergencyContact,
    };

    const result = await validateFormStep(customerStep2Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep3 = async () => {
    if (!state.data) {
      const fieldErrorsMap = { general: 'Form data is missing' };
      setFieldErrors(fieldErrorsMap);
      return { isValid: false, errors: ['Form data is missing'], fieldErrors: fieldErrorsMap };
    }

    const data = state.data as any;
    const validationData = {
      buildingAccessInfo: data.buildingAccessInfo,
    };

    const result = await validateFormStep(customerStep3Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep5 = async () => {
    if (!state.data) {
      const fieldErrorsMap = { general: 'Form data is missing' };
      setFieldErrors(fieldErrorsMap);
      return { isValid: false, errors: ['Form data is missing'], fieldErrors: fieldErrorsMap };
    }

    const data = state.data as any;
    const validationData = {
      preferences: data.preferences,
    };

    const result = await validateFormStep(customerStep5Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep7 = async () => {
    if (!state.data) {
      const fieldErrorsMap = { general: 'Form data is missing' };
      setFieldErrors(fieldErrorsMap);
      return { isValid: false, errors: ['Form data is missing'], fieldErrors: fieldErrorsMap };
    }

    const data = state.data as any;
    const validationData = {
      security: data.security,
    };

    const result = await validateFormStep(customerStep7Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const value: CustomerFormContextType = {
    state,
    fieldErrors,
    originalData,
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
    clearProgress,
    setOriginalData,
    hasChangesInStep,
    validateRequiredFields,
    validateStep2,
    validateStep3,
    validateStep5,
    validateStep7,
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
