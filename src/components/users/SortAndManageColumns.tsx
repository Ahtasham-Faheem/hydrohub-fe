import {
  Box,
  Button,
  Menu,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { TbSortAscendingSmallBig } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { CustomInput } from "../common/CustomInput";
import { LuSearch } from "react-icons/lu";
import { PrimaryButton } from "../common/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { MdGridView, MdViewAgenda } from "react-icons/md";

interface Column {
  id: number;
  key: string;
  label: string;
  enabled: boolean;
}

interface SortOption {
  key: string;
  label: string;
}

interface SortAndManageColumnsProps {
  sortAnchorEl: HTMLElement | null;
  setSortAnchorEl: (el: HTMLElement | null) => void;
  manageAnchorEl: HTMLElement | null;
  setManageAnchorEl: (el: HTMLElement | null) => void;
  columns: Column[];
  handleMove: (index: number, direction: string) => void;
  handleToggleColumn: (id: number) => void;
  handleSaveColumns: () => void;
  search: string;
  setSearch: (search: string) => void;
  addButtonLabel?: string;
  addButtonPath?: string;
  sortOptions?: SortOption[];
  currentSort?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
  searchPlaceholder?: string;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export const SortAndManageColumns = ({
  sortAnchorEl,
  setSortAnchorEl,
  manageAnchorEl,
  setManageAnchorEl,
  columns,
  handleMove,
  handleToggleColumn,
  search,
  setSearch,
  addButtonLabel = "Add New User",
  addButtonPath = "/dashboard/users/create",
  sortOptions = [
    { key: "firstName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created Date" },
  ],
  currentSort,
  onSort,
  searchPlaceholder = "Search User",
  viewMode = "grid",
  onViewModeChange,
}: SortAndManageColumnsProps) => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleSortSelect = (sortKey: string) => {
    if (onSort) {
      onSort(sortKey);
    }
    setSortAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        mb: 2,
      }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
        <CustomInput
          label=""
          placeholder={searchPlaceholder}
          startAdornment={<LuSearch style={{ color: colors.primary[600] }} />}
          value={search}
          size="small"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<TbSortAscendingSmallBig />}
          endIcon={<IoIosArrowDown />}
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
          sx={{
            color: colors.text.primary,
            borderColor: colors.border.primary,
            "&:hover": {
              borderColor: colors.primary[600],
              backgroundColor: colors.background.secondary,
            },
          }}
        >
          Sort By
          {currentSort && (
            <Box
              component="span"
              sx={{ ml: 1, fontSize: "0.75rem", opacity: 0.7 }}
            >
              ({sortOptions.find((opt) => opt.key === currentSort.key)?.label}{" "}
              {currentSort.direction === "asc" ? "↑" : "↓"})
            </Box>
          )}
        </Button>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.md,
              },
            },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option.key}
              onClick={() => handleSortSelect(option.key)}
              sx={{
                color: colors.text.primary,
                "&:hover": {
                  backgroundColor: colors.background.secondary,
                },
                ...(currentSort?.key === option.key && {
                  backgroundColor: colors.background.secondary,
                  fontWeight: 600,
                }),
              }}
            >
              {option.label}
              {currentSort?.key === option.key && (
                <Box component="span" sx={{ ml: 1 }}>
                  {currentSort.direction === "asc" ? "↑" : "↓"}
                </Box>
              )}
            </MenuItem>
          ))}
        </Menu>

        <Button
          variant="outlined"
          startIcon={<BsLayoutThreeColumns />}
          onClick={(e) => setManageAnchorEl(e.currentTarget)}
          sx={{
            color: colors.text.primary,
            borderColor: colors.border.primary,
            "&:hover": {
              borderColor: colors.primary[600],
              backgroundColor: colors.background.secondary,
            },
          }}
        >
          Manage Columns
        </Button>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newValue) => {
            if (newValue && onViewModeChange) {
              onViewModeChange(newValue);
            }
          }}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              color: colors.text.secondary,
              borderColor: colors.border.primary,
              height: '42px',
              "&.Mui-selected": {
                backgroundColor: colors.primary[600],
                color: colors.text.inverse,
                "&:hover": {
                  backgroundColor: colors.primary[700],
                },
              },
              "&:hover": {
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
        <Popover
          open={Boolean(manageAnchorEl)}
          anchorEl={manageAnchorEl}
          onClose={() => setManageAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                p: 2,
                width: 320,
                borderRadius: 2,
                boxShadow: colors.shadow.md,
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.primary}`,
              },
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              color: colors.text.primary,
              fontWeight: 600,
            }}
          >
            Select fields to display and arrange order.
          </Typography>
          <List dense>
            {columns.map((col: Column, index: number) => (
              <ListItem
                key={col.id}
                sx={{
                  backgroundColor: colors.background.primary,
                  borderRadius: 1,
                  mb: 0.5,
                  border: `1px solid ${colors.border.primary}`,
                }}
              >
                <ListItemText
                  primary={col.label}
                  sx={{
                    color: colors.text.primary,
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                    },
                  }}
                />
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
                >
                  <Switch
                    checked={col.enabled}
                    onChange={() => handleToggleColumn(col.id)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: colors.primary[600],
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: colors.primary[600],
                        },
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      sx={{
                        color: colors.text.secondary,
                        p: 0.25,
                        "&:hover": {
                          backgroundColor: colors.background.secondary,
                        },
                        "&.Mui-disabled": {
                          color: colors.text.tertiary,
                        },
                      }}
                    >
                      <IoIosArrowUp size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === columns.length - 1}
                      sx={{
                        color: colors.text.secondary,
                        p: 0.25,
                        "&:hover": {
                          backgroundColor: colors.background.secondary,
                        },
                        "&.Mui-disabled": {
                          color: colors.text.tertiary,
                        },
                      }}
                    >
                      <IoIosArrowDown size={16} />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Popover>
        <PrimaryButton
          className="px-6! font-medium!"
          onClick={() => {
            navigate(addButtonPath);
            localStorage.removeItem("createUserCurrentStep");
            localStorage.removeItem("createCustomerFormState");
            localStorage.removeItem("createCustomerProfileId");
            localStorage.removeItem("createUserFormData");
          }}
        >
          {addButtonLabel}
        </PrimaryButton>
      </Box>
    </Box>
  );
};
