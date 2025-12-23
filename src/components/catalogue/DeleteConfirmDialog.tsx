import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeleteConfirmDialogProps) => {
  const { colors } = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.lg,
          },
        },
      }}
    >
      <DialogTitle sx={{ color: colors.text.primary }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: colors.text.primary }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.background.secondary }}>
        <Button onClick={onClose} sx={{ color: colors.text.secondary }}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          sx={{
            backgroundColor: colors.status.error,
            '&:hover': {
              backgroundColor: colors.status.error,
              opacity: 0.8,
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};