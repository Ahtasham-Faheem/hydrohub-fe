import {
  Stack,
} from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";

export const SalaryBenefits = () => {
  const { formData, updateFormData, fieldErrors, setFieldErrors } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Basic Salary + Allowances + Provident Fund */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Basic Salary"
          type="number"
          placeholder="50000"
          value={formData.basicSalary || ''}
          onChange={(e) => updateFormData('basicSalary', e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, basicSalary: "" })}
          error={fieldErrors['basicSalary']}
        />
        <CustomInput
          label="Allowances"
          placeholder="Transport: 5000, Medical: 3000, Food: 2000"
          value={formData.allowances || ''}
          onChange={(e) => updateFormData('allowances', e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, allowances: "" })}
          error={fieldErrors['allowances']}
        />
        <CustomInput
          label="Provident Fund"
          type="number"
          placeholder="0-99"
          value={formData.providentFund || ''}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numeric input, max 2 digits (0-99)
            if (value === '' || /^\d{1,2}$/.test(value)) {
              const numValue = value ? parseInt(value) : 0;
              if (numValue <= 99) {
                updateFormData('providentFund', value);
                // Clear error when user starts typing
                if (fieldErrors['providentFund']) {
                  setFieldErrors({ ...fieldErrors, providentFund: "" });
                }
              }
            }
          }}
          error={fieldErrors['providentFund']}
        />
      </Stack>

      {/* Salary Payment Mode + Bank Name + Bank Account Title */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Salary Payment Mode"
          value={formData.salaryPaymentMode || ''}
          onChange={(e) => {
            updateFormData('salaryPaymentMode', e.target.value);
            // Clear error when user selects
            if (fieldErrors['salaryPaymentMode']) {
              setFieldErrors({ ...fieldErrors, salaryPaymentMode: "" });
            }
          }}
          error={fieldErrors['salaryPaymentMode']}
          options={[
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "cash", label: "Cash" },
          ]}
        />
        <CustomInput
          label="Bank Name"
          placeholder="HBL Bank"
          value={formData.bankName || ''}
          onChange={(e) => updateFormData('bankName', e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, bankName: "" })}
          error={fieldErrors['bankName']}
        />
        <CustomInput
          label="Bank Account Title"
          placeholder="John Doe"
          value={formData.bankAccountTitle || ''}
          onChange={(e) => updateFormData('bankAccountTitle', e.target.value)}
          onClearError={() => setFieldErrors({ ...fieldErrors, bankAccountTitle: "" })}
          error={fieldErrors['bankAccountTitle']}
        />
      </Stack>

      {/* Bank Account Number + Tax Status */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Bank Account Number"
          placeholder="1234567890123456"
          value={formData.bankAccountNumber || ''}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 16);
            updateFormData('bankAccountNumber', value);
            // Clear error when user starts typing
            if (fieldErrors['bankAccountNumber']) {
              setFieldErrors({ ...fieldErrors, bankAccountNumber: "" });
            }
          }}
          error={fieldErrors['bankAccountNumber']}
        />
        <CustomSelect
          label="Tax Status"
          value={formData.taxStatus || ''}
          onChange={(e) => {
            updateFormData('taxStatus', e.target.value);
            // Clear error when user selects
            if (fieldErrors['taxStatus']) {
              setFieldErrors({ ...fieldErrors, taxStatus: "" });
            }
          }}
          error={fieldErrors['taxStatus']}
          options={[
            { value: "Taxable", label: "Taxable" },
            { value: "Non-Taxable", label: "Non-Taxable" },
          ]}
        />
      </Stack>
    </Stack>
  );
};
