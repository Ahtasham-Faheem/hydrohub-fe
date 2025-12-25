import { Stack } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";

export const SalaryBenefits = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } =
    useFormContext();

  // Check if payment mode is cash to disable bank fields
  const isCashPayment = formData.salaryPaymentMode === "cash";

  return (
    <Stack spacing={3}>
      {/* Basic Salary + Allowances + Provident Fund */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Basic Salary"
          type="number"
          placeholder="50000"
          value={formData.basicSalary || ""}
          onChange={(e) => {
            const value = e.target.value;
            // Allow empty value or valid numbers up to 1 crore (10,000,000)
            if (
              value === "" ||
              (!isNaN(Number(value)) && Number(value) <= 10000000)
            ) {
              updateFormData("basicSalary", value);
              // Clear error when user starts typing
              if (fieldErrors["basicSalary"]) {
                setFieldErrors({ ...fieldErrors, basicSalary: "" });
              }
            }
          }}
          onClearError={() =>
            setFieldErrors({ ...fieldErrors, basicSalary: "" })
          }
          error={fieldErrors["basicSalary"]}
        />
        <CustomInput
          label="Allowances"
          placeholder="Transport: 5000, Medical: 3000, Food: 2000"
          value={formData.allowances || ""}
          onChange={(e) => updateFormData("allowances", e.target.value)}
          onClearError={() =>
            setFieldErrors({ ...fieldErrors, allowances: "" })
          }
          error={fieldErrors["allowances"]}
        />
        <CustomInput
          label="Provident Fund %"
          type="number"
          placeholder="0-99%"
          value={formData.providentFund || ""}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numeric input, max 2 digits (0-99)
            if (value === "" || /^\d{1,2}$/.test(value)) {
              const numValue = value ? parseInt(value) : 0;
              if (numValue <= 99) {
                updateFormData("providentFund", value);
                // Clear error when user starts typing
                if (fieldErrors["providentFund"]) {
                  setFieldErrors({ ...fieldErrors, providentFund: "" });
                }
              }
            }
          }}
          error={fieldErrors["providentFund"]}
        />
      </Stack>

      {/* Salary Payment Mode + Bank Name + Bank Account Title */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Salary Payment Mode"
          value={formData.salaryPaymentMode || ""}
          onChange={(e) => {
            const paymentMode = e.target.value;
            console.log("Payment mode selected:", paymentMode);
            console.log("Current formData.salaryPaymentMode:", formData.salaryPaymentMode);

            // Clear bank fields when cash is selected - do this first before updating payment mode
            if (paymentMode === "cash") {
              console.log("Clearing bank fields for cash payment");
              // Clear any validation errors for bank fields
              const newFieldErrors = { ...fieldErrors };
              delete newFieldErrors.bankName;
              delete newFieldErrors.bankAccountTitle;
              delete newFieldErrors.bankAccountNumber;
              delete newFieldErrors.salaryPaymentMode;
              setFieldErrors(newFieldErrors);
            } else {
              // Clear error when user selects
              if (fieldErrors["salaryPaymentMode"]) {
                const updatedErrors = { ...fieldErrors };
                delete updatedErrors.salaryPaymentMode;
                setFieldErrors(updatedErrors);
              }
            }

            // Update payment mode - this should be the only updateFormData call
            updateFormData("salaryPaymentMode", paymentMode);
          }}
          error={fieldErrors["salaryPaymentMode"]}
          options={[
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "cash", label: "Cash" },
          ]}
        />
        {!isCashPayment && (
          <>
            <CustomInput
              label="Bank Name"
              placeholder="HBL Bank"
              value={formData.bankName || ""}
              onChange={(e) => updateFormData("bankName", e.target.value)}
              onClearError={() =>
                setFieldErrors({ ...fieldErrors, bankName: "" })
              }
              error={fieldErrors["bankName"]}
            />
            <CustomInput
              label="Bank Account Title"
              placeholder="John Doe"
              value={formData.bankAccountTitle || ""}
              onChange={(e) =>
                updateFormData("bankAccountTitle", e.target.value)
              }
              onClearError={() =>
                setFieldErrors({ ...fieldErrors, bankAccountTitle: "" })
              }
              error={fieldErrors["bankAccountTitle"]}
            />
          </>
        )}
      </Stack>

      {/* Bank Account Number + Tax Status */}
      <Stack direction="row" spacing={2}>
        {!isCashPayment && (
          <CustomInput
            label="Bank Account Number"
            placeholder="1234567890123456 or PK36SCBL0000001123456702"
            value={formData.bankAccountNumber || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, "").toUpperCase().slice(0, 24); // Remove spaces, convert to uppercase, and limit to 24 chars
              updateFormData("bankAccountNumber", value);
              // Clear error when user starts typing
              if (fieldErrors["bankAccountNumber"]) {
                setFieldErrors({ ...fieldErrors, bankAccountNumber: "" });
              }
            }}
            error={fieldErrors["bankAccountNumber"]}
          />
        )}
        <CustomSelect
          label="Tax Status"
          value={formData.taxStatus || ""}
          onChange={(e) => {
            updateFormData("taxStatus", e.target.value);
            // Clear error when user selects
            if (fieldErrors["taxStatus"]) {
              setFieldErrors({ ...fieldErrors, taxStatus: "" });
            }
          }}
          error={fieldErrors["taxStatus"]}
          options={[
            { value: "Taxable", label: "Taxable" },
            { value: "Non-Taxable", label: "Non-Taxable" },
          ]}
        />
      </Stack>
    </Stack>
  );
};
