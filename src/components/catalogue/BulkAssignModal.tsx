import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { useTheme } from "../../contexts/ThemeContext";
import type { CatalogueItem } from "../../types/catalogue";

interface BulkAssignModalProps {
  open: boolean;
  onClose: () => void;
  mode: "category" | "collection";
  step: number;
  newName: string;
  onNameChange: (name: string) => void;
  selectedItems: Set<string>;
  onToggleItem: (itemId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  items: CatalogueItem[];
  onNext: () => void;
  onBack: () => void;
  onApply: () => void;
}

export const BulkAssignModal = ({
  open,
  onClose,
  mode,
  step,
  newName,
  onNameChange,
  selectedItems,
  onToggleItem,
  onSelectAll,
  onClearAll,
  items,
  onNext,
  onBack,
  onApply,
}: BulkAssignModalProps) => {
  const { colors } = useTheme();

  return (
    <>
      {/* Step 1: Enter Name */}
      <Dialog
        open={open && step === 1}
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
        <DialogTitle sx={{ color: colors.text.primary }}>
          {mode === "category" ? "Create New Category" : "Create New Collection"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: colors.text.secondary }}>
            Enter a new {mode} name and proceed to assign it to existing items.
          </Typography>
          <CustomInput
            fullWidth
            label={mode === "category" ? "Category Name" : "Collection Name"}
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={
              mode === "category" ? "e.g., Alkaline Water" : "e.g., Premium Pack"
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.secondary }}>
          <Button onClick={onClose} sx={{ color: colors.text.secondary }}>
            Cancel
          </Button>
          <Button 
            onClick={onNext} 
            variant="contained"
            sx={{
              backgroundColor: colors.primary[600],
              '&:hover': { backgroundColor: colors.primary[700] },
            }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>

      {/* Step 2: Select Items */}
      <Dialog
        open={open && step === 2}
        onClose={onClose}
        maxWidth="md"
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
        <DialogTitle sx={{ color: colors.text.primary }}>
          Select Items to Assign {mode === "category" ? "Category" : "Collection"}: {newName}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: colors.border.primary }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={onSelectAll}
              sx={{
                color: colors.text.primary,
                borderColor: colors.border.primary,
                '&:hover': {
                  borderColor: colors.primary[600],
                  backgroundColor: colors.background.secondary,
                },
              }}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onClearAll}
              sx={{
                color: colors.text.primary,
                borderColor: colors.border.primary,
                '&:hover': {
                  borderColor: colors.primary[600],
                  backgroundColor: colors.background.secondary,
                },
              }}
            >
              Clear All
            </Button>
            <Typography variant="body2" sx={{ ml: "auto", color: colors.text.primary }}>
              {selectedItems.size} selected
            </Typography>
          </Stack>

          <FormGroup>
            {items.map((item) => (
              <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={() => onToggleItem(item.id)}
                    sx={{
                      color: colors.text.secondary,
                      '&.Mui-checked': { color: colors.primary[600] },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.tertiary }}>
                      SKU: {item.sku} • {typeof item.category === 'object' && item.category && 'name' in item.category ? item.category.name : item.category}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.secondary }}>
          <Button onClick={onBack} sx={{ color: colors.text.secondary }}>
            Back
          </Button>
          <Button onClick={onClose} sx={{ color: colors.text.secondary }}>
            Cancel
          </Button>
          <Button
            onClick={onApply}
            variant="contained"
            disabled={selectedItems.size === 0}
            sx={{
              backgroundColor: colors.primary[600],
              '&:hover': { backgroundColor: colors.primary[700] },
              '&.Mui-disabled': {
                backgroundColor: colors.background.tertiary,
                color: colors.text.tertiary,
              },
            }}
          >
            Assign to {selectedItems.size} Item{selectedItems.size !== 1 ? "s" : ""}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};