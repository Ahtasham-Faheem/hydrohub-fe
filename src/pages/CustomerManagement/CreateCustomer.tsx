import { useState, useEffect, useRef } from "react";
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
  Stack,
  CircularProgress,
} from "@mui/material";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { useCustomerForm, CustomerFormProvider } from "../../contexts/CustomerFormContext";
import { validatePasswordMatch } from "../../utils/validationUtils";
import {
  LuUserRoundPen,
  LuUserCheck,
  LuMapPin,
  LuLink,
} from "react-icons/lu";
import { customerService } from "../../services/api";

// Import form components
import { DomesticStep1BasicProfile } from "../../components/customer-forms/DomesticStep1BasicProfile";
import { DomesticStep2PersonalInfo } from "../../components/customer-forms/DomesticStep2PersonalInfo";
import type { DomesticStep3BuildingAccessHandle } from "../../components/customer-forms/DomesticStep3BuildingAccess";
import { DomesticStep3BuildingAccess } from "../../components/customer-forms/DomesticStep3BuildingAccess";
import { DomesticStep4Addresses } from "../../components/customer-forms/DomesticStep4Addresses";
import type { DomesticStep5PreferencesHandle } from "../../components/customer-forms/DomesticStep5Preferences";
import { DomesticStep5Preferences } from "../../components/customer-forms/DomesticStep5Preferences";
import { DomesticStep6LinkedAccounts } from "../../components/customer-forms/DomesticStep6LinkedAccounts";
import { useCreateCustomer } from "../../hooks/useCreateCustomer";

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
  // { label: "Referral", icon: <LuUserPlus size={22} /> },
  // { label: "Security", icon: <LuShield size={22} /> },
  // { label: "Additional Notes", icon: <LuFileText size={22} /> },
];

const businessSteps = [
  { label: "Business Details", icon: <LuUserRoundPen size={22} /> },
  { label: "Contact Person", icon: <LuUserCheck size={22} /> },
  { label: "Building Access", icon: <LuMapPin size={22} /> },
  { label: "Addresses", icon: <LuMapPin size={22} /> },
  { label: "Preferences", icon: <LuUserRoundPen size={22} /> },
  { label: "Linked Accounts", icon: <LuLink size={22} /> },
  // { label: "Referral", icon: <LuUserPlus size={22} /> },
  // { label: "Security", icon: <LuShield size={22} /> },
  // { label: "Additional Notes", icon: <LuFileText size={22} /> },
];

const CreateCustomerFormContent = () => {
  const [error, setError] = useState<string | null>(null);
  const [customerProfileId, setCustomerProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state, setCurrentStep, validateRequiredFields, setCustomerType, resetForm } =
    useCustomerForm();
  const navigate = useNavigate();

  // Refs for manual form submission
  const buildingAccessRef = useRef<DomesticStep3BuildingAccessHandle>(null);
  const preferencesRef = useRef<DomesticStep5PreferencesHandle>(null);

  const createCustomerMutation = useCreateCustomer();

  // Initialize customer type on mount
  useEffect(() => {
    if (!state.data) {
      setCustomerType('Domestic Customer');
    }
  }, []);

  const steps =
    state.customerType === "Business Customer" ? businessSteps : domesticSteps;

  const handleNext = async () => {
    setError(null);

    // Step 0 (Basic Profile): Create customer with /customers API
    if (state.currentStep === 0 && !customerProfileId) {
      const validation = validateRequiredFields();
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      const data = state.data as any;

      // Validate password confirmation
      const passwordValidation = validatePasswordMatch(data.password, data.confirmPassword || '');
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error || 'Password validation failed');
        return;
      }

      try {
        setIsLoading(true);
        const newCustomer = await createCustomerMutation.mutateAsync({
          email: data.email,
          phone: data.mobileNumber,
          username: data.username,
          password: data.password,
          customerType: (data.customerType || "Domestic Customer") as 'Domestic Customer' | 'Business Customer' | 'Commercial Customer',
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
          profilePictureAssetId: data.profilePictureAssetId || "",
        });

        setCustomerProfileId(newCustomer.id);
        setCurrentStep(1);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create customer');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 1 (Additional Personal Info): Update customer additional info
    if (state.currentStep === 1 && customerProfileId) {
      const data = state.data as any;

      try {
        setIsLoading(true);
        await customerService.updateAdditionalPersonalInfo(customerProfileId, {
          fathersName: data.fatherHusbandName || "",
          mothersName: data.motherName || "",
          dateOfBirth: data.dateOfBirth || "",
          nationality: data.nationality || "",
          nationalId: data.cnicNumber || "",
          gender: data.gender || "",
          maritalStatus: data.maritalStatus || "",
          alternateContactNumber: data.alternateContactNumber || "",
          secondaryEmailAddress: data.email || "",
          presentAddress: data.presentAddress || "",
          permanentAddress: data.permanentAddress || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactRelation: data.emergencyContactRelation || "",
          emergencyContactNumber: data.emergencyContactNumber || "",
          alternateEmergencyContact: data.alternateEmergencyContact || "",
        });

        setCurrentStep(2);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save personal information');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 2 (Building Access): Submit and move to next step
    if (state.currentStep === 2) {
      try {
        setIsLoading(true);
        await buildingAccessRef.current?.submit();
        setCurrentStep(3);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save building access information');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 4 (Preferences): Submit and move to next step
    if (state.currentStep === 4) {
      try {
        setIsLoading(true);
        await preferencesRef.current?.submit();
        setCurrentStep(5);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save preferences');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Check if on last step (Linked Accounts - step 5) and redirect after completion
    if (state.currentStep === 5) {
      resetForm();
      navigate('/dashboard/customer-profiles');
      return;
    }

    // Regular step navigation (for other steps)
    setCurrentStep(Math.min(state.currentStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(state.currentStep - 1, 0));
  };

  const renderStepContent = (step: number) => {
      switch (step) {
        case 0:
          return <DomesticStep1BasicProfile />;
        case 1:
          return <DomesticStep2PersonalInfo />;
        case 2:
          return <DomesticStep3BuildingAccess ref={buildingAccessRef} customerProfileId={customerProfileId || undefined} />;
        case 3:
          return <DomesticStep4Addresses customerProfileId={customerProfileId || undefined} />;
        case 4:
          return <DomesticStep5Preferences ref={preferencesRef} customerProfileId={customerProfileId || undefined} />;
        case 5:
          return <DomesticStep6LinkedAccounts customerProfileId={customerProfileId || undefined} />;
        // case 6:
        //   return <DomesticStep7Referral />;
        // case 7:
        //   return <DomesticStep8Security />;
        // case 8:
        //   return <DomesticStep9AdditionalNotes />;
        default:
          return (
            <Box sx={{ py: 2 }}>
              <Typography>Coming soon...</Typography>
            </Box>
          );
      }
  };

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
        <Typography variant="h6" sx={{ mb: 3 }}>
          Create Customer
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
            {renderStepContent(state.currentStep)}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 4, justifyContent: "space-between", position: "relative" }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 1,
                  zIndex: 10,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={state.currentStep === 0 || isLoading}
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
              {state.currentStep === steps.length - 1
                ? "Complete & Create Customer"
                : "Next"}
            </PrimaryButton>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};

export const CreateCustomer = () => {
  return (
    <CustomerFormProvider>
      <CreateCustomerFormContent />
    </CustomerFormProvider>
  );
};
