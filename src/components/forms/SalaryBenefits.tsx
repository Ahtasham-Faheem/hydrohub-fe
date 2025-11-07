import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export const SalaryBenefits = () => {
  const [formData, setFormData] = useState({
    basicSalary: "",
    allowances: "",
    providentFund: "",
    salaryPaymentMode: "",
    bankName: "",
    bankAccountTitle: "",
    bankAccountNumber: "",
    taxStatus: "",
  });

  const handleInputChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    };

  const handleSelectChange =
    (name: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value as string,
      }));
    };

  return (
    <Stack spacing={3}>
      {/* Basic Salary + Allowances */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Basic Salary"
          value={formData.basicSalary}
          onChange={handleInputChange("basicSalary")}
          placeholder="50000"
        />
        <TextField
          fullWidth
          label="Allowances"
          value={formData.allowances}
          onChange={handleInputChange("allowances")}
          placeholder="Travel, Medical"
        />
      </Stack>

      {/* Provident Fund + Salary Payment Mode */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Provident Fund"
          value={formData.providentFund}
          onChange={handleInputChange("providentFund")}
          placeholder="5% of Salary"
        />
        <FormControl fullWidth>
          <InputLabel>Salary Payment Mode</InputLabel>
          <Select
            label="Salary Payment Mode"
            value={formData.salaryPaymentMode}
            onChange={()=>handleSelectChange("salaryPaymentMode")}
          >
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Bank Name + Account Title */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Bank Name"
          value={formData.bankName}
          onChange={handleInputChange("bankName")}
          placeholder="HBL Bank"
        />
        <TextField
          fullWidth
          label="Bank Account Title"
          value={formData.bankAccountTitle}
          onChange={handleInputChange("bankAccountTitle")}
          placeholder="John Doe"
        />
      </Stack>

      {/* Bank Account Number + Tax Status */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Bank Account Number"
          value={formData.bankAccountNumber}
          onChange={handleInputChange("bankAccountNumber")}
          placeholder="PK00HABB000123456789"
        />
        <FormControl fullWidth>
          <InputLabel>Tax Status</InputLabel>
          <Select
            label="Tax Status"
            value={formData.taxStatus}
            onChange={()=>handleSelectChange("taxStatus")}
          >
            <MenuItem value="Taxable">Taxable</MenuItem>
            <MenuItem value="Non-Taxable">Non-Taxable</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
};
