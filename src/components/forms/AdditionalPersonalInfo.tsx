import { Stack, Box } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { useFormContext } from "../../contexts/FormContext";
import { useState } from "react";
import { Phone } from "@mui/icons-material";

export const AdditionalPersonalInfo = () => {
  const { formData, updateFormData } = useFormContext();
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
        />
        <CustomInput
          label="Mother's Name"
          placeholder="Mary Doe"
          value={formData.mothersName || ""}
          onChange={(e) => updateFormData("mothersName", e.target.value)}
        />
        <CustomDateInput
          label="Date of Birth"
          value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
          onChange={(date) =>
            updateFormData("dateOfBirth", date ? date.format("YYYY-MM-DD") : "")
          }
        />
      </Stack>

      {/* Nationality + National ID + Gender */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Nationality"
          placeholder="e.g., Pakistani"
          value={formData.nationality || ""}
          onChange={(e) => updateFormData("nationality", e.target.value)}
        />
        <CustomInput
          label="National ID"
          placeholder="12345-6789012-3"
          value={formData.nationalId || ""}
          onChange={(e) => updateFormData("nationalId", e.target.value)}
        />
        <CustomSelect
          label="Gender"
          value={formData.gender || ""}
          onChange={(e) => updateFormData("gender", e.target.value)}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
      </Stack>

      {/* Marital Status + Alternate Contact Number + Secondary Email Address */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Marital Status"
          value={formData.maritalStatus || ""}
          onChange={(e) => updateFormData("maritalStatus", e.target.value)}
          options={[
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
            { value: "Divorced", label: "Divorced" },
            { value: "Widowed", label: "Widowed" },
          ]}
        />
        <CustomInput
          label="Alternate Contact Number"
          placeholder="0555 7938"
          value={formData.alternateContactNumber || ""}
          onChange={(e) =>
            updateFormData("alternateContactNumber", e.target.value)
          }
          startAdornment={
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none"
              >
                <option value="+92">PK +92</option>
                <option value="+91">IN +91</option>
                <option value="+1">US +1</option>
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
          onChange={(e) =>
            updateFormData("secondaryEmailAddress", e.target.value)
          }
        />
      </Stack>

      {/* Present Address + Permanent Address */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Present Address"
          placeholder="House 10, Block A, Lahore"
          value={formData.presentAddress || ""}
          onChange={(e) => updateFormData("presentAddress", e.target.value)}
        />
        <CustomInput
          label="Permanent Address"
          placeholder="House 20, Model Town, Lahore"
          value={formData.permanentAddress || ""}
          onChange={(e) => updateFormData("permanentAddress", e.target.value)}
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
        />
        <CustomInput
          label="Emergency Contact Relation"
          placeholder="e.g., Brother, Friend"
          value={formData.emergencyContactRelation || ""}
          onChange={(e) =>
            updateFormData("emergencyContactRelation", e.target.value)
          }
        />
        <CustomInput
          label="Emergency Contact Number"
          placeholder="+92 345 5678786"
          value={formData.emergencyContactNumber || ""}
          onChange={(e) =>
            updateFormData("emergencyContactNumber", e.target.value)
          }
          startAdornment={
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none"
              >
                <option value="+92">PK +92</option>
                <option value="+91">IN +91</option>
                <option value="+1">US +1</option>
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
