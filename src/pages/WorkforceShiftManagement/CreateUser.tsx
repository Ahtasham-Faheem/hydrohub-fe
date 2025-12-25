import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { validatePasswordMatch } from "../../utils/validationUtils";
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
import { OnboardingProgressBar } from "../../components/common/OnboardingProgressBar";

// Custom Step Icon Component
const CustomStepIcon = ({ active, colors }: { active: boolean; colors: any }) => (
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

// ✅ Ordered according to renderStepContent
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
  // { label: "Attendance & Duty Info", icon: <FaRegCalendarCheck size={22} /> },
  // { label: "Assets & Equipment Assigned", icon: <GiLaptop size={22} /> },
  // { label: "Additional Notes", icon: <IoMdClipboard size={22} /> },
];

const CreateUserForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { colors } = useTheme();
  const {
    formData,
    currentStep,
    setCurrentStep,
    setFieldErrors,
    validateRequiredFields,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    resetForm,
  } = useFormContext();
  const navigate = useNavigate();

  const getSuccessMessage = (step: number) => {
    switch (step) {
      case 0:
        return "Personal information saved successfully!";
      case 1:
        return "Additional personal information saved successfully!";
      case 2:
        return "Employment details saved successfully!";
      case 3:
        return "Salary & benefits information saved successfully!";
      case 4:
        return "Identification & verification saved successfully!";
      case 5:
        return "Documents uploaded successfully!";
      default:
        return "Information saved successfully!";
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleNext = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Step 0: Create staff member via /staff API (first time) or update via PATCH (if already created)
      if (currentStep === 0) {
        const validation = await validateRequiredFields();
        if (!validation.isValid) {
          setError(validation.errors[0] || 'Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        // Validate profile picture is uploaded
        if (!formData.profilePictureAssetId || !formData.profilePictureAssetId.trim()) {
          setFieldErrors({ profilePictureAssetId: 'Profile picture is required' });
          setError('Please upload a profile picture to continue');
          setIsLoading(false);
          return;
        }

        // Validate password confirmation
        const passwordValidation = validatePasswordMatch(formData.password, formData.confirmPassword || '');
        if (!passwordValidation.isValid) {
          setError(passwordValidation.error || 'Password validation failed');
          setIsLoading(false);
          return;
        }

        // Check if staff member already exists (has staffProfileId)
        if (formData.staffProfileId) {
          // User already created, use PATCH API to update basic profile
          await staffService.updateStaffBasicProfile(formData.staffProfileId, {
            title: formData.title || "Mr.",
            firstName: formData.firstName,
            lastName: formData.lastName,
            profilePictureAssetId: formData.profilePictureAssetId,
            role: formData.userRole || "delivery_staff",
          });
        } else {
          // First time creation, use POST API
          const response = await staffService.createStaff({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            title: formData.title || "Mr.",
            firstName: formData.firstName,
            lastName: formData.lastName,
            profilePictureAssetId: formData.profilePictureAssetId,
            role: formData.userRole || "delivery_staff",
          });

          // Save staffProfileId for next steps
          if (response.id) {
            formData.staffProfileId = response.id;
          }
        }

        setSuccess(true);
        setSuccessMessage(getSuccessMessage(0));
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(1);
      }
      // Step 1: Submit additional personal info via PATCH API
      else if (currentStep === 1) {
        if (!formData.staffProfileId) {
          setError("Staff profile not found. Please complete step 1 first.");
          setIsLoading(false);
          return;
        }

        const validation = await validateStep1();
        if (!validation.isValid) {
          setError(validation.errors[0] || 'Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        await staffService.updateAdditionalPersonalInfo(
          formData.staffProfileId,
          {
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
          }
        );

        setSuccess(true);
        setSuccessMessage(getSuccessMessage(1));
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(2);
      }
      // Step 2: Submit employment details via PATCH API
      else if (currentStep === 2) {
        if (!formData.staffProfileId) {
          setError("Staff profile not found. Please complete step 1 first.");
          setIsLoading(false);
          return;
        }

        const validation = await validateStep2();
        if (!validation.isValid) {
          setError(validation.errors[0] || 'Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        await staffService.updateEmploymentDetails(
          formData.staffProfileId,
          {
            jobTitle: formData.jobTitle,
            department: formData.department,
            employmentType: formData.employmentType,
            supervisorId: formData.supervisorId,
            workLocation: formData.workLocation,
            shiftType: formData.shiftType,
            status: formData.employmentStatus,
          }
        );

        setSuccess(true);
        setSuccessMessage(getSuccessMessage(2));
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(3);
      }
      // Step 3: Submit salary & benefits via PATCH API
      else if (currentStep === 3) {
        if (!formData.staffProfileId) {
          setError("Staff profile not found. Please complete step 1 first.");
          setIsLoading(false);
          return;
        }

        const validation = await validateStep3();
        if (!validation.isValid) {
          setError(validation.errors[0] || 'Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        await staffService.updateSalaryBenefits(
          formData.staffProfileId,
          {
            basicSalary: formData.basicSalary ? Number(formData.basicSalary) : undefined,
            allowances: formData.allowances,
            providentFund: formData.providentFund,
            salaryPaymentMode: formData.salaryPaymentMode,
            bankName: formData.bankName,
            bankAccountTitle: formData.bankAccountTitle,
            bankAccountNumber: formData.bankAccountNumber,
            taxStatus: formData.taxStatus,
          }
        );

        setSuccess(true);
        setSuccessMessage(getSuccessMessage(3));
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(4);
      }
      // Step 4: Submit identification & verification via PATCH API
      else if (currentStep === 4) {
        if (!formData.staffProfileId) {
          setError("Staff profile not found. Please complete step 1 first.");
          setIsLoading(false);
          return;
        }

        const validation = await validateStep4();
        if (!validation.isValid) {
          setError(validation.errors[0] || 'Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        await staffService.updateIdentificationVerification(
          formData.staffProfileId,
          {
            identityDocumentName: formData.identityDocumentName,
            idCardNumber: formData.idCardNumber,
            idCardIssuanceDate: formData.idCardIssuanceDate,
            idCardExpiryDate: formData.idCardExpiryDate,
            referralPersonName: formData.referralPersonName,
            referralRelation: formData.referralRelation,
            referralContact: formData.referralContact,
            policeVerification: formData.policeVerification,
            remarks: formData.remarks,
          }
        );

        setSuccess(true);
        setSuccessMessage(getSuccessMessage(4));
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(5);
      }
      // Step 6: Submit assets & equipment via PATCH API
      else if (currentStep === 6) {
        if (!formData.staffProfileId) {
          setError("Staff profile not found. Please complete step 1 first.");
          setIsLoading(false);
          return;
        }

        await staffService.updateAssetsAndEquipment(
          formData.staffProfileId,
          {
            equipmentType: formData.equipmentType,
            assetId: formData.assetId,
            assignedDate: formData.assignedDate,
            quantity: formData.quantity ? Number(formData.quantity) : undefined,
            unitOfMeasure: formData.unitOfMeasure,
            issueBy: formData.issueBy,
            remarks: formData.remarks,
          }
        );

        setSuccess(true);
        setSuccessMessage(getSuccessMessage(6));
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(7);
      }
      // Step 5: Documents Upload - just move forward (documents are uploaded via CRUD in component)
      else if (currentStep === 5) {
        // Complete the form - reset context and navigate back
        resetForm();
        navigate('/dashboard/users');
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
        return <PersonalInformation />;
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
        return <PersonalInformation />;
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "73vh",
      backgroundColor: colors.background.primary 
    }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          bgcolor: colors.background.card,
          p: 4,
          pr: 2,
          borderRight: `1px solid ${colors.border.primary}`,
        }}
      >
        {/* Progress Bar */}
        <OnboardingProgressBar 
          staffId={formData.staffProfileId || null} 
          currentStep={currentStep}
          totalSteps={steps.length}
        />
        
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
                  <CustomStepIcon active={index === currentStep} colors={colors} />
                )}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: colors.background.secondary },
                }}
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
        <Card sx={{ 
          p: 3, 
          height: "100%", 
          boxShadow: "none",
          backgroundColor: colors.background.card,
          color: colors.text.primary 
        }}>
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {steps[currentStep].icon}
              <Typography variant="h6">
                {steps[currentStep].label}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ height: "auto", pr: 1, pt: 1, overflowY: "scroll" }}
            className="noScrollbar"
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
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
              endIcon={isLoading ? <CircularProgress size={20} sx={{ ml: 1 }} /> : <BsArrowRight />}
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : currentStep === steps.length - 1
                ? "Complete & Create User"
                : "Next"}
            </PrimaryButton>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export const CreateUser = () => {
  return (
    <FormProvider>
      <CreateUserForm />
    </FormProvider>
  );
};
