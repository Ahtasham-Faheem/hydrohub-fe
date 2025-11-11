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
import { usersService, staffService } from "../services/api";

// React Icons
import { FaUserAlt, FaMapMarkedAlt, FaRegCalendarCheck } from "react-icons/fa";
import {
  MdContactMail,
  MdOutlineAttachMoney,
  MdOutlineWork,
} from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { RiSettings4Line } from "react-icons/ri";
import { GiLaptop } from "react-icons/gi";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { IoMdClipboard } from "react-icons/io";

// Components
import { PersonalInformation } from "../components/forms/PersonalInformation";
import { SystemAccessRole } from "../components/forms/SystemAccessRole";
import { ContactInformation } from "../components/forms/ContactInformation";
import { EmploymentDetails } from "../components/forms/EmploymentDetails";
import { ReferralInformation } from "../components/forms/ReferralInformation";
import { DocumentsUpload } from "../components/forms/DocumentsUpload";
import { SalaryBenefits } from "../components/forms/SalaryBenefits";
import { AttendanceDutyInfo } from "../components/forms/AttendanceDutyInfo";
import { AdditionalNotes } from "../components/forms/AdditionalNotes";
import { AssetsAndEquipmentAssigned } from "../components/forms/AssetsAndEquipmentAssigned";
import { DutyCoverageAreaGrid } from "../components/forms/DutyCoverageAreaGrid";

// ✅ Ordered according to renderStepContent
const steps = [
  { label: "Personal Information", icon: <FaUserAlt size={22} /> },
  { label: "System Access & Role", icon: <RiSettings4Line size={22} /> },
  { label: "Contact Information", icon: <MdContactMail size={22} /> },
  { label: "Employment Details", icon: <MdOutlineWork size={22} /> },
  { label: "Referral Information", icon: <AiOutlineIdcard size={22} /> },
  { label: "Documents Upload", icon: <HiOutlineDocumentDuplicate size={22} /> },
  { label: "Salary & Benefits", icon: <MdOutlineAttachMoney size={22} /> },
  { label: "Attendance & Duty Info", icon: <FaRegCalendarCheck size={22} /> },
  { label: "Duty Coverage Area", icon: <FaMapMarkedAlt size={22} /> },
  { label: "Additional Notes", icon: <IoMdClipboard size={22} /> },
  { label: "Assets & Equipment Assigned", icon: <GiLaptop size={22} /> },
];

const CreateUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateFormData,
    validateRequiredFields,
  } = useFormContext();
  const [image, setImage] = useState<string | null>(null);

  const handleNext = async () => {
    setError(null);

    // If it's the first step, validate required fields and submit
    if (currentStep === 0) {
      const validation = validateRequiredFields();
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      setIsLoading(true);
      try {
        const userResponse = await usersService.createUser({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          status: formData.status,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fathersName: formData.fathersName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationalId: formData.nationalId,
          maritalStatus: formData.maritalStatus,
          profilePictureAssetId: formData.profilePictureAssetId,
        });

        updateFormData("userId", userResponse.id);
        setSuccess(true);
        setCurrentStep(1);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to create user");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If it's the second step, create staff
    if (currentStep === 1) {
      if (!formData.userId) {
        setError("User ID is missing. Please go back and create user first.");
        return;
      }

      setIsLoading(true);
      try {
        await staffService.createStaff({
          userId: formData.userId,
          userRole: formData.userRole,
          accessLevel: formData.accessLevel,
          accessExpiry: formData.accessExpiry,
          branchAssignment: formData.branchAssignment,
          twoFactorAuth: formData.twoFactorAuth,
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to assign staff role"
        );
      } finally {
        setIsLoading(false);
      }
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
        return <SystemAccessRole />;
      case 2:
        return <ContactInformation />;
      case 3:
        return <EmploymentDetails />;
      case 4:
        return <ReferralInformation />;
      case 5:
        return <DocumentsUpload />;
      case 6:
        return <SalaryBenefits />;
      case 7:
        return <AttendanceDutyInfo />;
      case 8:
        return <DutyCoverageAreaGrid />;
      case 9:
        return <AdditionalNotes />;
      case 10:
        return <AssetsAndEquipmentAssigned />;
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
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Next"}
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
