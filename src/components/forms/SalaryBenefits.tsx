import {
  Stack,
} from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { useFormContext } from "../../contexts/FormContext";

export const SalaryBenefits = () => {
  const { formData, updateFormData } = useFormContext();

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
        />
        <CustomInput
          label="Allowances"
          placeholder="Transport: 5000, Medical: 3000, Food: 2000"
          value={formData.allowances || ''}
          onChange={(e) => updateFormData('allowances', e.target.value)}
        />
        <CustomInput
          label="Provident Fund"
          type="number"
          placeholder="e.g., 3%, 6%"
          value={formData.providentFund || ''}
          onChange={(e) => updateFormData('providentFund', e.target.value)}
        />
      </Stack>

      {/* Salary Payment Mode + Bank Name + Bank Account Title */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Salary Payment Mode"
          value={formData.salaryPaymentMode || ''}
          onChange={(e) => updateFormData('salaryPaymentMode', e.target.value)}
          options={[
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "cash", label: "Cash" },
            { value: "other", label: "Other" },
          ]}
        />
        <CustomInput
          label="Bank Name"
          placeholder="HBL Bank"
          value={formData.bankName || ''}
          onChange={(e) => updateFormData('bankName', e.target.value)}
        />
        <CustomInput
          label="Bank Account Title"
          placeholder="John Doe"
          value={formData.bankAccountTitle || ''}
          onChange={(e) => updateFormData('bankAccountTitle', e.target.value)}
        />
      </Stack>

      {/* Bank Account Number + Tax Status */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Bank Account Number"
          placeholder="PK00HABB000123456789"
          value={formData.bankAccountNumber || ''}
          onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
        />
        <CustomSelect
          label="Tax Status"
          value={formData.taxStatus || ''}
          onChange={(e) => updateFormData('taxStatus', e.target.value)}
          options={[
            { value: "Taxable", label: "Taxable" },
            { value: "Non-Taxable", label: "Non-Taxable" },
          ]}
        />
      </Stack>
    </Stack>
  );
};
