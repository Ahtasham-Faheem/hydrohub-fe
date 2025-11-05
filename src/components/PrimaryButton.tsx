// components/PrimaryButton.tsx
import { Button } from "@mui/material";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const PrimaryButton = ({
  children,
  onClick,
  type = "button",
  fullWidth = false,
  disabled = false,
  size = "medium",
  className,
  startIcon,
  endIcon,
}: PrimaryButtonProps) => {
  return (
    <Button
      type={type}
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled}
      size={size}
      onClick={onClick}
      className={className}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        py: 1,
        borderRadius: 2,
        fontSize: 16,
        fontWeight: 600,
        bgcolor: "#2092ec",
        textTransform: "none",
        px: 4,
        "&:hover": { bgcolor: "#187bcd" },
      }}
    >
      {children}
    </Button>
  );
};
