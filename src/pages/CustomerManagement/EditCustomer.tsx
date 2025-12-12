import { useState, useEffect, useRef } from "react";
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
import {
  useCustomerForm,
  CustomerFormProvider,
} from "../../contexts/CustomerFormContext";
import { customerService } from "../../services/api";
import { LuUserRoundPen, LuUserCheck, LuMapPin, LuLink } from "react-icons/lu";

// Import form components
import { DomesticStep1BasicProfile } from "../../components/customer-forms/DomesticStep1BasicProfile";
import { DomesticStep2PersonalInfo } from "../../components/customer-forms/DomesticStep2PersonalInfo";
import type { DomesticStep3BuildingAccessHandle } from "../../components/customer-forms/DomesticStep3BuildingAccess";
import { DomesticStep3BuildingAccess } from "../../components/customer-forms/DomesticStep3BuildingAccess";
import { DomesticStep4Addresses } from "../../components/customer-forms/DomesticStep4Addresses";
import type { DomesticStep5PreferencesHandle } from "../../components/customer-forms/DomesticStep5Preferences";
import { DomesticStep5Preferences } from "../../components/customer-forms/DomesticStep5Preferences";
import { DomesticStep6LinkedAccounts } from "../../components/customer-forms/DomesticStep6LinkedAccounts";

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
];

const businessSteps = [
  { label: "Business Details", icon: <LuUserRoundPen size={22} /> },
  { label: "Contact Person", icon: <LuUserCheck size={22} /> },
  { label: "Building Access", icon: <LuMapPin size={22} /> },
  { label: "Addresses", icon: <LuMapPin size={22} /> },
  { label: "Preferences", icon: <LuUserRoundPen size={22} /> },
  { label: "Linked Accounts", icon: <LuLink size={22} /> },
];

const EditCustomerFormContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const {
    state,
    setCurrentStep,
    setFieldErrors,
    setCustomerType,
    resetForm,
    updateFormData,
  } = useCustomerForm();

  // Refs for manual form submission
  const buildingAccessRef = useRef<DomesticStep3BuildingAccessHandle>(null);
  const preferencesRef = useRef<DomesticStep5PreferencesHandle>(null);

  const steps =
    state.customerType === "Business Customer" ? businessSteps : domesticSteps;

  // Load customer data on mount
  useEffect(() => {
    const loadCustomerData = async () => {
      if (!id) {
        setError("Customer ID not found");
        return;
      }

      try {
        setIsLoadingData(true);
        const customerData = await customerService.getCustomerById(id);

        // Store customer ID in state
        setCustomerId(customerData.id);
        
        // Set profile picture URL from API response if available
        if (customerData.profilePictureAsset?.fileUrl) {
          setImage(customerData.profilePictureAsset.fileUrl);
        }

        // Populate form with customer data
        resetForm();
        setCustomerType(
          customerData.customerType || "Domestic Customer"
        );

        // Set all fields in form using updateFormData
        updateFormData('customerId', customerData.id);
        updateFormData('customerType', customerData.customerType || 'Domestic Customer');
        updateFormData('title', customerData.title || 'Mr.');
        updateFormData('firstName', customerData.firstName || '');
        updateFormData('lastName', customerData.lastName || '');
        updateFormData('email', customerData.email || '');
        updateFormData('mobileNumber', customerData.phone || '');
        updateFormData('username', customerData.username || '');
        updateFormData('profilePictureAssetId', customerData.profilePictureAssetId || '');

        // Personal Information (from additionalPersonalInfo nested object)
        const additionalInfo = customerData.additionalPersonalInfo || {};
        updateFormData('fatherHusbandName', additionalInfo.fathersName || '');
        updateFormData('motherName', additionalInfo.mothersName || '');
        updateFormData('dateOfBirth', additionalInfo.dateOfBirth || '');
        updateFormData('cnicNumber', additionalInfo.nationalId || '');
        updateFormData('nationality', additionalInfo.nationality || '');
        updateFormData('gender', additionalInfo.gender || '');
        updateFormData('maritalStatus', additionalInfo.maritalStatus || '');
        updateFormData('alternateContactNumber', additionalInfo.alternateContactNumber || '');
        updateFormData('emergencyContactName', additionalInfo.emergencyContactName || '');
        updateFormData('emergencyContactRelation', additionalInfo.emergencyContactRelation || '');
        updateFormData('emergencyContactNumber', additionalInfo.emergencyContactNumber || '');
        updateFormData('alternateEmergencyContact', additionalInfo.alternateEmergencyContact || '');
        updateFormData('presentAddress', additionalInfo.presentAddress || '');
        updateFormData('permanentAddress', additionalInfo.permanentAddress || '');

        // Building Access Info (from buildingInfo nested object)
        const buildingInfo = customerData.buildingInfo || {};
        updateFormData('buildingAccessInfo.mapLocation', buildingInfo.mapLocation || '');
        updateFormData('buildingAccessInfo.ownershipStatus', buildingInfo.ownership || '');
        updateFormData('buildingAccessInfo.deliveryAccessLevel', buildingInfo.accessLevel || '');
        updateFormData('buildingAccessInfo.floorPosition', buildingInfo.floorPosition || '');
        updateFormData('buildingAccessInfo.basementPosition', buildingInfo.basementPosition || '');
        updateFormData('buildingAccessInfo.liftServiceStartTime', buildingInfo.liftStartTime || '');
        updateFormData('buildingAccessInfo.liftServiceCloseTime', buildingInfo.liftEndTime || '');

        // Preferences (from preferences nested object)
        const preferences = customerData.preferences || {};
        updateFormData('preferences.preferredDeliveryTime', preferences.preferredDeliveryTime || '');
        updateFormData('preferences.deliveryFrequency', preferences.deliveryFrequency || '');
        updateFormData('preferences.bottleHandlingPreference', preferences.bottleHandling || '');
        updateFormData('preferences.billingOption', preferences.billingOption || '');
        updateFormData('preferences.paymentMode', preferences.paymentMode || '');
        updateFormData('preferences.monthlyConsumption', preferences.expectedConsumption || '');
        updateFormData('preferences.securitySummary', preferences.securitySummary || '');
        updateFormData('preferences.additionalRequests', preferences.additionalRequests || '');
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load customer data");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleNext = async () => {
    setError(null);
    setSuccess(false);

    // Step 0 (Basic Profile): Update customer basic profile via PATCH
    if (state.currentStep === 0) {
      // Validate only step 0 fields
      const fieldErrorsMap: Record<string, string> = {};

      if (!state.data?.firstName || !state.data.firstName.trim()) {
        fieldErrorsMap['firstName'] = 'First Name is required';
      }

      if (!state.data?.lastName || !state.data.lastName.trim()) {
        fieldErrorsMap['lastName'] = 'Last Name is required';
      }

      if (Object.keys(fieldErrorsMap).length > 0) {
        setFieldErrors(fieldErrorsMap);
        setError(Object.values(fieldErrorsMap)[0] || "Please fill in all required fields");
        return;
      }

      try {
        setIsLoading(true);
        if (!customerId) {
          setError("Customer ID not found");
          setIsLoading(false);
          return;
        }

        await customerService.updateCustomerBasicProfile(
          customerId,
          {
            title: state.data?.title,
            firstName: state.data?.firstName,
            lastName: state.data?.lastName,
            profilePictureAssetId: state.data?.profilePictureAssetId,
          }
        );

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(1);
        return;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update customer");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 1 (Personal Information): Update customer additional info
    if (state.currentStep === 1) {
      const data = state.data as any;
      const fieldErrorsMap: Record<string, string> = {};

      // Validate dateOfBirth on the frontend
      if (!data.dateOfBirth || !data.dateOfBirth.toString().trim()) {
        fieldErrorsMap["dateOfBirth"] = "Date of Birth is required";
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.dateOfBirth)) {
          fieldErrorsMap["dateOfBirth"] =
            "Date of Birth must be in YYYY-MM-DD format";
        }
      }

      if (!data.gender || !data.gender.trim()) {
        fieldErrorsMap["gender"] = "Gender is required";
      }

      if (!data.maritalStatus || !data.maritalStatus.trim()) {
        fieldErrorsMap["maritalStatus"] = "Marital Status is required";
      }

      // If there are any field errors, show them and don't proceed
      if (Object.keys(fieldErrorsMap).length > 0) {
        setFieldErrors(fieldErrorsMap);
        setError(Object.values(fieldErrorsMap)[0] || "Please fill in all required fields");
        return;
      }

      try {
        setIsLoading(true);
        if (!customerId) {
          setError("Customer ID not found");
          setIsLoading(false);
          return;
        }

        await customerService.updateAdditionalPersonalInfo(
          customerId,
          {
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
          }
        );

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
        if (!customerId) {
          setError("Customer ID not found");
          setIsLoading(false);
          return;
        }

        // Call the API directly to update building info
        await customerService.updateBuildingInfo(
          customerId,
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

    // Step 3 (Addresses): Submit and move to next step
    if (state.currentStep === 3) {
      try {
        setIsLoading(true);
        // Addresses are handled via the component's form ref
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
        if (!customerId) {
          setError("Customer ID not found");
          setIsLoading(false);
          return;
        }

        // Call the API directly to update preferences
        await customerService.updatePreferences(
          customerId,
          {
            preferredDeliveryTime: data.preferences?.preferredDeliveryTime || "",
            deliveryFrequency: data.preferences?.deliveryFrequency || "",
            bottleHandling: data.preferences?.bottleHandlingPreference || "",
            billingOption: data.preferences?.billingOption || "",
            paymentMode: data.preferences?.paymentMode || "",
            expectedConsumption: data.preferences?.monthlyConsumption || "",
            securitySummary: data.preferences?.securitySummary || "",
            additionalRequests: data.preferences?.additionalRequests || "",
          }
        );

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setCurrentStep(5);
        return;
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to save preferences"
        );
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Step 5 (Linked Accounts): Submit and complete
    if (state.currentStep === 5) {
      try {
        setIsLoading(true);
        // Linked accounts are handled via the component's internal logic
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
  };

  const handleBack = () => {
    setCurrentStep(Math.max(state.currentStep - 1, 0));
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
          <DomesticStep1BasicProfile
            image={image}
            onImageUpload={handleImageUpload}
            onImageReset={() => setImage(null)}
            isEditMode={true}
          />
        );
      case 1:
        return <DomesticStep2PersonalInfo />;
      case 2:
        return <DomesticStep3BuildingAccess ref={buildingAccessRef} />;
      case 3:
        return <DomesticStep4Addresses />;
      case 4:
        return <DomesticStep5Preferences ref={preferencesRef} />;
      case 5:
        return <DomesticStep6LinkedAccounts />;
      default:
        return (
          <DomesticStep1BasicProfile
            image={image}
            onImageUpload={handleImageUpload}
            onImageReset={() => setImage(null)}
            isEditMode={true}
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
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Edit Customer
        </Typography>
        <Stepper
          activeStep={state.currentStep}
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
                      fontWeight:
                        index === state.currentStep ? 600 : 400,
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
        <Card sx={{ p: 3, height: "100%", boxShadow: "none" }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {steps[state.currentStep].icon}
              <Typography variant="h6" sx={{ my: 1 }}>
                {steps[state.currentStep].label}
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
            {renderStepContent(state.currentStep)}
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
              disabled={state.currentStep === 0 || isLoading}
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
              {isLoading ? "Processing..." : state.currentStep === steps.length - 1
                ? "Complete & Save"
                : "Next"}
            </PrimaryButton>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export const EditCustomer = () => {
  return (
    <CustomerFormProvider>
      <EditCustomerFormContent />
    </CustomerFormProvider>
  );
};
