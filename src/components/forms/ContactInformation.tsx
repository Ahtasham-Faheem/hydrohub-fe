import { Stack } from "@mui/material";
import { CustomInput } from "../CustomInput";
import { useFormContext } from "../../contexts/FormContext";

export const ContactInformation = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Secondary Contact + Secondary Email Address + Present Address */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Secondary Contact"
          placeholder="03001234567"
          value={formData.phone || ''}
          onChange={(e) => updateFormData('phone', e.target.value)}
        />
        <CustomInput
          label="Secondary Email Address"
          type="email"
          placeholder="john@gmail.com"
          value={formData.secondaryEmail || ''}
          onChange={(e) => updateFormData('secondaryEmail', e.target.value)}
        />
        <CustomInput
          label="Present Address"
          placeholder="House 10, Block A, Lahore"
          value={formData.presentAddress || ''}
          onChange={(e) => updateFormData('presentAddress', e.target.value)}
        />
      </Stack>

      {/* Permanent Address + Emergency Contact Name + Emergency Contact Relation */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Permanent Address"
          placeholder="House 20, Model Town, Lahore"
          value={formData.permanentAddress || ''}
          onChange={(e) => updateFormData('permanentAddress', e.target.value)}
        />
        <CustomInput
          label="Emergency Contact Name"
          placeholder="Jane Doe"
          value={formData.emergencyContactName || ''}
          onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
        />
        <CustomInput
          label="Emergency Contact Relation"
          placeholder="e.g., Brother, Friend"
          value={formData.emergencyContactRelation || ''}
          onChange={(e) => updateFormData('emergencyContactRelation', e.target.value)}
        />
      </Stack>

      {/* Emergency Contact Number + Alternate Contact Number */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Emergency Contact Number"
          placeholder="+92 345 5678786"
          value={formData.emergencyContactNumber || ''}
          onChange={(e) => updateFormData('emergencyContactNumber', e.target.value)}
        />
        <CustomInput
          label="Alternate Contact Number"
          placeholder="0555 7938"
          value={formData.alternateContactNumber || ''}
          onChange={(e) => updateFormData('alternateContactNumber', e.target.value)}
        />
      </Stack>
    </Stack>
  );
};
