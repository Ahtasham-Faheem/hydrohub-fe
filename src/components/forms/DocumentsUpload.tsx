// components/forms/DocumentsUpload.tsx
import { Stack, Box, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { FileUploadField } from "../common/FileUploadField";
import { CustomInput } from "../common/CustomInput";
import { useFormContext } from "../../contexts/FormContext";
import { staffService } from "../../services/api";

interface UploadedDocument {
  id: string;
  documentType: string;
  documentName: string;
  assetId: string;
}

export const DocumentsUpload = () => {
  const { formData, updateFormData } = useFormContext();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploadingDocumentType, setUploadingDocumentType] = useState<string | null>(null);

  // Document type mapping
  const documentTypes = {
    cnic: { type: "CNIC Copy", label: "CNIC Copy" },
    license: { type: "License Copy", label: "License Copy" },
    agreement: { type: "Agreement", label: "Agreement" },
    joiningForm: { type: "Joining Form", label: "Joining Form" },
    other: { type: "Other Attachments", label: "Other Attachments" },
  };

  // Fetch uploaded documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!formData.staffProfileId) {
        setLoadingDocuments(false);
        return;
      }

      try {
        setLoadingDocuments(true);
        const response = await staffService.getDocuments(formData.staffProfileId);
        setUploadedDocuments(response || []);
      } catch (err: any) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, [formData.staffProfileId]);

  const handleDocumentUpload = async (
    files: File | File[] | null,
    documentTypeKey: keyof typeof documentTypes
  ) => {
    if (!files) return;

    const file = files instanceof File ? files : files[0];
    if (!file) return;

    if (!formData.staffProfileId) {
      setError("Staff profile not found");
      return;
    }

    setError(null);

    try {
      const documentType = documentTypes[documentTypeKey].type;
      setUploadingDocumentType(documentTypeKey);
      
      const documentName = `${documentType} - ${file.name}`;

      // Step 1: Upload file to assets/upload endpoint
      const uploadResponse = await staffService.uploadDocument(file);
      const assetId = uploadResponse.id;
      
      // Step 2: Create document record with assetId
      const documentPayload = {
        documentType,
        assetId,
        documentName,
      };
      
      await staffService.createDocument(formData.staffProfileId, documentPayload);

      // Step 3: Add to local documents list
      const newDocument: UploadedDocument = {
        id: `doc-${Date.now()}`,
        documentType,
        documentName,
        assetId,
      };

      setUploadedDocuments([...uploadedDocuments, newDocument]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingDocumentType(null);
    }
  };
  console.log("Uploaded Documents:", uploadedDocuments, formData);

  if (loadingDocuments) {
    return (
      <Stack spacing={3} sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 5 }}>
        <CircularProgress />
        <span>Loading documents...</span>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Document uploaded successfully</Alert>}

      {/* CNIC Copy + License Copy */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          {uploadingDocumentType === "cnic" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
              <CircularProgress size={20} />
              <span>Uploading CNIC Copy...</span>
            </Box>
          ) : (
            <FileUploadField
              label="CNIC Copy"
              onFileChange={(files) => handleDocumentUpload(files, "cnic")}
              staffProfileId={formData.staffProfileId}
              documentId={uploadedDocuments.find((d) => d.documentType === "CNIC Copy")?.id}
              isUploaded={!!uploadedDocuments.find((d) => d.documentType === "CNIC Copy")}
            />
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          {uploadingDocumentType === "license" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
              <CircularProgress size={20} />
              <span>Uploading License Copy...</span>
            </Box>
          ) : (
            <FileUploadField
              label="License Copy"
              onFileChange={(files) => handleDocumentUpload(files, "license")}
              staffProfileId={formData.staffProfileId}
              documentId={uploadedDocuments.find((d) => d.documentType === "License Copy")?.id}
              uploadedLabel={uploadedDocuments.find((d) => d.documentType === "License Copy")?.documentName}
              isUploaded={!!uploadedDocuments.find((d) => d.documentType === "License Copy")}
            />
          )}
        </Box>
      </Box>

      {/* Agreement + Joining Form */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          {uploadingDocumentType === "agreement" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
              <CircularProgress size={20} />
              <span>Uploading Agreement...</span>
            </Box>
          ) : (
            <FileUploadField
              label="Agreement"
              onFileChange={(files) => handleDocumentUpload(files, "agreement")}
              staffProfileId={formData.staffProfileId}
              documentId={uploadedDocuments.find((d) => d.documentType === "Agreement")?.id}
              isUploaded={!!uploadedDocuments.find((d) => d.documentType === "Agreement")}
            />
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          {uploadingDocumentType === "joiningForm" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
              <CircularProgress size={20} />
              <span>Uploading Joining Form...</span>
            </Box>
          ) : (
            <FileUploadField
              label="Joining Form"
              onFileChange={(files) => handleDocumentUpload(files, "joiningForm")}
              staffProfileId={formData.staffProfileId}
              documentId={uploadedDocuments.find((d) => d.documentType === "Joining Form")?.id}
              isUploaded={!!uploadedDocuments.find((d) => d.documentType === "Joining Form")}
            />
          )}
        </Box>
      </Box>

      {/* Other Attachments + Remarks */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          {uploadingDocumentType === "other" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2, backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
              <CircularProgress size={20} />
              <span>Uploading Other Attachments...</span>
            </Box>
          ) : (
            <FileUploadField
              label="Other Attachments"
              onFileChange={(files) => handleDocumentUpload(files, "other")}
              multiple={true}
              staffProfileId={formData.staffProfileId}
              documentId={uploadedDocuments.find((d) => d.documentType === "Other Attachments")?.id}
              isUploaded={!!uploadedDocuments.find((d) => d.documentType === "Other Attachments")}
            />
          )}
        </Box>
      </Box>

      {/* Remarks */}
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
