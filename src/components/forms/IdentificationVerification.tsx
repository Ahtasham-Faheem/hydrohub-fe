import { Stack } from "@mui/material";
import { CustomInput } from "../CustomInput";
import { CustomCheckbox } from "../CustomCheckbox";
import { useFormContext } from "../../contexts/FormContext";

export const IdentificationVerification = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* ID Card Issued + ID Card Number + Police Verification */}
      <Stack direction="row" spacing={2}>
        <CustomCheckbox
          label="ID Card Issued"
          checked={formData.idCardIssued ? true : false}
          onChange={(checked) =>
            updateFormData("idCardIssued", checked ? "true" : "")
          }
        />
        <CustomInput
          label="ID Card Number"
          placeholder="35101-9889455-3"
          value={formData.idCardNumber || ""}
          onChange={(e) => updateFormData("idCardNumber", e.target.value)}
        />
        <CustomCheckbox
          label="Police Verification"
          checked={formData.policeVerification ? true : false}
          onChange={(checked) =>
            updateFormData("policeVerification", checked ? "true" : "")
          }
        />
      </Stack>

      {/* Referral Person + Referral Person Relation + Referral Contact */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Referral Person"
          placeholder="Who refers the staff"
          value={formData.referralPerson || ""}
          onChange={(e) => updateFormData("referralPerson", e.target.value)}
        />
        <CustomInput
          label="Referral Person Relation"
          placeholder="Enter relation"
          value={formData.referralPersonRelation || ""}
          onChange={(e) =>
            updateFormData("referralPersonRelation", e.target.value)
          }
        />
        <CustomInput
          label="Referral Contact"
          placeholder="+92 345 5679786"
          value={formData.referralContact || ""}
          onChange={(e) => updateFormData("referralContact", e.target.value)}
        />
      </Stack>
    </Stack>
  );
};
