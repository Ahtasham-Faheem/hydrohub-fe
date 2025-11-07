// components/forms/DocumentsUpload.tsx
import { Stack, Box } from "@mui/material";
import { FileUploadField } from "../FileUploadField";

export const DocumentsUpload = () => {
  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <FileUploadField label="CNIC Copy" />
        <FileUploadField label="License Copy" />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <FileUploadField label="Agreement" />
        <FileUploadField label="Joining Form" />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <FileUploadField label="Other Attachments" />
        <div className="w-full"></div>
      </Box>
    </Stack>
  );
};
