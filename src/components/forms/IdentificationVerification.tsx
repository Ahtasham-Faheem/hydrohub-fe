import { Stack } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";

export const IdentificationVerification = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Identity Document Name + ID Card Number + ID Card Issuance Date */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Identity Document Name"
          placeholder="National ID Card"
          value={formData.identityDocumentName || ""}
          onChange={(e) => updateFormData("identityDocumentName", e.target.value)}
        />
        <CustomInput
          label="ID Card Number"
          placeholder="12345-6789012-3"
          value={formData.idCardNumber || ""}
          onChange={(e) => updateFormData("idCardNumber", e.target.value)}
        />
        <CustomInput
          label="ID Card Issuance Date"
          type="date"
          value={formData.idCardIssuanceDate || ""}
          onChange={(e) => updateFormData("idCardIssuanceDate", e.target.value)}
        />
      </Stack>

      {/* ID Card Expiry Date + Police Verification */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="ID Card Expiry Date"
          type="date"
          value={formData.idCardExpiryDate || ""}
          onChange={(e) => updateFormData("idCardExpiryDate", e.target.value)}
        />
        <CustomSelect
          label="Police Verification"
          value={formData.policeVerification || ""}
          onChange={(e) => updateFormData("policeVerification", e.target.value)}
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
        />
        <CustomInput
          label="Referral Relation"
          placeholder="Friend"
          value={formData.referralRelation || ""}
          onChange={(e) => updateFormData("referralRelation", e.target.value)}
        />
        <CustomInput
          label="Referral Contact"
          placeholder="+923001111111"
          value={formData.referralContact || ""}
          onChange={(e) => updateFormData("referralContact", e.target.value)}
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
      />
    </Stack>
  );
};
