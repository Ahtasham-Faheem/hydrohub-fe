import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from 'dayjs';
import { PrimaryButton } from "../PrimaryButton";
import { useFormContext } from "../../contexts/FormContext";
import { assetsService } from "../../services/api";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadResponse = await assetsService.uploadFile(file);
      updateFormData('profilePictureAssetId', uploadResponse.id);
      
      // Create local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload({ target: { files: [file] } } as any);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      setUploadError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageReset = () => {
    updateFormData('profilePictureAssetId', '');
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
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload New Photo"}
              </PrimaryButton>
              {image && (
                <Button variant="outlined" color="error" onClick={handleImageReset}>
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

      {/* Username + First Name */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Username *"
          variant="outlined"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => updateFormData('username', e.target.value)}
        />
        <TextField
          fullWidth
          label="First Name *"
          variant="outlined"
          placeholder="John"
          value={formData.firstName}
          onChange={(e) => updateFormData('firstName', e.target.value)}
        />
      </Stack>

      {/* Last Name + Email */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Last Name *"
          variant="outlined"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) => updateFormData('lastName', e.target.value)}
        />
        <TextField
          fullWidth
          label="Email *"
          variant="outlined"
          placeholder="john.doe@waterinn.com"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
        />
      </Stack>

      {/* Phone + Father Name */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Phone *"
          variant="outlined"
          placeholder="+923001234567"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
        />
        <TextField
          fullWidth
          label="Father Name"
          variant="outlined"
          placeholder="Michael Doe"
          value={formData.fathersName}
          onChange={(e) => updateFormData('fathersName', e.target.value)}
        />
      </Stack>

      {/* Date of Birth + Gender */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            sx={{ width: "100%" }}
            value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
            onChange={(date) => updateFormData('dateOfBirth', date ? date.format('YYYY-MM-DD') : '')}
          />
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select 
            label="Gender" 
            value={formData.gender}
            onChange={(e) => updateFormData('gender', e.target.value)}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* National ID + Marital Status */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="National ID"
          variant="outlined"
          placeholder="12345-6789012-3"
          value={formData.nationalId}
          onChange={(e) => updateFormData('nationalId', e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Marital Status</InputLabel>
          <Select 
            label="Marital Status" 
            value={formData.maritalStatus}
            onChange={(e) => updateFormData('maritalStatus', e.target.value)}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Password + Confirm Password */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Password *"
          variant="outlined"
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
        />
        <TextField
          fullWidth
          label="Confirm Password *"
          variant="outlined"
          type="password"
          placeholder="********"
        />
      </Stack>
    </Stack>
  );
};
