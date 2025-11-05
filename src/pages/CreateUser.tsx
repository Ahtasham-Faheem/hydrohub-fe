import { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Card,
} from "@mui/material";
import { PrimaryButton } from "../components/PrimaryButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Personal from "../assets/CreateUser/personal.svg";
import Contact from "../assets/CreateUser/contact.svg";
import Employment from "../assets/CreateUser/employment.svg";
import Salary from "../assets/CreateUser/salary.svg";
import Id from "../assets/CreateUser/identification.svg";
import Access from "../assets/CreateUser/system.svg";
import Attendance from "../assets/CreateUser/attandance.svg";
import Assets from "../assets/CreateUser/assets.svg";
import Document from "../assets/CreateUser/document.svg";
import Notes from "../assets/CreateUser/additional.svg";
import { PersonalInformation } from "../components/forms/PersonalInformation";
import { ContactInformation } from "../components/forms/ContactInformation";
import { EmploymentDetails } from "../components/forms/EmploymentDetails";
import { SalaryBenefits } from "../components/forms/SalaryBenefits";
import { IdentificationVerification } from "../components/forms/IdentificationVerification";

const steps = [
  { label: "Personal Information", icon: Personal },
  { label: "Contact Information", icon: Contact },
  { label: "Employment Detail", icon: Employment },
  { label: "Salary & Benefits", icon: Salary },
  { label: "Identification & Verification", icon: Id },
  { label: "System Access & Role", icon: Access },
  { label: "Attendance & Duty Info", icon: Attendance },
  { label: "Assets & Equipment Assigned", icon: Assets },
  { label: "Document", icon: Document },
  { label: "Additional Notes", icon: Notes },
];

export const CreateUser = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
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
      default:
        return <Typography>Step content not implemented yet</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      <Box
        sx={{
          width: 320,
          bgcolor: "white",
          p: 4,
          pr: 0,
          pb: 0,
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          User Creation Form
        </Typography>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            "& .MuiStepLabel-root": {
              py: 1,
            },
            "& .MuiStepLabel-iconContainer": {
              "& .MuiSvgIcon-root": {
                fontSize: 28,
              },
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
                  <img
                    src={step.icon}
                    alt={step.label}
                    width={24}
                    height={24}
                  />
                  <Typography variant="body2">{step.label}</Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ flexGrow: 1, height: "auto" }}>
        <Card sx={{ p: 3, height: "100%", boxShadow: "none" }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={steps[activeStep].icon} alt={steps[activeStep].label} width={24} height={24} />
              <Typography variant="h6" sx={{ my: 2, }}>
                {steps[activeStep].label}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 6 }}>{renderStepContent(activeStep)}</Box>

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
              disabled={activeStep === 0}
              startIcon={<BsArrowLeft />}
              sx={{ px: 4 }}
            >
              Previous
            </Button>
            <PrimaryButton endIcon={<BsArrowRight />} onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </PrimaryButton>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
