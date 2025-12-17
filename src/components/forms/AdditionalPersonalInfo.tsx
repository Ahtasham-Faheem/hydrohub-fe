import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { PhoneInput } from "../common/PhoneInput";
import { CNICInput } from "../common/CNICInput";
import { useFormContext } from "../../contexts/FormContext";

export const AdditionalPersonalInfo = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } = useFormContext();

  const handlePhoneChange = (field: keyof typeof formData, value: string) => {
    // PhoneInput component already adds +92 prefix, so just use the value as-is
    updateFormData(field, value);
  };

  return (
    <Stack spacing={3}>
      {/* Father's Name + Mother's Name + Date of Birth */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Father's Name"
          placeholder="Michael Doe"
          value={formData.fathersName || ""}
          onChange={(e) => updateFormData("fathersName", e.target.value)}
          error={fieldErrors['fathersName']}
        />
        <CustomInput
          label="Mother's Name"
          placeholder="Mary Doe"
          value={formData.mothersName || ""}
          onChange={(e) => updateFormData("mothersName", e.target.value)}
          error={fieldErrors['mothersName']}
        />
        <CustomDateInput
          label="Date of Birth"
          value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
          onChange={(date) => {
            updateFormData("dateOfBirth", date ? date.format("YYYY-MM-DD") : "");
            // Clear error when user selects a date
            if (fieldErrors['dateOfBirth']) {
              setFieldErrors({ ...fieldErrors, dateOfBirth: "" });
            }
          }}
          error={fieldErrors['dateOfBirth']}
        />
      </Stack>

      {/* Nationality + National ID + Gender */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Nationality"
          placeholder="e.g., Pakistani"
          value={formData.nationality || "Pakistani"}
          onChange={(e) => updateFormData("nationality", e.target.value)}
          error={fieldErrors['nationality']}
        />
        <CNICInput
          label="National ID"
          value={formData.nationalId || ""}
          onChange={(value) => updateFormData("nationalId", value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, nationalId: "" })}
          error={fieldErrors['nationalId']}
          required
        />
        <CustomSelect
          label="Gender"
          value={formData.gender || ""}
          onChange={(e) => {
            updateFormData("gender", e.target.value);
            // Clear error when user selects
            if (fieldErrors['gender']) {
              setFieldErrors({ ...fieldErrors, gender: "" });
            }
          }}
          error={fieldErrors['gender']}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
        />
      </Stack>

      {/* Marital Status + Alternate Contact Number + Secondary Email Address */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Marital Status"
          value={formData.maritalStatus || ""}
          onChange={(e) => {
            updateFormData("maritalStatus", e.target.value);
            // Clear error when user selects
            if (fieldErrors['maritalStatus']) {
              setFieldErrors({ ...fieldErrors, maritalStatus: "" });
            }
          }}
          error={fieldErrors['maritalStatus']}
          options={[
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
          ]}
        />
        <PhoneInput
          label="Alternate Contact Number"
          value={formData.alternateContactNumber || ""}
          onChange={(value) => handlePhoneChange("alternateContactNumber", value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, alternateContactNumber: "" })}
          error={fieldErrors['alternateContactNumber']}
        />
        <CustomInput
          label="Secondary Email Address"
          type="email"
          placeholder="john@gmail.com"
          value={formData.secondaryEmailAddress || ""}
          onChange={(e) => {
            updateFormData("secondaryEmailAddress", e.target.value);
            // Clear error when user starts typing
            if (fieldErrors['secondaryEmailAddress']) {
              setFieldErrors({ ...fieldErrors, secondaryEmailAddress: "" });
            }
          }}
          error={fieldErrors['secondaryEmailAddress']}
        />
      </Stack>

      {/* Present Address + Permanent Address */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Present Address"
          placeholder="House 10, Block A, Lahore"
          value={formData.presentAddress || ""}
          onChange={(e) => updateFormData("presentAddress", e.target.value)}
          error={fieldErrors['presentAddress']}
        />
        <CustomInput
          label="Permanent Address"
          placeholder="House 20, Model Town, Lahore"
          value={formData.permanentAddress || ""}
          onChange={(e) => updateFormData("permanentAddress", e.target.value)}
          error={fieldErrors['permanentAddress']}
        />
      </Stack>

      {/* Emergency Contact Name + Emergency Contact Relation + Emergency Contact Number */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Emergency Contact Name"
          placeholder="Jane Doe"
          value={formData.emergencyContactName || ""}
          onChange={(e) =>
            updateFormData("emergencyContactName", e.target.value)
          }
          error={fieldErrors['emergencyContactName']}
        />
        <CustomInput
          label="Emergency Contact Relation"
          placeholder="e.g., Brother, Friend"
          value={formData.emergencyContactRelation || ""}
          onChange={(e) =>
            updateFormData("emergencyContactRelation", e.target.value)
          }
          error={fieldErrors['emergencyContactRelation']}
        />
        <PhoneInput
          label="Emergency Contact Number"
          value={formData.emergencyContactNumber || ""}
          onChange={(value) => handlePhoneChange("emergencyContactNumber", value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, emergencyContactNumber: "" })}
          error={fieldErrors['emergencyContactNumber']}
          required
        />
      </Stack>
    </Stack>
  );
};
