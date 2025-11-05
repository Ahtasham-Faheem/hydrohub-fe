import { Stack } from "@mui/material";
import { CustomInput } from "../CustomInput";
import { CustomSelect } from "../CustomSelect";
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";

const relationOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "spouse", label: "Spouse" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

export const ContactInformation = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    alternateContact: "",
    personalEmail: "",
    officialEmail: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContactName: "",
    emergencyContactTitle: "mr",
    emergencyContactRelation: "other",
    emergencyContactNumber: "",
  });

  const handleInputChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string) => (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleInputChange("mobileNumber")}
          placeholder="+92 302 66 48 100"
          size='medium'
        />
        <CustomInput
          label="Alternate Contact"
          value={formData.alternateContact}
          onChange={handleInputChange("alternateContact")}
          placeholder="0555 7936"
          size='medium'
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Personal Email"
          type="email"
          value={formData.personalEmail}
          onChange={handleInputChange("personalEmail")}
          size='medium'
          placeholder="john.doe@example.com"
        />
        <CustomInput
          label="Official Email"
          type="email"
          value={formData.officialEmail}
          onChange={handleInputChange("officialEmail")}
          size='medium'
          placeholder="john.doe@company.com"
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Present Address"
          value={formData.presentAddress}
          onChange={handleInputChange("presentAddress")}
          placeholder="Enter present address"
          size='medium'
        />
        <CustomInput
          label="Permanent Address"
          value={formData.permanentAddress}
          onChange={handleInputChange("permanentAddress")}
          placeholder="Enter permanent address"
          size='medium'
        />
      </Stack>

      <Stack direction="row" spacing={2}>
          <CustomInput
            label="Emergency Contact Name"
            value={formData.emergencyContactName}
            onChange={handleInputChange("emergencyContactName")}
            placeholder="Enter emergency contact name"
            size='medium'
          />
          <CustomSelect
          label="Emergency Contact Relation"
          value={formData.emergencyContactRelation}
          onChange={handleSelectChange("emergencyContactRelation")}
          options={relationOptions}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Emergency Contact Number"
          value={formData.emergencyContactNumber}
          onChange={handleInputChange("emergencyContactNumber")}
          placeholder="+92 302 66 48 100"
          size='medium'
        />
        <div className="w-full"></div>
      </Stack>
    </Stack>
  );
};