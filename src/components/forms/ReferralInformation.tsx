import { Stack, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export const ReferralInformation = () => {
  const [formData, setFormData] = useState({
    identityDocumentName: "",
    idCardNumber: "",
    idCardIssuanceDate: dayjs("2022-03-12") as Dayjs | null,
    idCardExpiryDate: dayjs("2027-03-12") as Dayjs | null,
    referralPersonName: "",
    referralRelation: "",
    referralContact: "",
    policeVerification: "",
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
      {/* Identity Document Name + ID Card Number */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Identity Document Name"
          value={formData.identityDocumentName}
          onChange={handleInputChange("identityDocumentName")}
          placeholder="National ID Card"
        />
        <TextField
          fullWidth
          label="ID Card Number"
          value={formData.idCardNumber}
          onChange={handleInputChange("idCardNumber")}
          placeholder="35101-988945510-3"
        />
      </Stack>

      {/* Issuance + Expiry Dates */}
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="ID Card Issuance Date"
            value={formData.idCardIssuanceDate}
            onChange={handleDateChange("idCardIssuanceDate")}
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="ID Card Expiry Date"
            value={formData.idCardExpiryDate}
            onChange={handleDateChange("idCardExpiryDate")}
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>
      </Stack>

      {/* Referral Person + Relation */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Referral Person Name"
          value={formData.referralPersonName}
          onChange={handleInputChange("referralPersonName")}
          placeholder="Ahmad Raza"
        />
        <TextField
          fullWidth
          label="Referral Relation"
          value={formData.referralRelation}
          onChange={handleInputChange("referralRelation")}
          placeholder="Colleague"
        />
      </Stack>

      {/* Referral Contact + Police Verification */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Referral Contact"
          value={formData.referralContact}
          onChange={handleInputChange("referralContact")}
          placeholder="+92 345 5678786"
        />
        <TextField
          fullWidth
          label="Police Verification"
          value={formData.policeVerification}
          onChange={handleInputChange("policeVerification")}
          placeholder="Verified - Lahore Police Dept."
        />
      </Stack>

      {/* Remarks */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Remarks"
        value={formData.remarks}
        onChange={handleInputChange("remarks")}
        placeholder="All verification documents have been submitted."
      />
    </Stack>
  );
};
