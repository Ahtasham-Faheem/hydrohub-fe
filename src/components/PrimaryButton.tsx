// components/PrimaryButton.tsx
import { Button } from "@mui/material";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export const PrimaryButton = ({
  children,
  onClick,
  type = "button",
  fullWidth = false,
  disabled = false,
  size = "medium",
}: PrimaryButtonProps) => {
  return (
    <Button
      type={type}
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled}
      size={size}
      onClick={onClick}
      sx={{
        py: 1,
        borderRadius: 2,
        fontSize: 16,
        fontWeight: 600,
        bgcolor: "#2092ec",
        textTransform: "none",
        "&:hover": { bgcolor: "#187bcd" },
      }}
    >
      {children}
    </Button>
  );
};
