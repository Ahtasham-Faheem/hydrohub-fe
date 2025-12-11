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
  fieldErrors: Record<string, string>;
  updateFormData: (field: keyof FormData, value: string | boolean) => void;
  updateMultipleFields: (fields: Partial<FormData>) => void;
  setCurrentStep: (step: number) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
  validateRequiredFields: () => { isValid: boolean; errors: string[]; fieldErrors: Record<string, string> };
  validateStep1: () => { isValid: boolean; errors: string[]; fieldErrors: Record<string, string> };
  validateStep2: () => { isValid: boolean; errors: string[]; fieldErrors: Record<string, string> };
  validateStep3: () => { isValid: boolean; errors: string[]; fieldErrors: Record<string, string> };
  validateStep4: () => { isValid: boolean; errors: string[]; fieldErrors: Record<string, string> };
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
    const fieldErrorsMap: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
        const errorMsg = `${fieldLabel} is required`;
        errors.push(errorMsg);
        fieldErrorsMap[field] = errorMsg;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      const emailError = "Please enter a valid email address";
      errors.push(emailError);
      fieldErrorsMap["email"] = emailError;
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      const passwordError = "Password must be at least 6 characters";
      errors.push(passwordError);
      fieldErrorsMap["password"] = passwordError;
    }

    setFieldErrors(fieldErrorsMap);
    return { isValid: errors.length === 0, errors, fieldErrors: fieldErrorsMap };
  };

  const validateStep1 = () => {
    const errors: string[] = [];
    const fieldErrorsMap: Record<string, string> = {};

    // Date of Birth validation - must be ISO 8601 format
    if (!formData.dateOfBirth || !formData.dateOfBirth.trim()) {
      const dateError = "Date of Birth is required";
      errors.push(dateError);
      fieldErrorsMap["dateOfBirth"] = dateError;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        const dateError = "Date of Birth must be in YYYY-MM-DD format";
        errors.push(dateError);
        fieldErrorsMap["dateOfBirth"] = dateError;
      }
    }

    // Gender validation - required
    if (!formData.gender || !formData.gender.trim()) {
      const genderError = "Please select a Gender";
      errors.push(genderError);
      fieldErrorsMap["gender"] = genderError;
    }

    // Marital Status validation - required
    if (!formData.maritalStatus || !formData.maritalStatus.trim()) {
      const maritalStatusError = "Please select Marital Status";
      errors.push(maritalStatusError);
      fieldErrorsMap["maritalStatus"] = maritalStatusError;
    }

    // Secondary Email validation - if provided, must be valid email
    if (!formData.secondaryEmailAddress || !formData.secondaryEmailAddress.trim()) {
      const secondaryEmailError = "Secondary Email Address is required";
      errors.push(secondaryEmailError);
      fieldErrorsMap["secondaryEmailAddress"] = secondaryEmailError;
    } else if (!/\S+@\S+\.\S+/.test(formData.secondaryEmailAddress)) {
      const secondaryEmailError = "Secondary Email must be a valid email address";
      errors.push(secondaryEmailError);
      fieldErrorsMap["secondaryEmailAddress"] = secondaryEmailError;
    }

    setFieldErrors(fieldErrorsMap);
    return { isValid: errors.length === 0, errors, fieldErrors: fieldErrorsMap };
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    const fieldErrorsMap: Record<string, string> = {};

    // Employment Details validation
    if (!formData.employmentType || !formData.employmentType.trim()) {
      const employmentTypeError = "Please select Employment Type";
      errors.push(employmentTypeError);
      fieldErrorsMap["employmentType"] = employmentTypeError;
    }

    if (!formData.supervisorId || !formData.supervisorId.trim()) {
      const supervisorIdError = "Please select a Supervisor";
      errors.push(supervisorIdError);
      fieldErrorsMap["supervisorId"] = supervisorIdError;
    }

    if (!formData.shiftType || !formData.shiftType.trim()) {
      const shiftTypeError = "Please select Shift Type";
      errors.push(shiftTypeError);
      fieldErrorsMap["shiftType"] = shiftTypeError;
    }

    if (!formData.employmentStatus || !formData.employmentStatus.trim()) {
      const employmentStatusError = "Please select Status";
      errors.push(employmentStatusError);
      fieldErrorsMap["employmentStatus"] = employmentStatusError;
    }

    setFieldErrors(fieldErrorsMap);
    return { isValid: errors.length === 0, errors, fieldErrors: fieldErrorsMap };
  };

  const validateStep3 = () => {
    const errors: string[] = [];
    const fieldErrorsMap: Record<string, string> = {};

    // Salary Payment Mode validation
    if (!formData.salaryPaymentMode || !formData.salaryPaymentMode.trim()) {
      const salaryPaymentModeError = "Please select Salary Payment Mode";
      errors.push(salaryPaymentModeError);
      fieldErrorsMap["salaryPaymentMode"] = salaryPaymentModeError;
    }

    // Salary & Benefits validation
    if (!formData.taxStatus || !formData.taxStatus.trim()) {
      const taxStatusError = "Please select Tax Status";
      errors.push(taxStatusError);
      fieldErrorsMap["taxStatus"] = taxStatusError;
    }

    // Bank Account Number validation - max 16 digits, numeric only if provided
    if (formData.bankAccountNumber && formData.bankAccountNumber.trim()) {
      if (!/^\d+$/.test(formData.bankAccountNumber)) {
        const bankAccountError = "Bank Account Number must contain only numbers";
        errors.push(bankAccountError);
        fieldErrorsMap["bankAccountNumber"] = bankAccountError;
      } else if (formData.bankAccountNumber.length > 16) {
        const bankAccountError = "Bank Account Number must be maximum 16 digits";
        errors.push(bankAccountError);
        fieldErrorsMap["bankAccountNumber"] = bankAccountError;
      }
    }

    // Provident Fund validation - must be 0-99 if provided
    if (formData.providentFund && formData.providentFund.trim()) {
      const pfValue = parseInt(formData.providentFund);
      if (isNaN(pfValue)) {
        const pfError = "Provident Fund must be a number";
        errors.push(pfError);
        fieldErrorsMap["providentFund"] = pfError;
      } else if (pfValue < 0 || pfValue > 99) {
        const pfError = "Provident Fund must be between 0 and 99";
        errors.push(pfError);
        fieldErrorsMap["providentFund"] = pfError;
      }
    }

    setFieldErrors(fieldErrorsMap);
    return { isValid: errors.length === 0, errors, fieldErrors: fieldErrorsMap };
  };

  const validateStep4 = () => {
    const errors: string[] = [];
    const fieldErrorsMap: Record<string, string> = {};

    // Identification & Verification validation
    if (!formData.idCardIssuanceDate || !formData.idCardIssuanceDate.trim()) {
      const idCardIssuanceDateError = "ID Card Issuance Date is required";
      errors.push(idCardIssuanceDateError);
      fieldErrorsMap["idCardIssuanceDate"] = idCardIssuanceDateError;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.idCardIssuanceDate)) {
        const idCardIssuanceDateError = "ID Card Issuance Date must be in YYYY-MM-DD format";
        errors.push(idCardIssuanceDateError);
        fieldErrorsMap["idCardIssuanceDate"] = idCardIssuanceDateError;
      }
    }

    if (!formData.idCardExpiryDate || !formData.idCardExpiryDate.trim()) {
      const idCardExpiryDateError = "ID Card Expiry Date is required";
      errors.push(idCardExpiryDateError);
      fieldErrorsMap["idCardExpiryDate"] = idCardExpiryDateError;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.idCardExpiryDate)) {
        const idCardExpiryDateError = "ID Card Expiry Date must be in YYYY-MM-DD format";
        errors.push(idCardExpiryDateError);
        fieldErrorsMap["idCardExpiryDate"] = idCardExpiryDateError;
      }
    }

    setFieldErrors(fieldErrorsMap);
    return { isValid: errors.length === 0, errors, fieldErrors: fieldErrorsMap };
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
