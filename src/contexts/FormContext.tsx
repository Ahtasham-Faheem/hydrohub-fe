import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FormData {
  // Required fields
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  
  // Optional fields
  fathersName: string;
  dateOfBirth: string;
  gender: string;
  nationalId: string;
  maritalStatus: string;
  profilePictureAssetId: string;
  status: string;
  
  // Staff fields
  userRole: string;
  accessLevel: string;
  accessExpiry: string;
  branchAssignment: string;
  twoFactorAuth: boolean;
  
  // System fields
  userId: string;
}

interface FormContextType {
  formData: FormData;
  currentStep: number;
  updateFormData: (field: keyof FormData, value: string | boolean) => void;
  updateMultipleFields: (fields: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  validateRequiredFields: () => { isValid: boolean; errors: string[] };
}

const initialFormData: FormData = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  fathersName: '',
  dateOfBirth: '',
  gender: 'Male',
  nationalId: '',
  maritalStatus: 'Single',
  profilePictureAssetId: '',
  status: 'active',
  userRole: 'vendor_admin',
  accessLevel: 'Limited',
  accessExpiry: '2025-12-31',
  branchAssignment: 'Lahore Head Office',
  twoFactorAuth: false,
  userId: '',
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('createUserFormData');
    return saved ? JSON.parse(saved) : initialFormData;
  });
  
  const [currentStep, setCurrentStepState] = useState<number>(() => {
    const saved = localStorage.getItem('createUserCurrentStep');
    return saved ? parseInt(saved) : 0;
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem('createUserFormData', JSON.stringify(newData));
  };

  const updateMultipleFields = (fields: Partial<FormData>) => {
    const newData = { ...formData, ...fields };
    setFormData(newData);
    localStorage.setItem('createUserFormData', JSON.stringify(newData));
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    localStorage.setItem('createUserCurrentStep', step.toString());
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStepState(0);
    localStorage.removeItem('createUserFormData');
    localStorage.removeItem('createUserCurrentStep');
  };

  const validateRequiredFields = () => {
    const requiredFields: (keyof FormData)[] = ['username', 'firstName', 'lastName', 'email', 'password', 'phone'];
    const errors: string[] = [];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return { isValid: errors.length === 0, errors };
  };

  return (
    <FormContext.Provider value={{
      formData,
      currentStep,
      updateFormData,
      updateMultipleFields,
      setCurrentStep,
      resetForm,
      validateRequiredFields,
    }}>
      {children}
    </FormContext.Provider>
  );
};