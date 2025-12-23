import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { MdAdd, MdViewAgenda, MdGridView } from "react-icons/md";
import { PrimaryButton } from "../common/PrimaryButton";
import { SecondaryButton } from "../common/SecondaryButton";
import { useTheme } from "../../contexts/ThemeContext";

interface CatalogueToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onAddItem: () => void;
  onAddCategory: () => void;
  onAddCollection: () => void;
}

export const CatalogueToolbar = ({
  viewMode,
  onViewModeChange,
  onAddItem,
  onAddCategory,
  onAddCollection,
}: CatalogueToolbarProps) => {
  const { colors } = useTheme();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mb: 3,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <PrimaryButton
        startIcon={<MdAdd />}
        onClick={onAddItem}
      >
        Add Item
      </PrimaryButton>
      
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}>
        <Stack direction="row" spacing={1}>
          <SecondaryButton
            size="small"
            onClick={onAddCategory}
          >
            + Category
          </SecondaryButton>
          <SecondaryButton
            size="small"
            onClick={onAddCollection}
          >
            + Collection
          </SecondaryButton>
        </Stack>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newValue) => {
            if (newValue) onViewModeChange(newValue);
          }}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: colors.text.secondary,
              borderColor: colors.border.primary,
              '&.Mui-selected': {
                backgroundColor: colors.primary[600],
                color: colors.text.inverse,
                '&:hover': {
                  backgroundColor: colors.primary[700],
                },
              },
              '&:hover': {
                backgroundColor: colors.background.secondary,
              },
            },
          }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <MdGridView size={20} />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <MdViewAgenda size={20} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};