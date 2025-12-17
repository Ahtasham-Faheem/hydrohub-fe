import { Box, Typography } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { PhoneInput } from "../common/PhoneInput";
import { CNICInput } from "../common/CNICInput";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import type { DomesticCustomer } from "../../types/customer";
import dayjs from "dayjs";

export const DomesticStep2PersonalInfo = () => {
  const { state, updateFormData, fieldErrors, setFieldErrors } = useCustomerForm();
  const data = (state?.data || {}) as DomesticCustomer;

  const handlePhoneChange = (field: string, value: string) => {
    // PhoneInput component already adds +92 prefix, so just use the value as-is
    updateFormData(field, value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Personal Details */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: "#374151" }}
        >
          Personal Details
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Father's Name"
              placeholder="Enter name"
              value={data.fatherHusbandName || ""}
              error={fieldErrors['fatherHusbandName']}
              onChange={(e) =>
                updateFormData("fatherHusbandName", e.target.value)
              }
            />
            <CustomInput
              label="Mother's Name"
              placeholder="Enter name"
              value={data.motherName || ""}
              error={fieldErrors['motherName']}
              onChange={(e) => updateFormData("motherName", e.target.value)}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomDateInput
              label="Date of Birth *"
              value={data.dateOfBirth ? dayjs(data.dateOfBirth) : null}
              onChange={(date) => updateFormData("dateOfBirth", date ? date.format("YYYY-MM-DD") : "")}
              error={fieldErrors['dateOfBirth']}
            />
            <CustomSelect
              label="Nationality"
              value={data.nationality || "Pakistani"}
              onChange={(e) => updateFormData("nationality", e.target.value)}
              error={fieldErrors['nationality']}
              options={[
                { label: "Pakistani", value: "Pakistani" },
              ]}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CNICInput
              label="National ID Number (CNIC)"
              value={data.cnicNumber || ""}
              onChange={(value) => updateFormData("cnicNumber", value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, cnicNumber: "" })}
              error={fieldErrors['cnicNumber']}
              required
            />
            <CustomSelect
              label="Gender *"
              value={data.gender || ""}
              onChange={(e) => updateFormData("gender", e.target.value)}
              error={fieldErrors['gender']}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomSelect
              label="Marital Status *"
              value={data.maritalStatus || ""}
              onChange={(e) => updateFormData("maritalStatus", e.target.value)}
              error={fieldErrors['maritalStatus']}
              options={[
                { label: "Single", value: "Single" },
                { label: "Married", value: "Married" }
              ]}
            />
            <PhoneInput
              label="Alternate Contact Number"
              value={data.alternateContactNumber || ""}
              onChange={(value) => handlePhoneChange("alternateContactNumber", value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, alternateContactNumber: "" })}
              error={fieldErrors['alternateContactNumber']}
            />
          </Box>
        </Box>
      </Box>

      {/* Address Information */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: "#374151" }}
        >
          Address Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <CustomInput
            label="Present Address"
            placeholder="Enter present address"
            value={data.presentAddress || ""}
            onChange={(e) => updateFormData("presentAddress", e.target.value)}
            multiline
            rows={2}
          />
          <CustomInput
            label="Permanent Address"
            placeholder="Enter permanent address"
            value={data.permanentAddress || ""}
            onChange={(e) => updateFormData("permanentAddress", e.target.value)}
            multiline
            rows={2}
          />
        </Box>
      </Box>

      {/* Emergency Contact Information */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: "#374151" }}
        >
          Emergency Contact Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Emergency Contact Name"
              placeholder="Enter name"
              value={data.emergencyContactName || ""}
              error={fieldErrors['emergencyContactName']}
              onChange={(e) =>
                updateFormData("emergencyContactName", e.target.value)
              }
            />
            <CustomSelect
              label="Relation"
              value={data.emergencyContactRelation || ""}
              onChange={(e) => updateFormData("emergencyContactRelation", e.target.value)}
              error={fieldErrors['emergencyContactRelation']}
              options={[
                { label: "Father", value: "Father" },
                { label: "Mother", value: "Mother" },
                { label: "Brother", value: "Brother" }
              ]}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <PhoneInput
              label="Emergency Contact Number *"
              value={data.emergencyContactNumber || ""}
              onChange={(value) => handlePhoneChange("emergencyContactNumber", value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, emergencyContactNumber: "" })}
              error={fieldErrors['emergencyContactNumber']}
              required
            />
            <PhoneInput
              label="Alternate Emergency Contact"
              value={data.alternateEmergencyContact || ""}
              onChange={(value) => handlePhoneChange("alternateEmergencyContact", value)}
              onClearError={() => setFieldErrors({ ...fieldErrors, alternateEmergencyContact: "" })}
              error={fieldErrors['alternateEmergencyContact']}
            />
          </Box>

          <CustomSelect
            label="Preferred Contact Method"
            value={data.preferredContactMethod || ""}
            onChange={(e) =>
              updateFormData("preferredContactMethod", e.target.value)
            }
            options={[
              { label: "WhatsApp", value: "whatsapp" },
              { label: "Phone Call", value: "phone" },
              { label: "SMS", value: "sms" },
              { label: "Email", value: "email" },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};
