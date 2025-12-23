import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";
import type { CatalogueItem } from "../../types/catalogue";

interface ProductViewDialogProps {
  open: boolean;
  onClose: () => void;
  item: CatalogueItem | null;
  onEdit: (item: CatalogueItem) => void;
}

export const ProductViewDialog = ({
  open,
  onClose,
  item,
  onEdit,
}: ProductViewDialogProps) => {
  const { colors } = useTheme();

  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
      <DialogTitle sx={{ fontWeight: 700, color: colors.text.primary }}>
        {item.name}
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: colors.border.primary }}>
        {item.mainImage && (
          <Box
            component="img"
            src={item.mainImage}
            sx={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              borderRadius: 1,
              mb: 2,
            }}
          />
        )}
        <Typography variant="body2" sx={{ mb: 1, color: colors.text.primary }}>
          <strong>Category:</strong> {typeof item.category === 'object' && item.category && 'name' in item.category ? item.category.name : item.category}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: colors.text.primary }}>
          <strong>SKU:</strong> {item.sku}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: colors.text.primary }}>
          <strong>Price:</strong>{" "}
          {Number(item.salePrice || item.sellingPrice).toLocaleString()} PKR
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: colors.text.primary }}>
          <strong>Stock:</strong> {item.currentStock}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: colors.text.primary }}>
          <strong>Description:</strong> {item.description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.background.secondary }}>
        <Button onClick={onClose} sx={{ color: colors.text.secondary }}>
          Close
        </Button>
        <Button
          onClick={() => onEdit(item)}
          variant="contained"
          sx={{
            backgroundColor: colors.primary[600],
            '&:hover': { backgroundColor: colors.primary[700] },
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};