import { Box, Typography, IconButton } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { PhoneInput } from "../common/PhoneInput";
import { ProfilePhotoUpload } from "../common/ProfilePhotoUpload";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import type { DomesticCustomer } from "../../types/customer";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface DomesticStep1BasicProfileProps {
  isEditMode?: boolean;
}

export const DomesticStep1BasicProfile = ({
  isEditMode = false,
}: DomesticStep1BasicProfileProps = {}) => {
  const { state, fieldErrors, setFieldErrors, updateFormData } = useCustomerForm();
  
  // Handle null state.data with default empty values
  const data = (state.data as DomesticCustomer) || {
    customerType: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    title: 'Mr.',
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneChange = (value: string) => {
    updateFormData("mobileNumber", value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Profile Photo Upload */}
      <ProfilePhotoUpload
        value={data.profilePictureAssetId}
        onChange={(assetId) => updateFormData("profilePictureAssetId", assetId)}
        onClearError={() => setFieldErrors({ ...fieldErrors, profilePictureAssetId: "" })}
        error={fieldErrors['profilePictureAssetId']}
        disabled={isEditMode}
      />

      {/* Basic Information */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: "#374151" }}
        >
          Basic Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Customer Type Display */}
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: 1, border: '1px solid #bfdbfe' }}>
            <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600 }}>
              Customer Type: {data.customerType || 'Not Selected'}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr 2fr" },
              gap: 2,
            }}
          >
            <CustomSelect
              label="Title"
              value={data.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, title: "" })}
              error={fieldErrors['title']}
              options={[
                { label: "Mr", value: "Mr." },
                { label: "Mrs", value: "Mrs." },
                { label: "Ms", value: "Ms." },
                { label: "Miss", value: "Miss." },
                { label: "Mx", value: "Mx." },
              ]}
            />
            <CustomInput
              label="First Name *"
              placeholder="Enter first name"
              value={data.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, firstName: "" })}
              error={fieldErrors['firstName']}
            />
            <CustomInput
              label="Last Name *"
              placeholder="Enter last name"
              value={data.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, lastName: "" })}
              error={fieldErrors['lastName']}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={data.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, email: "" })}
              error={fieldErrors['email']}
              disabled={isEditMode}
            />
            <PhoneInput
              label="Phone Number"
              value={data.mobileNumber}
              onChange={handlePhoneChange}
              onClearError={() => setFieldErrors({ ...fieldErrors, mobileNumber: "" })}
              error={fieldErrors['mobileNumber']}
              disabled={isEditMode}
              required
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Username *"
              placeholder="Enter username"
              value={data.username}
              onChange={(e) => updateFormData("username", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, username: "" })}
              error={fieldErrors['username']}
              disabled={isEditMode}
            />
            {!isEditMode && (
            <CustomInput
              label="Password *"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, password: "" })}
              error={fieldErrors['password']}
              endAdornment={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ mr: -1 }}
                  size="small"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              }
            />
            )}
          </Box>

          {!isEditMode && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Confirm Password *"
              placeholder="Re-enter password"
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword || ""}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, confirmPassword: "" })}
              error={fieldErrors['confirmPassword']}
              endAdornment={
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ mr: -1 }}
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              }
            />
          </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
