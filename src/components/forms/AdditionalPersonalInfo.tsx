import { Stack, Box } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { useFormContext } from "../../contexts/FormContext";
import { useState } from "react";
import { Phone } from "@mui/icons-material";

export const AdditionalPersonalInfo = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } = useFormContext();
  const [countryCode, setCountryCode] = useState("+92");

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
        <CustomInput
          label="National ID"
          placeholder="12345-6789012-3"
          value={formData.nationalId || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 13);
            updateFormData("nationalId", value);
          }}
          error={fieldErrors['nationalId']}
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
        <CustomInput
          label="Alternate Contact Number"
          placeholder="0555 7938"
          value={formData.alternateContactNumber || ""}
          onChange={(e) =>
            updateFormData("alternateContactNumber", e.target.value)
          }
          error={fieldErrors['alternateContactNumber']}
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
        <CustomInput
          label="Emergency Contact Number"
          placeholder="+92 345 5678786"
          value={formData.emergencyContactNumber || ""}
          onChange={(e) =>
            updateFormData("emergencyContactNumber", e.target.value)
          }
          error={fieldErrors['emergencyContactNumber']}
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
    </Stack>
  );
};
