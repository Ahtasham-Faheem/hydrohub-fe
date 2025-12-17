import { Stack, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { PhoneInput } from "../common/PhoneInput";
import { ProfilePhotoUpload } from "../common/ProfilePhotoUpload";
import { useFormContext } from "../../contexts/FormContext";
import { useState } from "react";

interface PersonalInformationProps {
  isEditMode?: boolean;
}

export const PersonalInformation = ({
  isEditMode = false,
}: PersonalInformationProps) => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } =
    useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneChange = (value: string) => {
    // PhoneInput component already adds +92 prefix, so just use the value as-is
    updateFormData("phone", value);
  };

  return (
    <Stack spacing={3}>
      {/* Profile Photo Upload */}
      <ProfilePhotoUpload
        value={formData.profilePictureAssetId}
        onChange={(assetId) => updateFormData("profilePictureAssetId", assetId)}
        onClearError={() => setFieldErrors({ ...fieldErrors, profilePictureAssetId: "" })}
        error={fieldErrors["profilePictureAssetId"]}
        disabled={isEditMode}
        maxSize="800KB"
      />

      {/* Employee ID + Employee Creation Date + Title */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Title"
          value={formData.title || ""}
          onChange={(e) => updateFormData("title", e.target.value)}
          error={fieldErrors["title"]}
          options={[
            { value: "Mr", label: "Mr." },
            { value: "Ms", label: "Ms." },
            { value: "Mrs", label: "Mrs." },
            { value: "Dr", label: "Dr." },
          ]}
        />
        <CustomInput
          label="First Name *"
          placeholder="John"
          value={formData.firstName}
          onChange={(e) => updateFormData("firstName", e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, firstName: "" })}
          error={fieldErrors["firstName"]}
        />
        <CustomInput
          label="Last Name *"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) => updateFormData("lastName", e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, lastName: "" })}
          error={fieldErrors["lastName"]}
        />
      </Stack>

      {/* First Name + Last Name + Primary Email Address */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Primary Email Address *"
          placeholder="john.doe@waterinn.com"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, email: "" })}
          error={fieldErrors["email"]}
          disabled={isEditMode}
        />
        <PhoneInput
          label="Phone Number"
          value={formData.phone}
          onChange={handlePhoneChange}
          onClearError={() => setFieldErrors({ ...fieldErrors, phone: "" })}
          error={fieldErrors["phone"]}
          disabled={isEditMode}
          required
        />
        <CustomInput
          label="Login Username *"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => updateFormData("username", e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, username: "" })}
          error={fieldErrors["username"]}
          disabled={isEditMode}
        />
      </Stack>

      {/* Primary Mobile Number + Login Username + Role */}
      {!isEditMode && (
        <Stack direction="row" spacing={2}>
          <CustomSelect
            label="Role"
            value={formData.userRole}
            onChange={(e) => updateFormData("userRole", e.target.value)}
            onClearError={() => setFieldErrors({ ...fieldErrors, userRole: "" })}
            error={fieldErrors["userRole"]}
            options={[
              { value: "supervisor", label: "Supervisor" },
              { value: "delivery_staff", label: "Delivery Staff" },
              { value: "billing_operator", label: "Billing Operator" },
              { value: "customer_support", label: "Customer Support" },
              { value: "data_entry", label: "Data Entry" },
            ]}
          />
          <CustomInput
            label="Login Password *"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            onClearError={() => setFieldErrors({ ...fieldErrors, password: "" })}
            error={fieldErrors["password"]}
            endAdornment={
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ mr: -1 }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <CustomInput
            label="Confirm Password *"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            value={formData.confirmPassword || ""}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            onClearError={() => setFieldErrors({ ...fieldErrors, confirmPassword: "" })}
            error={fieldErrors["confirmPassword"]}
            endAdornment={
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ mr: -1 }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
        </Stack>
      )}
      {isEditMode && (
        <Stack direction="row" spacing={2}>
          <CustomSelect
            label="Role"
            value={formData.userRole}
            onChange={(e) => updateFormData("userRole", e.target.value)}
            error={fieldErrors["userRole"]}
            options={[
              { value: "supervisor", label: "Supervisor" },
              { value: "delivery_staff", label: "Delivery Staff" },
              { value: "billing_operator", label: "Billing Operator" },
              { value: "customer_support", label: "Customer Support" },
              { value: "data_entry", label: "Data Entry" },
            ]}
          />
        </Stack>
      )}
    </Stack>
  );
};
