import { Box, Typography, Button, IconButton } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { PrimaryButton } from "../common/PrimaryButton";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import type { DomesticCustomer } from "../../types/customer";
import { useState } from "react";
import { Phone, Visibility, VisibilityOff } from "@mui/icons-material";
import { staffService } from "../../services/api";
import { handleImageUpload as processImage } from "../../utils/imageCompression";
import { buildFullPhone } from "../../utils/phoneValidation";

interface DomesticStep1BasicProfileProps {
  image?: string | null;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageReset?: () => void;
  isEditMode?: boolean;
}

export const DomesticStep1BasicProfile = ({
  // image,
  // onImageUpload,
  // onImageReset,
  isEditMode = false,
}: DomesticStep1BasicProfileProps = {}) => {
  const { state, fieldErrors } = useCustomerForm();
  const { updateFormData } = useCustomerForm();
  
  // Handle null state.data with default empty values
  const data = (state.data as unknown as DomesticCustomer) || {
    customerType: 'Domestic Customer',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '',
    title: 'Mr.',
  };
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+92");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setUploadError(null);

      // Compress image client-side
      const result = await processImage(file);
      if (!result.success || !result.file) {
        setUploadError(result.error || 'Failed to process image');
        return;
      }

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultData = reader.result as string;
        setProfileImage(resultData);
      };
      reader.readAsDataURL(result.file);

      // Upload the compressed file to assets/upload
      const uploadResponse = await staffService.uploadDocument(result.file);
      const profilePictureAssetId = uploadResponse.id;

      // Store the asset ID
      updateFormData("profilePictureAssetId", profilePictureAssetId);
    } catch (err: any) {
      console.error("Failed to upload profile picture:", err);
      setUploadError(err.message || 'Failed to upload image');
      setProfileImage(null);
      updateFormData("profilePictureAssetId", "");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageReset = () => {
    setProfileImage(null);
    setUploadError(null);
    updateFormData("profilePictureAssetId", "");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Profile Photo */}
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
            {profileImage ? (
              <img
                src={profileImage}
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
            id="profile-photo-upload"
            type="file"
            onChange={handleImageUpload}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <PrimaryButton
                onClick={() =>
                  document.getElementById("profile-photo-upload")?.click()
                }
                disabled={uploadingImage}
              >
                {uploadingImage ? "Uploading..." : "Upload Photo"}
              </PrimaryButton>
              {profileImage && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleImageReset}
                  disabled={uploadingImage}
                >
                  Reset
                </Button>
              )}
            </Box>
            {uploadError && (
              <Typography variant="caption" color="error" display="block">
                {uploadError}
              </Typography>
            )}
            {fieldErrors['profilePictureAssetId'] && (
              <Typography variant="caption" color="error" display="block">
                {fieldErrors['profilePictureAssetId']}
              </Typography>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Allowed JPG, GIF or PNG. Max size 10MB (will be auto-compressed).
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Basic Information */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: "#374151" }}
        >
          Basic Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomSelect
              label="Customer Type *"
              value={data.customerType || ""}
              onChange={(e) => updateFormData("customerType", e.target.value)}
              error={fieldErrors['customerType']}
              options={[
                { label: "Domestic Customer", value: "Domestic Customer" },
                { label: "Business Customer", value: "Business Customer" },
                { label: "Commercial Customer", value: "Commercial Customer" },
              ]}
            />
            <CustomSelect
              label="Title"
              value={data.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              error={fieldErrors['title']}
              options={[
                { label: "Mr", value: "Mr." },
                { label: "Mrs", value: "Mrs." },
                { label: "Ms", value: "Ms." },
                { label: "Miss", value: "Miss." },
                { label: "Mx", value: "Mx." },
              ]}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="First Name *"
              placeholder="Enter first name"
              value={data.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              error={fieldErrors['firstName']}
            />
            <CustomInput
              label="Last Name *"
              placeholder="Enter last name"
              value={data.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
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
              error={fieldErrors['email']}
              disabled={isEditMode}
            />
            <Box>
              <CustomInput
                label="Phone Number"
                value={data.mobileNumber && data.mobileNumber.startsWith('+92') ? data.mobileNumber.substring(3) : data.mobileNumber}
                onChange={(e) => {
                  const fullPhone = buildFullPhone(countryCode, e.target.value);
                  updateFormData("mobileNumber", fullPhone);
                }}
                error={fieldErrors['mobileNumber']}
                disabled={isEditMode}
                startAdornment={
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={isEditMode}
                      className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none disabled:opacity-50"
                    >
                      <option value="+92">PK +92</option>
                    </select>
                    <span className="ml-2 text-gray-400 border-r border-text-300 h-6"></span>
                  </Box>
                }
                endAdornment={<Phone sx={{ color: "#9ca3af", fontSize: 22 }} />}
              />
            </Box>
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
