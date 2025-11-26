import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Card,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import { PrimaryButton } from "../../components/PrimaryButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import { MdExpandMore } from "react-icons/md";
import {
  LuUserRoundPen,
  LuUserCheck,
  LuMapPin,
  LuLink,
  LuUserPlus,
  LuShield,
  LuFileText,
} from "react-icons/lu";

// Import form components
import { DomesticStep1BasicProfile } from "../../components/customer-forms/DomesticStep1BasicProfile";
import { DomesticStep2PersonalInfo } from "../../components/customer-forms/DomesticStep2PersonalInfo";
import { DomesticStep3BuildingAccess } from "../../components/customer-forms/DomesticStep3BuildingAccess";
import { DomesticStep4Addresses } from "../../components/customer-forms/DomesticStep4Addresses";
import { DomesticStep5Preferences } from "../../components/customer-forms/DomesticStep5Preferences";
import { DomesticStep6LinkedAccounts } from "../../components/customer-forms/DomesticStep6LinkedAccounts";
import { DomesticStep7Referral } from "../../components/customer-forms/DomesticStep7Referral";
import { DomesticStep8Security } from "../../components/customer-forms/DomesticStep8Security";
import { DomesticStep9AdditionalNotes } from "../../components/customer-forms/DomesticStep9AdditionalNotes";

// Custom Step Icon Component
const CustomStepIcon = ({ active }: { active: boolean }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      borderRadius: "50%",
      bgcolor: active ? "var(--color-primary-600)" : "#e5e7eb",
      color: "white",
    }}
  >
    <FaCircle size={12} style={{ color: "white" }} />
  </Box>
);

const domesticSteps = [
  { label: "Basic Profile", icon: <LuUserRoundPen size={22} /> },
  { label: "Personal Information", icon: <LuUserCheck size={22} /> },
  { label: "Building Access", icon: <LuMapPin size={22} /> },
  { label: "Addresses", icon: <LuMapPin size={22} /> },
  { label: "Preferences", icon: <LuUserRoundPen size={22} /> },
  { label: "Linked Accounts", icon: <LuLink size={22} /> },
  { label: "Referral", icon: <LuUserPlus size={22} /> },
  { label: "Security", icon: <LuShield size={22} /> },
  { label: "Additional Notes", icon: <LuFileText size={22} /> },
];

const businessSteps = [
  { label: "Business Details", icon: <LuUserRoundPen size={22} /> },
  { label: "Contact Person", icon: <LuUserCheck size={22} /> },
  { label: "Building Access", icon: <LuMapPin size={22} /> },
  { label: "Addresses", icon: <LuMapPin size={22} /> },
  { label: "Preferences", icon: <LuUserRoundPen size={22} /> },
  { label: "Linked Accounts", icon: <LuLink size={22} /> },
  { label: "Referral", icon: <LuUserPlus size={22} /> },
  { label: "Security", icon: <LuShield size={22} /> },
  { label: "Additional Notes", icon: <LuFileText size={22} /> },
];

const CreateCustomerFormContent = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { state, setCurrentStep, validateRequiredFields, setCustomerType } =
    useCustomerForm();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize customer type based on route
  useEffect(() => {
    if (!isInitialized && !state.customerType) {
      const pathname = location.pathname;
      if (pathname.includes("/domestic")) {
        setCustomerType("domestic");
        setIsInitialized(true);
      } else if (pathname.includes("/business")) {
        setCustomerType("business");
        setIsInitialized(true);
      } else if (pathname.includes("/commercial")) {
        setCustomerType("commercial");
        setIsInitialized(true);
      }
    }
  }, []);

  const steps =
    state.customerType === "business" ? businessSteps : domesticSteps;

  const handleNext = async () => {
    setError(null);

    if (state.currentStep === steps.length - 1) {
      // Final submission
      const validation = validateRequiredFields();
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      // TODO: Submit customer data
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Redirect to customer profiles
      }, 2000);
      return;
    }

    setCurrentStep(Math.min(state.currentStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(state.currentStep - 1, 0));
  };

  const renderStepContent = (step: number) => {
    if (state.customerType === "domestic") {
      switch (step) {
        case 0:
          return <DomesticStep1BasicProfile />;
        case 1:
          return <DomesticStep2PersonalInfo />;
        case 2:
          return <DomesticStep3BuildingAccess />;
        case 3:
          return <DomesticStep4Addresses />;
        case 4:
          return <DomesticStep5Preferences />;
        case 5:
          return <DomesticStep6LinkedAccounts />;
        case 6:
          return <DomesticStep7Referral />;
        case 7:
          return <DomesticStep8Security />;
        case 8:
          return <DomesticStep9AdditionalNotes />;
        default:
          return (
            <Box sx={{ py: 2 }}>
              <Typography>Coming soon...</Typography>
            </Box>
          );
      }
    } else if (state.customerType === "business") {
      return (
        <Box sx={{ py: 2 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<MdExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[step]?.label || "Form Section"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 3 }}>
              <Typography>Business customer form coming soon...</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    }
    return null;
  };

  if (!state.customerType) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <Typography variant="h6" sx={{ color: "#999" }}>
          Initializing form...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: "white",
          p: 3,
          pr: 0,
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, textTransform: "capitalize" }}>
          {state.customerType} Customer
        </Typography>
        <Stepper
          activeStep={state.currentStep}
          orientation="vertical"
          sx={{
            "& .MuiStepLabel-root": { py: 1 },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon active={index === state.currentStep} />
                )}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      color:
                        index === state.currentStep
                          ? "var(--color-primary-600)"
                          : "inherit",
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        index === state.currentStep
                          ? "var(--color-primary-600)"
                          : "inherit",
                      fontWeight: index === state.currentStep ? 600 : 400,
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
        <Card sx={{ p: 4, height: "100%", boxShadow: "none" }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {steps[state.currentStep].icon}
              <Typography variant="h5" sx={{ my: 1, fontWeight: 600 }}>
                {steps[state.currentStep].label}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{ height: "60vh", pr: 2, pt: 1, overflowY: "auto" }}
            className="noScrollbar"
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Customer created successfully!
              </Alert>
            )}
            {renderStepContent(state.currentStep)}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 4, justifyContent: "space-between" }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={state.currentStep === 0}
              startIcon={<BsArrowLeft />}
              sx={{ px: 4 }}
            >
              Previous
            </Button>
            <PrimaryButton endIcon={<BsArrowRight />} onClick={handleNext}>
              {state.currentStep === steps.length - 1
                ? "Create Customer"
                : "Next"}
            </PrimaryButton>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};

export const CreateCustomer = () => {
  return <CreateCustomerFormContent />;
};
