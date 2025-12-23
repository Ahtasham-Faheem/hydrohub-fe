import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  userStep1Schema,
  userStep2Schema,
  userStep3Schema,
  userStep4Schema,
  userStep5Schema,
  validateFormStep,
} from "../utils/validationSchemas";

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
  fieldErrors: Record<string, string>;
  updateFormData: (field: keyof FormData, value: string | boolean) => void;
  updateMultipleFields: (fields: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
  validateRequiredFields: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep1: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep2: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep3: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
  validateStep4: () => Promise<{ isValid: boolean; errors: string[]; fieldErrors: Record<string, string> }>;
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
  gender: "",
  nationalId: "",
  maritalStatus: "",
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
  userRole: "",
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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const validateRequiredFields = async () => {
    const validationData = {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone,
      title: formData.title,
      profilePictureAssetId: formData.profilePictureAssetId,
      userRole: formData.userRole,
    };

    const result = await validateFormStep(userStep1Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep1 = async () => {
    const validationData = {
      fathersName: formData.fathersName,
      mothersName: formData.mothersName,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      nationalId: formData.nationalId,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      alternateContactNumber: formData.alternateContactNumber,
      secondaryEmailAddress: formData.secondaryEmailAddress,
      presentAddress: formData.presentAddress,
      permanentAddress: formData.permanentAddress,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelation: formData.emergencyContactRelation,
      emergencyContactNumber: formData.emergencyContactNumber,
      alternateEmergencyContact: formData.alternateEmergencyContact,
    };

    const result = await validateFormStep(userStep2Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep2 = async () => {
    const validationData = {
      jobTitle: formData.jobTitle,
      department: formData.department,
      employmentType: formData.employmentType,
      supervisorId: formData.supervisorId,
      workLocation: formData.workLocation,
      shiftType: formData.shiftType,
      employmentStatus: formData.employmentStatus,
    };

    const result = await validateFormStep(userStep3Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep3 = async () => {
    const validationData = {
      basicSalary: formData.basicSalary ? Number(formData.basicSalary) : null,
      allowances: formData.allowances,
      providentFund: formData.providentFund ? Number(formData.providentFund) : null,
      salaryPaymentMode: formData.salaryPaymentMode,
      bankName: formData.bankName,
      bankAccountTitle: formData.bankAccountTitle,
      bankAccountNumber: formData.bankAccountNumber,
      taxStatus: formData.taxStatus,
    };

    const result = await validateFormStep(userStep4Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  const validateStep4 = async () => {
    const validationData = {
      identityDocumentName: formData.identityDocumentName,
      idCardNumber: formData.idCardNumber,
      idCardIssuanceDate: formData.idCardIssuanceDate,
      idCardExpiryDate: formData.idCardExpiryDate,
      referralPersonName: formData.referralPersonName,
      referralRelation: formData.referralRelation,
      referralContact: formData.referralContact,
      policeVerification: formData.policeVerification,
      remarks: formData.remarks,
    };

    const result = await validateFormStep(userStep5Schema, validationData);
    setFieldErrors(result.errors);
    
    return {
      isValid: result.isValid,
      errors: Object.values(result.errors),
      fieldErrors: result.errors,
    };
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        fieldErrors,
        updateFormData,
        updateMultipleFields,
        setCurrentStep,
        setFieldErrors,
        resetForm,
        validateRequiredFields,
        validateStep1,
        validateStep2,
        validateStep3,
        validateStep4,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
