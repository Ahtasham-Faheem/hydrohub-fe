import { Checkbox, FormControlLabel } from "@mui/material";

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CustomCheckbox = ({
  label,
  checked,
  onChange,
}: CustomCheckboxProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          size="small"
        />
      }
      label={label}
    />
  );
};
