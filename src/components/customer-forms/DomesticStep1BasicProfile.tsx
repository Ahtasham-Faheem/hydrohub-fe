import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { PrimaryButton } from "../common/PrimaryButton";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import type { DomesticCustomer } from "../../types/customer";
import { useState } from "react";
import { Phone } from "@mui/icons-material";
import { staffService } from "../../services/api";

export const DomesticStep1BasicProfile = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = (state?.data || {}) as DomesticCustomer;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+92");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);

      // Upload the file to assets/upload
      const uploadResponse = await staffService.uploadDocument(file, "image");
      const profilePictureAssetId = uploadResponse.id;

      // Store the asset ID
      updateFormData("profilePictureAssetId", profilePictureAssetId);
    } catch (err: any) {
      console.error("Failed to upload profile picture:", err);
      setProfileImage(null);
      updateFormData("profilePictureAssetId", "");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageReset = () => {
    setProfileImage(null);
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
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Allowed JPG, GIF or PNG. Max size 800KB.
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
            />
            <CustomInput
              label="Last Name *"
              placeholder="Enter last name"
              value={data.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
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
            />
            <Box>
              <CustomInput
                label="Phone Number"
                value={data.mobileNumber}
                onChange={(e) => updateFormData("mobileNumber", e.target.value)}
                startAdornment={
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none"
                    >
                      <option value="+92">PK +92</option>
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
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
            />
            <CustomInput
              label="Password *"
              placeholder="Enter password"
              type="password"
              value={data.password}
              onChange={(e) => updateFormData("password", e.target.value)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
