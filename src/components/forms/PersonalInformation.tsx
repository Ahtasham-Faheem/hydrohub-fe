import { Box, Typography, Button, Stack, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PrimaryButton } from "../PrimaryButton";
import { CustomInput } from "../CustomInput";
import { CustomSelect } from "../CustomSelect";
import { useFormContext } from "../../contexts/FormContext";
import { useUploadFile } from "../../hooks/useAssets";
import { useState } from "react";

interface PersonalInformationProps {
  image: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageReset: () => void;
}

export const PersonalInformation = ({
  image,
  onImageUpload,
  onImageReset,
}: PersonalInformationProps) => {
  const { formData, updateFormData } = useFormContext();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // TanStack Query mutation
  const uploadMutation = useUploadFile();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    uploadMutation.mutate(file, {
      onSuccess: (uploadResponse) => {
        updateFormData("profilePictureAssetId", uploadResponse.id);

        // Create local preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageUpload({ target: { files: [file] } } as any);
        };
        reader.readAsDataURL(file);
      },
      onError: (error: any) => {
        setUploadError(
          error.response?.data?.message || "Failed to upload image"
        );
      },
    });
  };

  const handleImageReset = () => {
    updateFormData("profilePictureAssetId", "");
    onImageReset();
    setUploadError(null);
  };

  return (
    <Stack spacing={3}>
      {/* Profile Upload Section */}
      <Box sx={{ display: "flex", justifyContent: "start" }}>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: "5%",
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {image ? (
              <img
                src={image}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography color="textSecondary">Profile Photo</Typography>
            )}
          </Box>

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="photo-upload"
            type="file"
            onChange={handleImageUpload}
          />

          <div className="flex flex-col gap-2 justify-start">
            <Box sx={{ display: "flex", gap: 1 }}>
              <PrimaryButton
                className="mx-6"
                onClick={() => document.getElementById("photo-upload")?.click()}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload New Photo"}
              </PrimaryButton>
              {image && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleImageReset}
                >
                  Reset
                </Button>
              )}
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Allowed JPG, GIF or PNG. Max size 800KB.
            </Typography>
            {uploadError && (
              <Typography variant="caption" color="error" display="block">
                {uploadError}
              </Typography>
            )}
          </div>
        </Box>
      </Box>

      {/* Employee ID + Employee Creation Date + Title */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Title"
          value={formData.title || ""}
          onChange={(e) => updateFormData("title", e.target.value)}
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
        />
        <CustomInput
          label="Last Name *"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) => updateFormData("lastName", e.target.value)}
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
        />
        <CustomInput
          label="Primary Mobile Number *"
          placeholder="+923001234567"
          value={formData.phone}
          onChange={(e) => updateFormData("phone", e.target.value)}
        />
        <CustomInput
          label="Login Username *"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => updateFormData("username", e.target.value)}
        />
      </Stack>

      {/* Primary Mobile Number + Login Username + Role */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Role"
          value={formData.userRole}
          onChange={(e) => updateFormData("userRole", e.target.value)}
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
    </Stack>
  );
};
