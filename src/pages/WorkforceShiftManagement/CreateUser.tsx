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
} from "@mui/material";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { FormProvider, useFormContext } from "../../contexts/FormContext";
import { staffService } from "../../services/api";
import { validatePasswordMatch } from "../../utils/validationUtils";

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
  const {
    formData,
    currentStep,
    setCurrentStep,
    validateRequiredFields,
    resetForm,
  } = useFormContext();
  const navigate = useNavigate();

  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Step 0: Create staff member via /staff API
      if (currentStep === 0) {
        const validation = validateRequiredFields();
        if (!validation.isValid) {
          setError(validation.errors.join(", "));
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

        setSuccess(true);
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
        return <AdditionalPersonalInfo />;
      case 2:
        return <EmploymentDetails />;
      case 3:
        return <SalaryBenefits />;
      case 4:
        return <IdentificationVerification />;
      // case 5:
      //   return <AttendanceDutyInfo />;
      // case 6:
      //   return <AssetsAndEquipmentAssigned />;
      case 5:
        return <DocumentsUpload />;
      // case 8:
      //   return <AdditionalNotes />;
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
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon active={index === currentStep} />
                )}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      color:
                        index === currentStep
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
                        index === currentStep
                          ? "var(--color-primary-600)"
                          : "inherit",
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
              {currentStep === steps.length - 1
                ? "Complete & Create User"
                : isLoading
                ? "Processing..."
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
