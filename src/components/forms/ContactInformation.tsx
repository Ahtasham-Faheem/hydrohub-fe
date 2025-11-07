import { Stack, TextField } from "@mui/material";
import { useState } from "react";

export const ContactInformation = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    alternateContact: "",
    personalEmail: "",
    officialEmail: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContactRelation: "",
  });

  const handleInputChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  return (
    <Stack spacing={3}>
      {/* Mobile + Alternate Contact */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleInputChange("mobileNumber")}
          placeholder="+92 302 6648100"
          InputProps={{ readOnly: true }}
          helperText="View only"
        />
        <TextField
          fullWidth
          label="Alternate Contact"
          value={formData.alternateContact}
          onChange={handleInputChange("alternateContact")}
          placeholder="0555 7938"
        />
      </Stack>

      {/* Personal + Official Email */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Personal Email"
          value={formData.personalEmail}
          onChange={handleInputChange("personalEmail")}
          placeholder="john.doe@gmail.com"
          type="email"
          InputProps={{ readOnly: true }}
          helperText="View only"
        />
        <TextField
          fullWidth
          label="Official Email"
          value={formData.officialEmail}
          onChange={handleInputChange("officialEmail")}
          placeholder="john.doe@waterinn.com"
          type="email"
        />
      </Stack>

      {/* Present + Permanent Address */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Present Address"
          value={formData.presentAddress}
          onChange={handleInputChange("presentAddress")}
          placeholder="House 10, Block A, Lahore"
        />
        <TextField
          fullWidth
          label="Permanent Address"
          value={formData.permanentAddress}
          onChange={handleInputChange("permanentAddress")}
          placeholder="House 20, Model Town, Lahore"
        />
      </Stack>

      {/* Emergency Contact Name + Number */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Emergency Contact Name"
          value={formData.emergencyContactName}
          onChange={handleInputChange("emergencyContactName")}
          placeholder="Jane Doe"
        />
        <TextField
          fullWidth
          label="Emergency Contact Number"
          value={formData.emergencyContactNumber}
          onChange={handleInputChange("emergencyContactNumber")}
          placeholder="+92 345 5678786"
        />
      </Stack>

      {/* Emergency Contact Relation */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Emergency Contact Relation"
          value={formData.emergencyContactRelation}
          onChange={handleInputChange("emergencyContactRelation")}
          placeholder="Sister"
        />
        <div className="w-full"></div>
      </Stack>
    </Stack>
  );
};
