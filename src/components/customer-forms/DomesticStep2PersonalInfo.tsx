import { Box, Typography } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import type { DomesticCustomer } from "../../types/customer";
import dayjs from "dayjs";
import { useState } from "react";
import { Phone } from "@mui/icons-material";

export const DomesticStep2PersonalInfo = () => {
  const { state, updateFormData, fieldErrors } = useCustomerForm();
  const data = (state?.data || {}) as DomesticCustomer;
  const [countryCode, setCountryCode] = useState("+92");

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
              onChange={(e) =>
                updateFormData("fatherHusbandName", e.target.value)
              }
            />
            <CustomInput
              label="Mother's Name"
              placeholder="Enter name"
              value={data.motherName || ""}
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
            <CustomInput
              label="National ID Number (CNIC)"
              placeholder="1234567890123"
              value={data.cnicNumber || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                updateFormData("cnicNumber", value);
              }}
              error={fieldErrors['cnicNumber']}
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
            <Box>
              <CustomInput
                label="Alternate Contact Number"
                value={data.alternateContactNumber || ""}
                onChange={(e) => updateFormData("alternateContactNumber", e.target.value)}
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
            </Box>
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
            <Box>
              <CustomInput
                label="Emergency Contact Number"
                value={data.emergencyContactNumber || ""}
                onChange={(e) => updateFormData("emergencyContactNumber", e.target.value)}
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
            </Box>
            <Box>
              <CustomInput
                label="Alternate Emergency Contact"
                value={data.alternateEmergencyContact || ""}
                onChange={(e) => updateFormData("alternateEmergencyContact", e.target.value)}
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
            </Box>
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
