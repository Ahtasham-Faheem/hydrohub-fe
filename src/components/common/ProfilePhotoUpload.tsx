import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { PrimaryButton } from "./PrimaryButton";
import { useUploadFile } from "../../hooks/useAssets";
import { assetsService } from "../../services/api";
import { handleImageUpload as processImage } from "../../utils/imageCompression";
import { useTheme } from '../../contexts/ThemeContext';

interface ProfilePhotoUploadProps {
  value?: string; // Asset ID
  onChange: (assetId: string) => void;
  onClearError?: () => void;
  error?: string;
  label?: string;
  maxSize?: string;
  disabled?: boolean;
}

export const ProfilePhotoUpload = ({
  value,
  onChange,
  onClearError,
  error,
  label = "Profile Photo",
  maxSize = "10MB (will be auto-compressed)",
  disabled = false,
}: ProfilePhotoUploadProps) => {
  const { colors } = useTheme();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TanStack Query mutation for upload
  const uploadMutation = useUploadFile();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    try {
      // For PersonalInformation component (uses useUploadFile hook)
      if (uploadMutation) {
        uploadMutation.mutate(file, {
          onSuccess: (uploadResponse) => {
            onChange(uploadResponse.id);
            // Clear error when image is uploaded
            if (onClearError) {
              onClearError();
            }
            // Create local preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            // Clear the file input so the same file can be uploaded again
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          },
          onError: (error: any) => {
            setUploadError(
              error.response?.data?.message || "Failed to upload image"
            );
            // Clear the file input on error too
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          },
        });
      } else {
        // For DomesticStep1BasicProfile component (uses direct API call)
        // Compress image client-side
        const result = await processImage(file);
        if (!result.success || !result.file) {
          setUploadError(result.error || 'Failed to process image');
          // Clear the file input on error
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(result.file);

        // Upload the compressed file to assets/upload
        const uploadResponse = await assetsService.uploadFile(result.file);
        onChange(uploadResponse.id);

        // Clear error when image is uploaded
        if (onClearError) {
          onClearError();
        }
        
        // Clear the file input so the same file can be uploaded again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err: any) {
      console.error("Failed to upload profile picture:", err);
      setUploadError(err.message || 'Failed to upload image');
      setPreviewImage(null);
      onChange("");
      
      // Clear the file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageReset = async () => {
    try {
      setIsDeleting(true);
      
      // Delete the asset from server if we have an asset ID
      if (value && value.trim()) {
        await assetsService.deleteAsset(value);
      }
      
      // Clear local state
      onChange("");
      setPreviewImage(null);
      setUploadError(null);
      
      // Clear the file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear error state
      if (onClearError) {
        onClearError();
      }
    } catch (err: any) {
      console.error("Failed to delete asset:", err);
      setUploadError(err.message || 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayImage = previewImage || (value ? `/api/assets/${value}` : null);

  return (
    <Box sx={{ display: "flex", justifyContent: "start" }}>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "5%",
            border: `2px dashed ${colors.border.primary}`,
            backgroundColor: colors.background.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography sx={{ color: colors.text.secondary }}>{label}</Typography>
          )}
        </Box>

        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          id="profile-photo-upload"
          type="file"
          onChange={handleImageUpload}
          disabled={disabled}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <PrimaryButton
              onClick={() => document.getElementById("profile-photo-upload")?.click()}
              disabled={uploadMutation?.isPending || disabled}
            >
              {uploadMutation?.isPending ? "Uploading..." : "Upload Photo"}
            </PrimaryButton>
            {displayImage && (
              <Button
                variant="outlined"
                onClick={handleImageReset}
                disabled={isDeleting || disabled}
                sx={{
                  color: colors.status.error,
                  borderColor: colors.status.error,
                  '&:hover': {
                    borderColor: colors.status.error,
                    backgroundColor: `${colors.status.error}10`,
                  },
                }}
              >
                {isDeleting ? "Deleting..." : "Reset"}
              </Button>
            )}
          </Box>
          
          {/* Error Messages */}
          {error && (
            <Typography
              variant="caption"
              display="block"
              sx={{ fontWeight: 600, color: colors.status.error }}
            >
              {error}
            </Typography>
          )}
          {uploadError && (
            <Typography 
              variant="caption" 
              display="block"
              sx={{ color: colors.status.error }}
            >
              {uploadError}
            </Typography>
          )}
          
          {/* Help Text */}
          <Typography 
            variant="caption" 
            display="block" 
            sx={{ mt: 1, color: colors.text.secondary }}
          >
            Allowed JPG, GIF or PNG. Max size {maxSize}.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};