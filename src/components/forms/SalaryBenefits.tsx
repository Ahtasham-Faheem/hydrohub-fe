import { Stack } from "@mui/material";
import { CustomInput } from "../CustomInput";
import { CustomSelect } from "../CustomSelect";
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";

const salaryPaymentModeOptions = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "cash", label: "Cash" },
];

const accountTypeOptions = [
  { value: "savings", label: "Savings" },
  { value: "current", label: "Current" },
  { value: "salary", label: "Salary Account" },
];

export const SalaryBenefits = () => {
  const [formData, setFormData] = useState({
    basicSalary: "",
    allowances: "",
    providentFund: "",
    salaryPaymentMode: "",
    bankName: "",
    bankAccountTitle: "",
    bankAccountNumber: "",
    bankStatus: "",
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
          label="Basic Salary"
          value={formData.basicSalary}
          onChange={handleInputChange("basicSalary")}
          placeholder="Enter basic salary"
          size="medium"
          startAdornment="$"
        />
        <CustomInput
          label="Allowances"
          value={formData.allowances}
          onChange={handleInputChange("allowances")}
          placeholder="Enter allowances"
          size="medium"
          startAdornment="$"
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Provident Fund"
          value={formData.providentFund}
          onChange={handleInputChange("providentFund")}
          placeholder="Enter provident fund"
          size="medium"
          startAdornment="$"
        />
        <CustomSelect
          label="Salary Payment Mode"
          value={formData.salaryPaymentMode}
          onChange={handleSelectChange("salaryPaymentMode")}
          options={salaryPaymentModeOptions}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Bank Name"
          value={formData.bankName}
          onChange={handleInputChange("bankName")}
          placeholder="Enter bank name"
          size="medium"
        />
        <CustomInput
          label="Bank Account Title"
          value={formData.bankAccountTitle}
          onChange={handleInputChange("bankAccountTitle")}
          placeholder="Enter account title"
          size="medium"
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Bank Account Number"
          value={formData.bankAccountNumber}
          onChange={handleInputChange("bankAccountNumber")}
          placeholder="Enter account number"
          size="medium"
        />
        <CustomSelect
          label="Bank Account Type"
          value={formData.bankStatus}
          onChange={handleSelectChange("bankStatus")}
          options={accountTypeOptions}
        />
      </Stack>
    </Stack>
  );
};