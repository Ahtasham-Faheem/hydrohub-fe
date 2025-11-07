// components/forms/FileUploadField.tsx
import { Box, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { MdClose } from "react-icons/md";

interface FileUploadFieldProps {
  label: string;
  onFileChange?: (file: File | null) => void;
}

export const FileUploadField = ({ label, onFileChange }: FileUploadFieldProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (onFileChange) onFileChange(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (onFileChange) onFileChange(null);
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
        {/* Upload Box */}
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
            flexShrink: 0,
          }}
        >
          +
        </label>

        <input
          id={`upload-${label}`}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* File Preview */}
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
          <Typography variant="body2" color={file ? "textPrimary" : "textSecondary"}>
            {file ? file.name : "No file chosen"}
          </Typography>

          {file && (
            <IconButton size="small" onClick={handleRemoveFile}>
              <MdClose />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};
