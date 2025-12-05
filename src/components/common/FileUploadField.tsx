// components/forms/FileUploadField.tsx
import { Box, Typography, IconButton, Dialog, DialogContent, CircularProgress } from "@mui/material";
import { useState } from "react";
import { MdClose, MdVisibility } from "react-icons/md";
import { useUploadFile } from "../../hooks/useAssets";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface FileUploadFieldProps {
  label: string;
  onFileChange?: (files: File | File[] | null) => void;
  multiple?: boolean;
  staffProfileId?: string;
  documentId?: string;
  uploadedLabel?: string;
  isUploaded?: boolean;
}

export const FileUploadField = ({ label, onFileChange, multiple = false, staffProfileId, documentId,uploadedLabel, isUploaded = false }: FileUploadFieldProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ file: File; url: string }[]>([]);
  const [showPreview, setShowPreview] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const uploadMutation = useUploadFile();
  const queryClient = useQueryClient();
  
  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/staff/${staffProfileId}/documents/${documentId}`),
    onSuccess: () => {
      setFiles([]);
      setPreviewUrls([]);
      if (onFileChange) onFileChange(null);
      queryClient.invalidateQueries({ queryKey: ['staff', staffProfileId, 'documents'] });
    }
  });
  
  // Update document mutation
  const updateMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.patch(`/staff/${staffProfileId}/documents/${documentId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffProfileId, 'documents'] });
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;
    
    setUploadError(null);
    
    selectedFiles.forEach((file) => {
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => {
          const updated = [...prev];
          const existingIndex = updated.findIndex(p => p.file === file);
          if (existingIndex >= 0) {
            updated[existingIndex].url = reader.result as string;
          } else {
            updated.push({ file, url: reader.result as string });
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
      
      // Upload or update file
      const mutation = isUploaded ? updateMutation : uploadMutation;
      mutation.mutate(file, {
        onSuccess: (response) => {
          setFiles(prev => multiple ? [...prev, file] : [file]);
          if (onFileChange) {
            onFileChange(multiple ? [...files, file] : file);
          }
        },
        onError: (error: any) => {
          setUploadError(error.response?.data?.message || (isUploaded ? 'Update failed' : 'Upload failed'));
          setPreviewUrls(prev => prev.filter(p => p.file !== file));
        }
      });
    });
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(f => f !== fileToRemove);
    const updatedPreviews = previewUrls.filter(p => p.file !== fileToRemove);
    
    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    
    if (onFileChange) {
      onFileChange(multiple ? updatedFiles : (updatedFiles[0] || null));
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "#fafafa",
          position: "relative",
          transition: "border-color 0.3s ease",
          "&:hover": {
            borderColor: "#1976d2",
          },
        }}
      >
        {/* Single Mode: Upload Box or Image Preview */}
        {!multiple ? (
          <>
            {previewUrls.length > 0 && previewUrls[0].url ? (
              <Box
                sx={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  flexShrink: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box
                  component="img"
                  src={previewUrls[0].url}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(previewUrls[0].file)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                >
                  <MdClose />
                </IconButton>
              </Box>
            ) : (
              <label
                htmlFor={`upload-${label}`}
                style={{
                  border: isUploaded ? "2px solid #4caf50" : "2px dashed #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: (uploadMutation.isPending || updateMutation.isPending) ? "not-allowed" : "pointer",
                  color: isUploaded ? "#4caf50" : "#999",
                  fontSize: "18px",
                  flexShrink: 0,
                  opacity: (uploadMutation.isPending || updateMutation.isPending) ? 0.6 : 1,
                  backgroundColor: isUploaded ? "#f1f8e9" : "transparent",
                }}
              >
                {(uploadMutation.isPending || updateMutation.isPending) ? <CircularProgress size={24} /> : isUploaded ? "✏️" : "+"}
              </label>
            )}

            <input
              id={`upload-${label}`}
              type="file"
              multiple={false}
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={uploadMutation.isPending || updateMutation.isPending}
            />

            {/* File Info */}
            <Box
              sx={{
                flexGrow: 1,
                ml: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box>
                  <Typography variant="body2" color={files.length > 0 ? "textPrimary" : "textSecondary"}>
                    {uploadMutation.isPending ? "Uploading..." : 
                     updateMutation.isPending ? "Updating..." :
                     deleteMutation.isPending ? "Deleting..." :
                     files.length > 0 ? files[0].name : 
                     isUploaded ? uploadedLabel : "No file chosen"}
                  </Typography>
                  {uploadError && (
                    <Typography variant="caption" color="error">
                      {uploadError}
                    </Typography>
                  )}
                </Box>
                {isUploaded && (
                  <IconButton 
                    size="small" 
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    sx={{ color: '#ef4444' }}
                  >
                    <MdClose />
                  </IconButton>
                )}
              </Box>
              {files.length > 0 && previewUrls[0]?.file.type.startsWith('image/') && (
                <IconButton size="small" onClick={() => setShowPreview(0)}>
                  <MdVisibility />
                </IconButton>
              )}
            </Box>
          </>
        ) : (
          <>
            {/* Multiple Mode: Upload Box */}
            <label
              htmlFor={`upload-${label}`}
              style={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "80px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                color: "#999",
                fontSize: "24px",
              }}
            >
              +
            </label>

            <input
              id={`upload-${label}`}
              type="file"
              multiple={true}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </>
        )}
      </Box>

      {/* Multiple Mode: File Previews Grid */}
      {multiple && previewUrls.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 2,
            mt: 2,
          }}
        >
          {previewUrls.map((preview) => {
            const isImage = preview.file.type.startsWith('image/');
            return (
              <Box
                key={preview.file.name}
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}
              >
                {isImage && preview.url && (
                  <>
                    <Box
                      component="img"
                      src={preview.url}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        gap: 0.5,
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        padding: 0.5,
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        transition: "backgroundColor 0.2s",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                        }
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setShowPreview(previewUrls.indexOf(preview))}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          },
                        }}
                      >
                        <MdVisibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(preview.file)}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          },
                        }}
                      >
                        <MdClose />
                      </IconButton>
                    </Box>
                  </>
                )}
                {!isImage && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 1,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="caption" sx={{ textAlign: "center", wordBreak: "break-word", fontSize: "10px" }}>
                      {preview.file.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(preview.file)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <MdClose />
                    </IconButton>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
      
      {/* Full Preview Dialog */}
      <Dialog
        open={showPreview !== null}
        onClose={() => setShowPreview(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 2, textAlign: 'center' }}>
          {showPreview !== null && previewUrls[showPreview] && (
            <Box
              component="img"
              src={previewUrls[showPreview].url}
              sx={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                boxShadow: 5,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
