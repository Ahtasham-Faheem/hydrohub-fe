import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomDateInput } from "../common/CustomDateInput";
import { CustomSelect } from "../common/CustomSelect";
import { PhoneInput } from "../common/PhoneInput";
import { CNICInput } from "../common/CNICInput";
import { useFormContext } from "../../contexts/FormContext";

export const IdentificationVerification = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } = useFormContext();

  const handlePhoneChange = (value: string) => {
    // PhoneInput component already adds +92 prefix, so just use the value as-is
    updateFormData("referralContact", value);
  };

  return (
    <Stack spacing={3}>
      {/* Identity Document Name + ID Card Number + ID Card Issuance Date */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Identity Document Name"
          placeholder="National ID Card"
          value={formData.identityDocumentName || ""}
          onChange={(e) => {
            updateFormData("identityDocumentName", e.target.value);
            // Clear error when user starts typing
            if (fieldErrors["identityDocumentName"]) {
              setFieldErrors({ ...fieldErrors, identityDocumentName: "" });
            }
          }}
          error={fieldErrors["identityDocumentName"]}
        />
        <CNICInput
          label="ID Card Number *"
          value={formData.idCardNumber || ""}
          onChange={(value) => updateFormData("idCardNumber", value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, idCardNumber: "" })}
          error={fieldErrors["idCardNumber"]}
          required
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
          onChange={(e) => {
            updateFormData("policeVerification", e.target.value);
            // Clear error when user selects
            if (fieldErrors["policeVerification"]) {
              setFieldErrors({ ...fieldErrors, policeVerification: "" });
            }
          }}
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
          onChange={(e) => {
            updateFormData("referralPersonName", e.target.value);
            // Clear error when user starts typing
            if (fieldErrors["referralPersonName"]) {
              setFieldErrors({ ...fieldErrors, referralPersonName: "" });
            }
          }}
          error={fieldErrors["referralPersonName"]}
        />
        <CustomInput
          label="Referral Relation"
          placeholder="Friend"
          value={formData.referralRelation || ""}
          onChange={(e) => {
            updateFormData("referralRelation", e.target.value);
            // Clear error when user starts typing
            if (fieldErrors["referralRelation"]) {
              setFieldErrors({ ...fieldErrors, referralRelation: "" });
            }
          }}
          error={fieldErrors["referralRelation"]}
        />
        <PhoneInput
          label="Referral Contact"
          value={formData.referralContact || ""}
          onChange={handlePhoneChange}
          onClearError={() => setFieldErrors({ ...fieldErrors, referralContact: "" })}
          error={fieldErrors["referralContact"]}
        />
      </Stack>

      {/* Remarks */}
      <CustomInput
        label="Remarks"
        placeholder="All documents verified and approved"
        multiline
        rows={4}
        value={formData.remarks || ""}
        onChange={(e) => {
          updateFormData("remarks", e.target.value);
          // Clear error when user starts typing
          if (fieldErrors["remarks"]) {
            setFieldErrors({ ...fieldErrors, remarks: "" });
          }
        }}
        error={fieldErrors["remarks"]}
      />
    </Stack>
  );
};
