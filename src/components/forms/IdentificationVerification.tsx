import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomDateInput } from "../common/CustomDateInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";

export const IdentificationVerification = () => {
  const { formData, updateFormData, fieldErrors } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Identity Document Name + ID Card Number + ID Card Issuance Date */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Identity Document Name"
          placeholder="National ID Card"
          value={formData.identityDocumentName || ""}
          onChange={(e) => updateFormData("identityDocumentName", e.target.value)}
          error={fieldErrors['identityDocumentName']}
        />
        <CustomInput
          label="ID Card Number"
          placeholder="12345-6789012-3"
          value={formData.idCardNumber || ""}
          onChange={(e) => updateFormData("idCardNumber", e.target.value)}
          error={fieldErrors['idCardNumber']}
        />
        <CustomDateInput
          label="ID Card Issuance Date"
          value={formData.idCardIssuanceDate ? dayjs(formData.idCardIssuanceDate) : null}
          onChange={(date) => updateFormData("idCardIssuanceDate", date ? date.format('YYYY-MM-DD') : '')}
          error={fieldErrors['idCardIssuanceDate']}
        />
      </Stack>

      {/* ID Card Expiry Date + Police Verification */}
      <Stack direction="row" spacing={2}>
        <CustomDateInput
          label="ID Card Expiry Date"
          value={formData.idCardExpiryDate ? dayjs(formData.idCardExpiryDate) : null}
          onChange={(date) => updateFormData("idCardExpiryDate", date ? date.format('YYYY-MM-DD') : '')}
          error={fieldErrors['idCardExpiryDate']}
        />
        <CustomSelect
          label="Police Verification"
          value={formData.policeVerification || ""}
          onChange={(e) => updateFormData("policeVerification", e.target.value)}
          error={fieldErrors['policeVerification']}
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
          error={fieldErrors['referralPersonName']}
        />
        <CustomInput
          label="Referral Relation"
          placeholder="Friend"
          value={formData.referralRelation || ""}
          onChange={(e) => updateFormData("referralRelation", e.target.value)}
          error={fieldErrors['referralRelation']}
        />
        <CustomInput
          label="Referral Contact"
          placeholder="+923001111111"
          value={formData.referralContact || ""}
          onChange={(e) => updateFormData("referralContact", e.target.value)}
          error={fieldErrors['referralContact']}
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
        error={fieldErrors['remarks']}
      />
    </Stack>
  );
};
