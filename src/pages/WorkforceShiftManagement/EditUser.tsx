import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Card,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { FormProvider, useFormContext } from "../../contexts/FormContext";
import { staffService } from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";

import {
  MdContactMail,
  MdOutlineAttachMoney,
  MdOutlineWork,
} from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { LuUserRoundPen } from "react-icons/lu";

// Components
import { PersonalInformation } from "../../components/forms/PersonalInformation";
import { AdditionalPersonalInfo } from "../../components/forms/AdditionalPersonalInfo";
import { EmploymentDetails } from "../../components/forms/EmploymentDetails";
import { DocumentsUpload } from "../../components/forms/DocumentsUpload";
import { SalaryBenefits } from "../../components/forms/SalaryBenefits";
import { IdentificationVerification } from "../../components/forms/IdentificationVerification";

// Custom Step Icon Component
const CustomStepIcon = ({
  active,
  colors,
}: {
  active: boolean;
  colors: any;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      borderRadius: "50%",
      bgcolor: active ? colors.primary[600] : colors.border.primary,
      color: "white",
    }}
  >
    <FaCircle size={12} style={{ color: "white" }} />
  </Box>
);

const steps = [
  { label: "Personal Information", icon: <LuUserRoundPen size={22} /> },
  {
    label: "Additional Personal Information",
    icon: <MdContactMail size={22} />,
  },
  { label: "Employment Details", icon: <MdOutlineWork size={22} /> },
  { label: "Salary & Benefits", icon: <MdOutlineAttachMoney size={22} /> },
  {
    label: "Identification & Verification",
    icon: <AiOutlineIdcard size={22} />,
  },
  { label: "Documents Upload", icon: <HiOutlineDocumentDuplicate size={22} /> },
];

const EditUserForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [staffProfileId, setStaffProfileId] = useState<string | null>(null);
  const {
    formData,
    currentStep,
    setCurrentStep,
    setFieldErrors,
    resetForm,
    updateMultipleFields,
    setOriginalData,
    hasChangesInStep,
  } = useFormContext();

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!id) {
        setError("User ID not found");
        return;
      }

      try {
        setIsLoadingData(true);
        const staffData = await staffService.getStaffById(id);

        setStaffProfileId(staffData.id);

        // Set profile picture URL from API response if available
        if (staffData.profilePictureAsset?.fileUrl) {
          setExistingImageUrl(staffData.profilePictureAsset.fileUrl);
        }

        // Populate form with user data
        updateMultipleFields({
          staffProfileId: staffData.id,
          username: staffData.username || "",
          email: staffData.email || "",
          phone: staffData.phone || "",
          title: staffData.title || "Mr.",
          firstName: staffData.firstName || "",
          lastName: staffData.lastName || "",
          userRole: staffData.role || "delivery_staff",
          profilePictureAssetId: staffData.profilePictureAssetId || "",
          // Additional personal info (from nested object)
          fathersName: staffData.additionalPersonalInfo?.fathersName || "",
          mothersName: staffData.additionalPersonalInfo?.mothersName || "",
          dateOfBirth: staffData.additionalPersonalInfo?.dateOfBirth
            ? new Date(staffData.additionalPersonalInfo.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          nationality: staffData.additionalPersonalInfo?.nationality || "",
          nationalId: staffData.additionalPersonalInfo?.nationalId || "",
          gender: staffData.additionalPersonalInfo?.gender || "",
          maritalStatus: staffData.additionalPersonalInfo?.maritalStatus || "",
          alternateContactNumber:
            staffData.additionalPersonalInfo?.alternateContactNumber || "",
          secondaryEmailAddress:
            staffData.additionalPersonalInfo?.secondaryEmailAddress || "",
          presentAddress:
            staffData.additionalPersonalInfo?.presentAddress || "",
          permanentAddress:
            staffData.additionalPersonalInfo?.permanentAddress || "",
          emergencyContactName:
            staffData.additionalPersonalInfo?.emergencyContactName || "",
          emergencyContactRelation:
            staffData.additionalPersonalInfo?.emergencyContactRelation || "",
          emergencyContactNumber:
            staffData.additionalPersonalInfo?.emergencyContactNumber || "",
          alternateEmergencyContact:
            staffData.additionalPersonalInfo?.alternateEmergencyContact || "",
          // Employment details (from nested object)
          jobTitle: staffData.employmentDetails?.jobTitle || "",
          department: staffData.employmentDetails?.department || "",
          employmentType: staffData.employmentDetails?.employmentType || "",
          supervisorId: staffData.employmentDetails?.supervisorId || "",
          workLocation: staffData.employmentDetails?.workLocation || "",
          shiftType: staffData.employmentDetails?.shiftType || "",
          employmentStatus: staffData.employmentDetails?.status || "",
          joiningDate: staffData.employmentDetails?.joiningDate || "",
          // Salary & benefits (from nested object)
          basicSalary: staffData.salaryBenefits?.basicSalary || "",
          allowances: staffData.salaryBenefits?.allowances || "",
          providentFund: staffData.salaryBenefits?.providentFund || "",
          salaryPaymentMode: staffData.salaryBenefits?.salaryPaymentMode || "",
          bankName: staffData.salaryBenefits?.bankName || "",
          bankAccountTitle: staffData.salaryBenefits?.bankAccountTitle || "",
          bankAccountNumber: staffData.salaryBenefits?.bankAccountNumber || "",
          taxStatus: staffData.salaryBenefits?.taxStatus || "",
          // Identification & verification (from referralInfo nested object)
          identityDocumentName:
            staffData.referralInfo?.identityDocumentName || "",
          idCardNumber: staffData.referralInfo?.idCardNumber || "",
          idCardIssuanceDate: staffData.referralInfo?.idCardIssuanceDate
            ? new Date(staffData.referralInfo.idCardIssuanceDate)
                .toISOString()
                .split("T")[0]
            : "",
          idCardExpiryDate: staffData.referralInfo?.idCardExpiryDate
            ? new Date(staffData.referralInfo.idCardExpiryDate)
                .toISOString()
                .split("T")[0]
            : "",
          referralPersonName: staffData.referralInfo?.referralPersonName || "",
          referralRelation: staffData.referralInfo?.referralRelation || "",
          referralContact: staffData.referralInfo?.referralContact || "",
          policeVerification: staffData.referralInfo?.policeVerification || "",
          remarks: staffData.referralInfo?.remarks || "",
        });

        // Store original data for change tracking
        const originalFormData = {
          staffProfileId: staffData.id,
          username: staffData.username || "",
          email: staffData.email || "",
          phone: staffData.phone || "",
          title: staffData.title || "Mr.",
          firstName: staffData.firstName || "",
          lastName: staffData.lastName || "",
          userRole: staffData.role || "delivery_staff",
          profilePictureAssetId: staffData.profilePictureAssetId || "",
          // Additional personal info (from nested object)
          fathersName: staffData.additionalPersonalInfo?.fathersName || "",
          mothersName: staffData.additionalPersonalInfo?.mothersName || "",
          dateOfBirth: staffData.additionalPersonalInfo?.dateOfBirth
            ? new Date(staffData.additionalPersonalInfo.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          nationality: staffData.additionalPersonalInfo?.nationality || "",
          nationalId: staffData.additionalPersonalInfo?.nationalId || "",
          gender: staffData.additionalPersonalInfo?.gender || "",
          maritalStatus: staffData.additionalPersonalInfo?.maritalStatus || "",
          alternateContactNumber:
            staffData.additionalPersonalInfo?.alternateContactNumber || "",
          secondaryEmailAddress:
            staffData.additionalPersonalInfo?.secondaryEmailAddress || "",
          presentAddress:
            staffData.additionalPersonalInfo?.presentAddress || "",
          permanentAddress:
            staffData.additionalPersonalInfo?.permanentAddress || "",
          emergencyContactName:
            staffData.additionalPersonalInfo?.emergencyContactName || "",
          emergencyContactRelation:
            staffData.additionalPersonalInfo?.emergencyContactRelation || "",
          emergencyContactNumber:
            staffData.additionalPersonalInfo?.emergencyContactNumber || "",
          alternateEmergencyContact:
            staffData.additionalPersonalInfo?.alternateEmergencyContact || "",
          // Employment details (from nested object)
          jobTitle: staffData.employmentDetails?.jobTitle || "",
          department: staffData.employmentDetails?.department || "",
          employmentType: staffData.employmentDetails?.employmentType || "",
          supervisorId: staffData.employmentDetails?.supervisorId || "",
          workLocation: staffData.employmentDetails?.workLocation || "",
          shiftType: staffData.employmentDetails?.shiftType || "",
          employmentStatus: staffData.employmentDetails?.status || "",
          joiningDate: staffData.employmentDetails?.joiningDate || "",
          // Salary & benefits (from nested object)
          basicSalary: staffData.salaryBenefits?.basicSalary || "",
          allowances: staffData.salaryBenefits?.allowances || "",
          providentFund: staffData.salaryBenefits?.providentFund || "",
          salaryPaymentMode: staffData.salaryBenefits?.salaryPaymentMode || "",
          bankName: staffData.salaryBenefits?.bankName || "",
          bankAccountTitle: staffData.salaryBenefits?.bankAccountTitle || "",
          bankAccountNumber: staffData.salaryBenefits?.bankAccountNumber || "",
          taxStatus: staffData.salaryBenefits?.taxStatus || "",
          // Identification & verification (from referralInfo nested object)
          identityDocumentName:
            staffData.referralInfo?.identityDocumentName || "",
          idCardNumber: staffData.referralInfo?.idCardNumber || "",
          idCardIssuanceDate: staffData.referralInfo?.idCardIssuanceDate
            ? new Date(staffData.referralInfo.idCardIssuanceDate)
                .toISOString()
                .split("T")[0]
            : "",
          idCardExpiryDate: staffData.referralInfo?.idCardExpiryDate
            ? new Date(staffData.referralInfo.idCardExpiryDate)
                .toISOString()
                .split("T")[0]
            : "",
          referralPersonName: staffData.referralInfo?.referralPersonName || "",
          referralRelation: staffData.referralInfo?.referralRelation || "",
          referralContact: staffData.referralInfo?.referralContact || "",
          policeVerification: staffData.referralInfo?.policeVerification || "",
          remarks: staffData.referralInfo?.remarks || "",
        } as any;

        setOriginalData(originalFormData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleNext = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Step 0: Update basic profile info via PATCH /staff/{id}
      if (currentStep === 0) {
        // Check if there are any changes in this step
        if (!hasChangesInStep(0)) {
          // No changes, just move to next step
          setCurrentStep(1);
          setIsLoading(false);
          return;
        }

        // Validate only step 0 fields
        const validation: {
          isValid: boolean;
          fieldErrors: Record<string, string>;
          errors: string[];
        } = {
          isValid: true,
          fieldErrors: {},
          errors: [],
        };

        if (!formData.firstName || !formData.firstName.trim()) {
          validation.fieldErrors["firstName"] = "First Name is required";
          validation.errors.push("First Name is required");
          validation.isValid = false;
        }

        if (!formData.lastName || !formData.lastName.trim()) {
          validation.fieldErrors["lastName"] = "Last Name is required";
          validation.errors.push("Last Name is required");
          validation.isValid = false;
        }

        if (!formData.userRole || !formData.userRole.trim()) {
          validation.fieldErrors["userRole"] = "User Role is required";
          validation.errors.push("User Role is required");
          validation.isValid = false;
        }

        if (!validation.isValid) {
          setFieldErrors(validation.fieldErrors);
          setError(validation.errors.join(", "));
          setIsLoading(false);
          return;
        }

        if (!staffProfileId) {
          setError("Staff ID not found");
          setIsLoading(false);
          return;
        }

        await staffService.updateStaffBasicProfile(staffProfileId, {
          title: formData.title,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profilePictureAssetId: formData.profilePictureAssetId,
          role: formData.userRole,
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(1);
      }
      // Step 1: Update additional personal info
      else if (currentStep === 1) {
        // Check if there are any changes in this step
        if (!hasChangesInStep(1)) {
          // No changes, just move to next step
          setCurrentStep(2);
          setIsLoading(false);
          return;
        }

        const fieldErrorsMap: Record<string, string> = {};

        // Validate dateOfBirth on the frontend
        if (!formData.dateOfBirth || !formData.dateOfBirth.toString().trim()) {
          fieldErrorsMap["dateOfBirth"] = "Date of Birth is required";
        } else {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(formData.dateOfBirth)) {
            fieldErrorsMap["dateOfBirth"] =
              "Date of Birth must be in YYYY-MM-DD format";
          }
        }

        if (!formData.gender || !formData.gender.trim()) {
          fieldErrorsMap["gender"] = "Gender is required";
        }

        if (!formData.nationalId || !formData.nationalId.trim()) {
          fieldErrorsMap["nationalId"] = "National ID is required";
        }

        if (!formData.maritalStatus || !formData.maritalStatus.trim()) {
          fieldErrorsMap["maritalStatus"] = "Marital Status is required";
        }

        if (
          !formData.secondaryEmailAddress ||
          !formData.secondaryEmailAddress.trim()
        ) {
          fieldErrorsMap["secondaryEmailAddress"] =
            "Secondary Email Address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.secondaryEmailAddress)) {
          fieldErrorsMap["secondaryEmailAddress"] =
            "Secondary Email Address must be a valid email";
        }

        if (Object.keys(fieldErrorsMap).length > 0) {
          setFieldErrors(fieldErrorsMap);
          setError(
            Object.values(fieldErrorsMap)[0] ||
              "Please fill in all required fields"
          );
          setIsLoading(false);
          return;
        }

        if (!staffProfileId) {
          setError("Staff ID not found");
          setIsLoading(false);
          return;
        }

        await staffService.updateAdditionalPersonalInfo(staffProfileId, {
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
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(2);
      }
      // Step 2: Update employment details
      else if (currentStep === 2) {
        // Check if there are any changes in this step
        if (!hasChangesInStep(2)) {
          // No changes, just move to next step
          setCurrentStep(3);
          setIsLoading(false);
          return;
        }

        const fieldErrorsMap: Record<string, string> = {};

        if (!formData.employmentType || !formData.employmentType.trim()) {
          fieldErrorsMap["employmentType"] = "Please select Employment Type";
        }

        if (!formData.supervisorId || !formData.supervisorId.trim()) {
          fieldErrorsMap["supervisorId"] = "Please select a Supervisor";
        }

        if (!formData.shiftType || !formData.shiftType.trim()) {
          fieldErrorsMap["shiftType"] = "Please select Shift Type";
        }

        if (!formData.employmentStatus || !formData.employmentStatus.trim()) {
          fieldErrorsMap["employmentStatus"] = "Please select Status";
        }

        if (Object.keys(fieldErrorsMap).length > 0) {
          setFieldErrors(fieldErrorsMap);
          setError(
            Object.values(fieldErrorsMap)[0] ||
              "Please fill in all required fields"
          );
          setIsLoading(false);
          return;
        }

        if (!staffProfileId) {
          setError("Staff ID not found");
          setIsLoading(false);
          return;
        }

        await staffService.updateEmploymentDetails(staffProfileId, {
          jobTitle: formData.jobTitle,
          department: formData.department,
          employmentType: formData.employmentType,
          supervisorId: formData.supervisorId,
          workLocation: formData.workLocation,
          shiftType: formData.shiftType,
          status: formData.employmentStatus,
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(3);
      }
      // Step 3: Update salary & benefits
      else if (currentStep === 3) {
        // Check if there are any changes in this step
        if (!hasChangesInStep(3)) {
          // No changes, just move to next step
          setCurrentStep(4);
          setIsLoading(false);
          return;
        }

        const fieldErrorsMap: Record<string, string> = {};

        if (!formData.taxStatus || !formData.taxStatus.trim()) {
          fieldErrorsMap["taxStatus"] = "Please select Tax Status";
        }

        if (formData.bankAccountNumber && formData.bankAccountNumber.trim()) {
          if (!/^\d+$/.test(formData.bankAccountNumber)) {
            fieldErrorsMap["bankAccountNumber"] =
              "Bank Account Number must contain only numbers";
          } else if (formData.bankAccountNumber.length > 16) {
            fieldErrorsMap["bankAccountNumber"] =
              "Bank Account Number must be maximum 16 digits";
          }
        }

        if (formData.providentFund && formData.providentFund.trim()) {
          const pfValue = parseInt(formData.providentFund);
          if (isNaN(pfValue)) {
            fieldErrorsMap["providentFund"] = "Provident Fund must be a number";
          } else if (pfValue < 0 || pfValue > 99) {
            fieldErrorsMap["providentFund"] =
              "Provident Fund must be between 0 and 99";
          }
        }

        if (Object.keys(fieldErrorsMap).length > 0) {
          setFieldErrors(fieldErrorsMap);
          setError(
            Object.values(fieldErrorsMap)[0] ||
              "Please fill in all required fields"
          );
          setIsLoading(false);
          return;
        }

        if (!staffProfileId) {
          setError("Staff ID not found");
          setIsLoading(false);
          return;
        }

        await staffService.updateSalaryBenefits(staffProfileId, {
          basicSalary: formData.basicSalary
            ? Number(formData.basicSalary)
            : undefined,
          allowances: formData.allowances,
          providentFund: formData.providentFund,
          salaryPaymentMode: formData.salaryPaymentMode,
          bankName: formData.bankName,
          bankAccountTitle: formData.bankAccountTitle,
          bankAccountNumber: formData.bankAccountNumber,
          taxStatus: formData.taxStatus,
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(4);
      }
      // Step 4: Update identification & verification
      else if (currentStep === 4) {
        // Check if there are any changes in this step
        if (!hasChangesInStep(4)) {
          // No changes, just move to next step
          setCurrentStep(5);
          setIsLoading(false);
          return;
        }

        const fieldErrorsMap: Record<string, string> = {};

        if (
          !formData.idCardIssuanceDate ||
          !formData.idCardIssuanceDate.trim()
        ) {
          fieldErrorsMap["idCardIssuanceDate"] =
            "ID Card Issuance Date is required";
        } else {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(formData.idCardIssuanceDate)) {
            fieldErrorsMap["idCardIssuanceDate"] =
              "ID Card Issuance Date must be in YYYY-MM-DD format";
          }
        }

        if (!formData.idCardExpiryDate || !formData.idCardExpiryDate.trim()) {
          fieldErrorsMap["idCardExpiryDate"] =
            "ID Card Expiry Date is required";
        } else {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(formData.idCardExpiryDate)) {
            fieldErrorsMap["idCardExpiryDate"] =
              "ID Card Expiry Date must be in YYYY-MM-DD format";
          }
        }

        if (Object.keys(fieldErrorsMap).length > 0) {
          setFieldErrors(fieldErrorsMap);
          setError(
            Object.values(fieldErrorsMap)[0] ||
              "Please fill in all required fields"
          );
          setIsLoading(false);
          return;
        }

        if (!staffProfileId) {
          setError("Staff ID not found");
          setIsLoading(false);
          return;
        }

        await staffService.updateIdentificationVerification(staffProfileId, {
          identityDocumentName: formData.identityDocumentName,
          idCardNumber: formData.idCardNumber,
          idCardIssuanceDate: formData.idCardIssuanceDate,
          idCardExpiryDate: formData.idCardExpiryDate,
          referralPersonName: formData.referralPersonName,
          referralRelation: formData.referralRelation,
          referralContact: formData.referralContact,
          policeVerification: formData.policeVerification,
          remarks: formData.remarks,
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(5);
      }
      // Step 5: Documents Upload - just move forward
      else if (currentStep === 5) {
        resetForm();
        navigate("/dashboard/users");
        return;
      }
      // Other steps: just move forward
      else {
        setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            isEditMode={true}
            existingImageUrl={existingImageUrl || undefined}
          />
        );
      case 1:
        return <AdditionalPersonalInfo />;
      case 2:
        return <EmploymentDetails />;
      case 3:
        return <SalaryBenefits />;
      case 4:
        return <IdentificationVerification />;
      case 5:
        return <DocumentsUpload />;
      default:
        return (
          <PersonalInformation
            isEditMode={true}
            existingImageUrl={existingImageUrl || undefined}
          />
        );
    }
  };

  if (isLoadingData) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 100px)",
          backgroundColor: colors.background.primary,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "calc(100vh - 100px)",
        backgroundColor: colors.background.primary,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          bgcolor: colors.background.card,
          p: 4,
          pr: 0,
          borderRight: `1px solid ${colors.border.primary}`,
        }}
      >
        {/* <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
          Edit User
        </Typography> */}
        <Stepper
          activeStep={currentStep}
          orientation="vertical"
          sx={{
            "& .MuiStepLabel-root": { py: 1 },
            "& .MuiStepLabel-iconContainer": {
              "& .MuiSvgIcon-root": { fontSize: 28 },
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon
                    active={index === currentStep}
                    colors={colors}
                  />
                )}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      color:
                        index === currentStep
                          ? colors.primary[600]
                          : colors.text.secondary,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        index === currentStep
                          ? colors.primary[600]
                          : colors.text.secondary,
                      fontWeight: index === currentStep ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, height: "auto" }}>
        <Card
          sx={{
            p: 3,
            height: "100%",
            boxShadow: "none",
            backgroundColor: colors.background.card,
            color: colors.text.primary,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {steps[currentStep].icon}
              <Typography
                variant="h6"
                sx={{ my: 1, color: colors.text.primary }}
              >
                {steps[currentStep].label}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ height: "71vh", pr: 1, pt: 1, overflowY: "scroll" }}
            className="noScrollbar"
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Changes saved successfully!
              </Alert>
            )}
            {renderStepContent(currentStep)}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={currentStep === 0 || isLoading}
              startIcon={<BsArrowLeft />}
              sx={{ px: 4 }}
            >
              Previous
            </Button>
            <PrimaryButton
              endIcon={
                isLoading ? (
                  <CircularProgress size={20} sx={{ ml: 1 }} />
                ) : (
                  <BsArrowRight />
                )
              }
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : currentStep === steps.length - 1
                ? "Complete & Save"
                : "Next"}
            </PrimaryButton>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export const EditUser = () => {
  return (
    <FormProvider>
      <EditUserForm />
    </FormProvider>
  );
};
