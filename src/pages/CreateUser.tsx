import { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Card,
  Alert,
} from "@mui/material";
import { PrimaryButton } from "../components/PrimaryButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FormProvider, useFormContext } from "../contexts/FormContext";
import { useCreateUser } from "../hooks/useUsers";
import { useCreateStaff } from "../hooks/useStaff";

// React Icons
import { FaUserAlt, FaRegCalendarCheck } from "react-icons/fa";
import {
  MdContactMail,
  MdOutlineAttachMoney,
  MdOutlineWork,
} from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { GiLaptop } from "react-icons/gi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { IoMdClipboard } from "react-icons/io";

// Components
import { PersonalInformation } from "../components/forms/PersonalInformation";
import { ContactInformation } from "../components/forms/ContactInformation";
import { EmploymentDetails } from "../components/forms/EmploymentDetails";
import { DocumentsUpload } from "../components/forms/DocumentsUpload";
import { SalaryBenefits } from "../components/forms/SalaryBenefits";
import { AttendanceDutyInfo } from "../components/forms/AttendanceDutyInfo";
import { AdditionalNotes } from "../components/forms/AdditionalNotes";
import { AssetsAndEquipmentAssigned } from "../components/forms/AssetsAndEquipmentAssigned";
import { IdentificationVerification } from "../components/forms/IdentificationVerification";

// ✅ Ordered according to renderStepContent
const steps = [
  { label: "Personal Information", icon: <FaUserAlt size={22} /> },
  { label: "Contact Information", icon: <MdContactMail size={22} /> },
  { label: "Employment Details", icon: <MdOutlineWork size={22} /> },
  { label: "Salary & Benefits", icon: <MdOutlineAttachMoney size={22} /> },
  { label: "Identification & Verification", icon: <AiOutlineIdcard size={22} /> },
  { label: "Attendance & Duty Info", icon: <FaRegCalendarCheck size={22} /> },
  { label: "Assets & Equipment Assigned", icon: <GiLaptop size={22} /> },
  { label: "Documents Upload", icon: <HiOutlineDocumentDuplicate size={22} /> },
  { label: "Additional Notes", icon: <IoMdClipboard size={22} /> },
];

const CreateUserForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateFormData,
    validateRequiredFields,
  } = useFormContext();

  // TanStack Query mutations
  const createUserMutation = useCreateUser();
  const createStaffMutation = useCreateStaff();
  const [image, setImage] = useState<string | null>(null);

  const handleNext = async () => {
    setError(null);

    if (currentStep === 0) {
      const validation = validateRequiredFields();
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      createUserMutation.mutate(
        {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          status: formData.status,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fathersName: formData.fathersName,
          dateOfBirth: formData.dateOfBirth,
          userRole: formData.userRole,
          gender: formData.gender,
          nationalId: formData.nationalId,
          maritalStatus: formData.maritalStatus,
          profilePictureAssetId: formData.profilePictureAssetId,
        },
        {
          onSuccess: (userResponse) => {
            updateFormData("userId", userResponse.id);
            setSuccess(true);
            setCurrentStep(1);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          },
          onError: (error: any) => {
            setError(error.response?.data?.message || "Failed to create user");
          },
        }
      );
      return;
    }

    // If it's the second step, create staff
    if (currentStep === 1) {
      if (!formData.userId) {
        setError("User ID is missing. Please go back and create user first.");
        return;
      }

      createStaffMutation.mutate(
        {
          userId: formData.userId,
          accessLevel: formData.accessLevel,
          accessExpiry: formData.accessExpiry,
          branchAssignment: formData.branchAssignment,
          twoFactorAuth: formData.twoFactorAuth,
        },
        {
          onSuccess: () => {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          },
          onError: (error: any) => {
            setError(
              error.response?.data?.message || "Failed to assign staff role"
            );
          },
        }
      );
      return;
    }

    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            image={image}
            onImageUpload={handleImageUpload}
            onImageReset={() => setImage(null)}
          />
        );
      case 1:
        return <ContactInformation />;
      case 2:
        return <EmploymentDetails />;
      case 3:
        return <SalaryBenefits />;
      case 4:
        return <IdentificationVerification />;
      case 5:
        return <AttendanceDutyInfo />;
      case 6:
        return <AssetsAndEquipmentAssigned />;
      case 7:
        return <DocumentsUpload />;
      case 8:
        return <AdditionalNotes />;
      default:
        return (
          <PersonalInformation
            image={image}
            onImageUpload={handleImageUpload}
            onImageReset={() => setImage(null)}
          />
        );
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          bgcolor: "white",
          p: 4,
          pr: 0,
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          User Creation Form
        </Typography>
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
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {step.icon}
                  <Typography variant="body2">{step.label}</Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, height: "auto" }}>
        <Card sx={{ p: 3, height: "100%", boxShadow: "none" }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {steps[currentStep].icon}
              <Typography variant="h6" sx={{ my: 1 }}>
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
                User created successfully!
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
              disabled={currentStep === 0}
              startIcon={<BsArrowLeft />}
              sx={{ px: 4 }}
            >
              Previous
            </Button>
            <PrimaryButton
              endIcon={<BsArrowRight />}
              onClick={handleNext}
              disabled={
                createUserMutation.isPending || createStaffMutation.isPending
              }
            >
              {createUserMutation.isPending || createStaffMutation.isPending
                ? "Processing..."
                : currentStep === 0
                ? "Create User"
                : currentStep === 1
                ? "Assign Role"
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
