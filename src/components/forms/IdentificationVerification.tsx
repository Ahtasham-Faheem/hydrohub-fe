import { Stack, TextField } from "@mui/material";
import { CustomInput } from "../CustomInput";
import { CustomDateInput } from "../CustomDateInput";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export const IdentificationVerification = () => {
  const [formData, setFormData] = useState({
    identityDocumentName: "",
    idCardNumber: "",
    idCardIssuanceDate: dayjs() as Dayjs | null,
    idCardExpiryDate: dayjs() as Dayjs | null,
    referralPersonName: "",
    referralRelation: "",
    referralContact: "",
    otherVerification: "",
    remarks: "",
  });

  const handleInputChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleDateChange = (name: string) => (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Identity Document Name"
          value={formData.identityDocumentName}
          onChange={handleInputChange("identityDocumentName")}
          size="medium"
          placeholder="Enter document name"
        />
        <CustomInput
          label="ID Card Number"
          value={formData.idCardNumber}
          onChange={handleInputChange("idCardNumber")}
          size="medium"
          placeholder="35101-9889455-3"
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomDateInput
          label="ID Card Issuance Date"
          value={formData.idCardIssuanceDate}
          onChange={handleDateChange("idCardIssuanceDate")}
        />
        <CustomDateInput
          label="ID Card Expiry Date"
          value={formData.idCardExpiryDate}
          onChange={handleDateChange("idCardExpiryDate")}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Referral Person Name"
          value={formData.referralPersonName}
          onChange={handleInputChange("referralPersonName")}
          size="medium"
          placeholder="Enter referral name"
        />
        <CustomInput
          label="Referral Relation"
          value={formData.referralRelation}
          onChange={handleInputChange("referralRelation")}
          size="medium"
          placeholder="Enter relation"
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Referral Contact"
          value={formData.referralContact}
          onChange={handleInputChange("referralContact")}
          size="medium"
          placeholder="+92 345 5679786"
        />
        <CustomInput
          label="Other Verification"
          value={formData.otherVerification}
          onChange={handleInputChange("otherVerification")}
          size="medium"
          placeholder="Enter verification details"
        />
      </Stack>

      <TextField
        label="Remarks"
        multiline
        rows={4}
        value={formData.remarks}
        onChange={handleInputChange("remarks")}
        placeholder="Enter text..."
        fullWidth
        variant="outlined"
        size="small"
      />
    </Stack>
  );
};