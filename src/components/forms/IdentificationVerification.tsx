import { Box, Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomDateInput } from "../common/CustomDateInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";
import { useState } from "react";
import { Phone } from "@mui/icons-material";

export const IdentificationVerification = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } = useFormContext();
  const [countryCode, setCountryCode] = useState("+92");

  return (
    <Stack spacing={3}>
      {/* Identity Document Name + ID Card Number + ID Card Issuance Date */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Identity Document Name"
          placeholder="National ID Card"
          value={formData.identityDocumentName || ""}
          onChange={(e) =>
            updateFormData("identityDocumentName", e.target.value)
          }
          error={fieldErrors["identityDocumentName"]}
        />
        <CustomInput
          label="ID Card Number"
          placeholder="12345-6789012-3"
          value={formData.idCardNumber || ""}
          onChange={(e) => updateFormData("idCardNumber", e.target.value)}
          error={fieldErrors["idCardNumber"]}
        />
        <CustomDateInput
          label="ID Card Issuance Date"
          value={
            formData.idCardIssuanceDate
              ? dayjs(formData.idCardIssuanceDate)
              : null
          }
          onChange={(date) => {
            updateFormData(
              "idCardIssuanceDate",
              date ? date.format("YYYY-MM-DD") : ""
            );
            // Clear error when user picks date
            if (fieldErrors['idCardIssuanceDate']) {
              setFieldErrors({ ...fieldErrors, idCardIssuanceDate: "" });
            }
          }}
          error={fieldErrors["idCardIssuanceDate"]}
        />
      </Stack>

      {/* ID Card Expiry Date + Police Verification */}
      <Stack direction="row" spacing={2}>
        <CustomDateInput
          label="ID Card Expiry Date"
          value={
            formData.idCardExpiryDate ? dayjs(formData.idCardExpiryDate) : null
          }
          onChange={(date) => {
            updateFormData(
              "idCardExpiryDate",
              date ? date.format("YYYY-MM-DD") : ""
            );
            // Clear error when user picks date
            if (fieldErrors['idCardExpiryDate']) {
              setFieldErrors({ ...fieldErrors, idCardExpiryDate: "" });
            }
          }}
          error={fieldErrors["idCardExpiryDate"]}
        />
        <CustomSelect
          label="Police Verification"
          value={formData.policeVerification || ""}
          onChange={(e) => updateFormData("policeVerification", e.target.value)}
          error={fieldErrors["policeVerification"]}
          options={[
            { value: "Verified", label: "Verified" },
            { value: "Pending", label: "Pending" },
            { value: "Not Verified", label: "Not Verified" },
          ]}
        />
      </Stack>

      {/* Referral Person Name + Referral Relation + Referral Contact */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Referral Person Name"
          placeholder="Ahmad Ali"
          value={formData.referralPersonName || ""}
          onChange={(e) => updateFormData("referralPersonName", e.target.value)}
          error={fieldErrors["referralPersonName"]}
        />
        <CustomInput
          label="Referral Relation"
          placeholder="Friend"
          value={formData.referralRelation || ""}
          onChange={(e) => updateFormData("referralRelation", e.target.value)}
          error={fieldErrors["referralRelation"]}
        />
        <CustomInput
          label="Referral Contact"
          placeholder="+923001111111"
          value={formData.referralContact || ""}
          onChange={(e) => updateFormData("referralContact", e.target.value)}
          error={fieldErrors["referralContact"]}
          startAdornment={
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none"
              >
                <option value="+92">PK +92</option>
              </select>
              <span className="ml-2 text-gray-400 border-r border-text-300 h-6"></span>
            </Box>
          }
          endAdornment={<Phone sx={{ color: "#9ca3af", fontSize: 22 }} />}
        />
      </Stack>

      {/* Remarks */}
      <CustomInput
        label="Remarks"
        placeholder="All documents verified and approved"
        multiline
        rows={4}
        value={formData.remarks || ""}
        onChange={(e) => updateFormData("remarks", e.target.value)}
        error={fieldErrors["remarks"]}
      />
    </Stack>
  );
};
