// components/SecondaryButton.tsx
import { Button } from "@mui/material";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: any;
}

export const SecondaryButton = ({
  children,
  onClick,
  type = "button",
  fullWidth = false,
  disabled = false,
  size = "medium",
  className,
  startIcon,
  endIcon,
  sx = {},
}: SecondaryButtonProps) => {
  const defaultSx = {
    py: 1,
    borderRadius: 2,
    fontSize: 16,
    fontWeight: 600,
    color: "var(--color-primary-600)",
    borderColor: "var(--color-primary-600)",
    textTransform: "none",
    px: 4,
    "&:hover": { 
      borderColor: "#187bcd",
      color: "#187bcd",
      backgroundColor: "rgba(32, 146, 236, 0.04)",
    },
  };

  return (
    <Button
      type={type}
      variant="outlined"
      fullWidth={fullWidth}
      disabled={disabled}
      size={size}
      onClick={onClick}
      className={className}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        ...defaultSx,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};
