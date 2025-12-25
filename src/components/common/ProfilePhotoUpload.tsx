import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useUploadFile } from "../../hooks/useAssets";
import { assetsService } from "../../services/api";
import { handleImageUpload as processImage } from "../../utils/imageCompression";
import { useTheme } from '../../contexts/ThemeContext';
import { MdCloudUpload, MdImage } from "react-icons/md";

interface ProfilePhotoUploadProps {
  value?: string; // Asset ID
  onChange: (assetId: string) => void;
  onClearError?: () => void;
  error?: string;
  maxSize?: string;
  disabled?: boolean;
  existingImageUrl?: string; // For edit mode - direct image URL
}

export const ProfilePhotoUpload = ({
  value,
  onChange,
  onClearError,
  error,
  maxSize = "10MB (will be auto-compressed)",
  disabled = false,
  existingImageUrl,
}: ProfilePhotoUploadProps) => {
  const { colors } = useTheme();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // Create a synthetic event to reuse existing upload logic
        const syntheticEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleImageUpload(syntheticEvent);
      } else {
        setUploadError('Please drop an image file');
      }
    }
  };

  const displayImage = previewImage || existingImageUrl || (value ? `/api/assets/${value}` : null);

  return (
    <Box sx={{ width: "100%" }}>
      <input
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        id="profile-photo-upload"
        type="file"
        onChange={handleImageUpload}
        disabled={disabled}
      />

      {displayImage ? (
        // Image Preview Layout - Image on left, drag and drop area on right
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          {/* Left Side - Uploaded Image Preview */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Square Image Preview */}
            <Box
              sx={{
                width: { xs: 120, sm: 215 },
                height: { xs: 120, sm: 215 },
                borderRadius: 2,
                overflow: "hidden",
                border: `2px solid ${colors.border.primary}`,
                flexShrink: 0,
                position: "relative",
              }}
            >
              <img
                src={displayImage}
                alt="Profile"
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover"
                }}
              />
            </Box>
          </Box>

          {/* Right Side - Drag and Drop Area (same as original upload area) */}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && document.getElementById("profile-photo-upload")?.click()}
            sx={{
              flex: 1,
              minHeight: 200,
              borderRadius: 2,
              border: `2px dashed ${isDragOver ? colors.primary[500] : colors.border.primary}`,
              backgroundColor: isDragOver ? colors.primary[50] : colors.background.secondary,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": !disabled ? {
                borderColor: colors.primary[500],
                backgroundColor: colors.primary[50],
              } : {},
            }}
          >
            <Box sx={{ textAlign: "center", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MdCloudUpload 
                size={40} 
                style={{ 
                  color: isDragOver ? colors.primary[500] : colors.text.secondary,
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5, 
                  color: isDragOver ? colors.primary[500] : colors.text.primary 
                }}
              >
                {uploadMutation?.isPending ? "Uploading..." : "Replace Profile Photo"}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.text.secondary,
                  mb: 1
                }}
              >
                Drag and drop your new image here, or click to browse
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.text.tertiary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mb: 1
                }}
              >
                <MdImage size={16} />
                Allowed JPG, GIF or PNG. Max size {maxSize}
              </Typography>
              
              {/* Remove Button */}
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageReset();
                }}
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
                {isDeleting ? "Deleting..." : "Remove Photo"}
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        // Upload Area - When no image is uploaded
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && document.getElementById("profile-photo-upload")?.click()}
          sx={{
            width: "100%",
            minHeight: 200,
            borderRadius: 2,
            border: `2px dashed ${isDragOver ? colors.primary[500] : colors.border.primary}`,
            backgroundColor: isDragOver ? colors.primary[50] : colors.background.secondary,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            "&:hover": !disabled ? {
              borderColor: colors.primary[500],
              backgroundColor: colors.primary[50],
            } : {},
          }}
        >
          <Box sx={{ textAlign: "center", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MdCloudUpload 
              size={48} 
              style={{ 
                color: isDragOver ? colors.primary[500] : colors.text.secondary,
                marginBottom: 16 
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 1, 
                color: isDragOver ? colors.primary[500] : colors.text.primary 
              }}
            >
              {uploadMutation?.isPending ? "Uploading..." : "Upload Profile Photo"}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.text.secondary,
                mb: 2 
              }}
            >
              Drag and drop your image here, or click to browse
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: colors.text.tertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5
              }}
            >
              <MdImage size={16} />
              Allowed JPG, GIF or PNG. Max size {maxSize}
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Error Messages */}
      {(error || uploadError) && (
        <Box sx={{ mt: 2 }}>
          {error && (
            <Typography
              variant="caption"
              display="block"
              sx={{ fontWeight: 600, color: colors.status.error, mb: 0.5 }}
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
        </Box>
      )}
    </Box>
  );
};