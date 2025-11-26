// components/forms/DocumentsUpload.tsx
import { Stack, Box } from "@mui/material";
import { FileUploadField } from "../FileUploadField";
import { CustomInput } from "../CustomInput";
import { useFormContext } from "../../contexts/FormContext";

export const DocumentsUpload = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* CNIC Copy + License Copy */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <FileUploadField label="CNIC Copy" />
        <FileUploadField label="License Copy" />
      </Box>

      {/* Agreement + Joining Form */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <FileUploadField label="Agreement" />
        <FileUploadField label="Joining Form" />
      </Box>

      {/* Other Attachments + Remarks */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <FileUploadField label="Other Attachments" multiple={true} />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <CustomInput
          label="Remarks"
          placeholder="Enter remarks"
          value={formData.documentRemarks || ""}
          onChange={(e) => updateFormData("documentRemarks", e.target.value)}
          multiline
          rows={3}
        />
      </Box>
    </Stack>
  );
};
