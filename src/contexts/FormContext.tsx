import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface FormData {
  // Required fields
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;

  // Staff Profile ID (set after first step submission)
  staffProfileId?: string;

  // New / requested personal fields
  employeeId?: string;
  employeeCreationDate?: string;
  title?: string;
  nationality?: string;
  mothersName?: string;
  fathersName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  maritalStatus?: string;

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

  // Employment Details fields
  joiningDate?: string;
  jobTitle?: string;
  department?: string;
  employmentType?: string;
  supervisor?: string;
  supervisorId?: string;
  workLocation?: string;
  shiftType?: string;
  employmentStatus?: string;

  // Salary & Benefits fields
  basicSalary?: string;
  allowances?: string;
  providentFund?: string;
  salaryPaymentMode?: string;
  bankName?: string;
  bankAccountTitle?: string;
  bankAccountNumber?: string;
  taxStatus?: string;

  // Identification & Verification fields
  identityDocumentName?: string;
  idCardNumber?: string;
  idCardIssuanceDate?: string;
  idCardExpiryDate?: string;
  policeVerification?: string;
  referralPersonName?: string;
  referralRelation?: string;
  referralContact?: string;
  remarks?: string;

  // Attendance & Duty Info fields
  attendanceCode?: string;
  dutyArea?: string;
  weeklyOffDay?: string;
  leaveBalance?: string;

  // Assets & Equipment Assigned fields
  equipmentType?: string;
  assetId?: string;
  assignedDate?: string;
  quantity?: number;
  unitOfMeasure?: string;
  issueBy?: string;

  // Documents Upload fields
  documentRemarks?: string;

  // Optional fields
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
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  staffProfileId: "",
  employeeId: "",
  employeeCreationDate: "",
  title: "",
  nationality: "",
  mothersName: "",
  fathersName: "",
  dateOfBirth: "",
  gender: "Male",
  nationalId: "",
  maritalStatus: "Single",
  secondaryEmail: "",
  secondaryEmailAddress: "",
  presentAddress: "",
  permanentAddress: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactNumber: "",
  alternateContactNumber: "",
  alternateEmergencyContact: "",
  joiningDate: "",
  jobTitle: "",
  department: "",
  employmentType: "",
  supervisor: "",
  supervisorId: "",
  workLocation: "",
  shiftType: "",
  employmentStatus: "",
  basicSalary: "",
  allowances: "",
  providentFund: "",
  salaryPaymentMode: "cash",
  bankName: "",
  bankAccountTitle: "",
  bankAccountNumber: "",
  taxStatus: "",
  identityDocumentName: "",
  idCardNumber: "",
  idCardIssuanceDate: "",
  idCardExpiryDate: "",
  policeVerification: "",
  referralPersonName: "",
  referralRelation: "",
  referralContact: "",
  remarks: "",
  attendanceCode: "",
  dutyArea: "",
  weeklyOffDay: "",
  leaveBalance: "",
  equipmentType: "",
  assetId: "",
  assignedDate: "",
  quantity: 0,
  unitOfMeasure: "",
  issueBy: "",
  documentRemarks: "",
  profilePictureAssetId: "",
  status: "active",
  userRole: "vendor_admin",
  accessLevel: "Limited",
  accessExpiry: "2025-12-31",
  branchAssignment: "Lahore Head Office",
  twoFactorAuth: false,
  userId: "",
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("createUserFormData");
    return saved ? JSON.parse(saved) : initialFormData;
  });

  const [currentStep, setCurrentStepState] = useState<number>(() => {
    const saved = localStorage.getItem("createUserCurrentStep");
    return saved ? parseInt(saved) : 0;
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem("createUserFormData", JSON.stringify(newData));
  };

  const updateMultipleFields = (fields: Partial<FormData>) => {
    const newData = { ...formData, ...fields };
    setFormData(newData);
    localStorage.setItem("createUserFormData", JSON.stringify(newData));
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    localStorage.setItem("createUserCurrentStep", step.toString());
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStepState(0);
    localStorage.removeItem("createUserFormData");
    localStorage.removeItem("createUserCurrentStep");
  };

  const validateRequiredFields = () => {
    const requiredFields: (keyof FormData)[] = [
      "username",
      "firstName",
      "lastName",
      "email",
      "password",
      "phone",
    ];
    const errors: string[] = [];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        errors.push(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    return { isValid: errors.length === 0, errors };
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        updateMultipleFields,
        setCurrentStep,
        resetForm,
        validateRequiredFields,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
