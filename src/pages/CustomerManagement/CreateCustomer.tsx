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
import {
  useCustomerForm,
  CustomerFormProvider,
} from "../../contexts/CustomerFormContext";
import { validatePasswordMatch } from "../../utils/validationUtils";
import { LuUserRoundPen, LuUserCheck, LuMapPin, LuLink } from "react-icons/lu";
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
  const [success, setSuccess] = useState(false);
  const [customerProfileId, setCustomerProfileId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const {
    state,
    setCurrentStep,
    setFieldErrors,
    validateRequiredFields,
    setCustomerType,
    resetForm,
  } = useCustomerForm();
  const navigate = useNavigate();

  // Refs for manual form submission
  const buildingAccessRef = useRef<DomesticStep3BuildingAccessHandle>(null);
  const preferencesRef = useRef<DomesticStep5PreferencesHandle>(null);

  const createCustomerMutation = useCreateCustomer();

  // Initialize customer type on mount - always reset form when component mounts
  useEffect(() => {
    resetForm();
    setCustomerType("Domestic Customer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps =
    state.customerType === "Business Customer" ? businessSteps : domesticSteps;

  const handleNext = async () => {
    setError(null);

    // Step 0 (Basic Profile): Create customer with /customers API
    if (state.currentStep === 0 && !customerProfileId) {
      const validation = validateRequiredFields();
      if (!validation.isValid) {
        setFieldErrors(validation.fieldErrors);
        setError(validation.errors[0] || 'Please fill in all required fields');
        return;
      }

      const data = state.data as any;

      // Validate password confirmation
      const passwordValidation = validatePasswordMatch(
        data.password,
        data.confirmPassword || ""
      );
      if (!passwordValidation.isValid) {
        setFieldErrors({
          confirmPassword:
            passwordValidation.error || "Password validation failed",
        });
        setError(passwordValidation.error || "Password validation failed");
        return;
      }

      try {
        setIsLoading(true);
        const newCustomer = await createCustomerMutation.mutateAsync({
          email: data.email,
          phone: data.mobileNumber,
          username: data.username,
          password: data.password,
          customerType: (data.customerType || "Domestic Customer") as
            | "Domestic Customer"
            | "Business Customer"
            | "Commercial Customer",
          title: data.title,
          firstName: data.firstName,
          lastName: data.lastName,
          profilePictureAssetId: data.profilePictureAssetId || "",
        });

        setCustomerProfileId(newCustomer.id);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(1);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create customer");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 1 (Additional Personal Info): Update customer additional info
    if (state.currentStep === 1 && customerProfileId) {
      const data = state.data as any;
      const fieldErrorsMap: Record<string, string> = {};

      // Validate dateOfBirth on the frontend
      if (!data.dateOfBirth || !data.dateOfBirth.toString().trim()) {
        fieldErrorsMap['dateOfBirth'] = 'Date of Birth is required';
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.dateOfBirth)) {
          fieldErrorsMap['dateOfBirth'] = 'Date of Birth must be in YYYY-MM-DD format';
        }
      }

      if (!data.gender || !data.gender.trim()) {
        fieldErrorsMap['gender'] = 'Gender is required';
      }

      if (!data.maritalStatus || !data.maritalStatus.trim()) {
        fieldErrorsMap['maritalStatus'] = 'Marital Status is required';
      }

      // If there are any field errors, show them and don't proceed
      if (Object.keys(fieldErrorsMap).length > 0) {
        setFieldErrors(fieldErrorsMap);
        setError(Object.values(fieldErrorsMap)[0] || 'Please fill in all required fields');
        return;
      }

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

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(2);
        return;
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to save personal information"
        );
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 2 (Building Access): Submit and move to next step
    if (state.currentStep === 2) {
      const data = state.data as any;
      const fieldErrorsMap: Record<string, string> = {};

      // Validate building access required fields
      if (!data.buildingAccessInfo?.ownershipStatus || !data.buildingAccessInfo.ownershipStatus.trim()) {
        fieldErrorsMap['ownershipStatus'] = 'Ownership Status is required';
      }

      if (!data.buildingAccessInfo?.deliveryAccessLevel || !data.buildingAccessInfo.deliveryAccessLevel.trim()) {
        fieldErrorsMap['deliveryAccessLevel'] = 'Delivery Access Level is required';
      }

      // If there are any field errors, show them and don't proceed
      if (Object.keys(fieldErrorsMap).length > 0) {
        setFieldErrors(fieldErrorsMap);
        setError(Object.values(fieldErrorsMap)[0] || "Please fill in all required fields");
        return;
      }

      try {
        setIsLoading(true);
        if (!customerProfileId) {
          setError("Customer ID not found");
          setIsLoading(false);
          return;
        }

        // Call the API directly to update building info
        await customerService.updateBuildingInfo(
          customerProfileId,
          {
            mapLocation: data.buildingAccessInfo?.mapLocation || "",
            ownership: data.buildingAccessInfo?.ownershipStatus || "",
            accessLevel: data.buildingAccessInfo?.deliveryAccessLevel || "",
            floorPosition: data.buildingAccessInfo?.floorPosition || "",
            basementPosition: data.buildingAccessInfo?.basementPosition || "",
            liftStartTime: data.buildingAccessInfo?.liftServiceStartTime || "",
            liftEndTime: data.buildingAccessInfo?.liftServiceCloseTime || "",
            accessNotes: data.buildingAccessInfo?.accessNotes || "",
          }
        );

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(3);
        return;
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to save building access information"
        );
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 3 (Addresses): Move to next step
    if (state.currentStep === 3) {
      try {
        setIsLoading(true);
        // Addresses are handled via the component's internal API calls
        // Just move forward to the next step
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(4);
        return;
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to save addresses"
        );
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 4 (Preferences): Submit and move to next step
    if (state.currentStep === 4) {
      const data = state.data as any;
      const fieldErrorsMap: Record<string, string> = {};

      // Validate preferences required fields
      if (!data.preferences?.preferredDeliveryTime || !data.preferences.preferredDeliveryTime.trim()) {
        fieldErrorsMap['preferredDeliveryTime'] = 'Preferred Delivery Time is required';
      }

      if (!data.preferences?.deliveryFrequency || !data.preferences.deliveryFrequency.trim()) {
        fieldErrorsMap['deliveryFrequency'] = 'Delivery Frequency is required';
      }

      if (!data.preferences?.billingOption || !data.preferences.billingOption.trim()) {
        fieldErrorsMap['billingOption'] = 'Billing Option is required';
      }

      if (!data.preferences?.paymentMode || !data.preferences.paymentMode.trim()) {
        fieldErrorsMap['paymentMode'] = 'Payment Mode is required';
      }

      // If there are any field errors, show them and don't proceed
      if (Object.keys(fieldErrorsMap).length > 0) {
        setFieldErrors(fieldErrorsMap);
        setError(Object.values(fieldErrorsMap)[0] || "Please fill in all required fields");
        return;
      }

      try {
        setIsLoading(true);
        if (!customerProfileId) {
          setError("Customer ID not found");
          setIsLoading(false);
          return;
        }

        // Call the API directly to update preferences
        await customerService.updatePreferences(
          customerProfileId,
          {
            preferredDeliveryTime: data.preferences?.preferredDeliveryTime || "",
            deliveryFrequency: data.preferences?.deliveryFrequency || "",
            bottleHandling: data.preferences?.bottleHandlingPreference || "",
            billingOption: data.preferences?.billingOption || "",
            paymentMode: data.preferences?.paymentMode || "",
            expectedConsumption: data.preferences?.monthlyConsumption || "",
            // securitySummary: data.preferences?.securitySummary || "",
            additionalRequests: data.preferences?.additionalRequests || "",
          }
        );

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(5);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to save preferences");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 5 (Linked Accounts): Submit and complete
    if (state.currentStep === 5) {
      try {
        setIsLoading(true);
        // Linked accounts are handled via the component's internal API calls
        // Just complete the form and navigate back
        resetForm();
        navigate("/dashboard/customer-profiles");
        return;
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to save linked accounts"
        );
        return;
      } finally {
        setIsLoading(false);
      }
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
        return (
          <DomesticStep3BuildingAccess
            ref={buildingAccessRef}
            customerProfileId={customerProfileId || undefined}
          />
        );
      case 3:
        return (
          <DomesticStep4Addresses
            customerProfileId={customerProfileId || undefined}
          />
        );
      case 4:
        return (
          <DomesticStep5Preferences
            ref={preferencesRef}
            customerProfileId={customerProfileId || undefined}
          />
        );
      case 5:
        return (
          <DomesticStep6LinkedAccounts
            customerProfileId={customerProfileId || undefined}
          />
        );
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
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Information saved successfully!
              </Alert>
            )}
            {renderStepContent(state.currentStep)}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 4,
              justifyContent: "space-between",
              position: "relative",
            }}
          >
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
              endIcon={isLoading ? <CircularProgress size={20} sx={{ ml: 1 }} /> : <BsArrowRight />}
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : state.currentStep === steps.length - 1
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
