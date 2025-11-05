import {
  Box,
  Button,
  Menu,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Typography,
} from "@mui/material";
import { TbSortAscendingSmallBig } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { CustomInput } from "../CustomInput";
import { LuSearch } from "react-icons/lu";
import { PrimaryButton } from "../PrimaryButton";
import { useNavigate } from "react-router-dom";

interface Column {
  id: number;
  label: string;
  enabled: boolean;
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
}

export const SortAndManageColumns = ({
  sortAnchorEl,
  setSortAnchorEl,
  manageAnchorEl,
  setManageAnchorEl,
  columns,
  handleMove,
  handleToggleColumn,
  handleSaveColumns,
  search,
  setSearch,
}: SortAndManageColumnsProps) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 2 }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
        <CustomInput
          label=""
          placeholder="Search User"
          startAdornment={<LuSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<TbSortAscendingSmallBig />}
          endIcon={<IoIosArrowDown />}
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
        >
          Sort By
        </Button>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          <MenuItem>Name</MenuItem>
          <MenuItem>Email</MenuItem>
          <MenuItem>Status</MenuItem>
          <MenuItem>Created Date</MenuItem>
        </Menu>

        <Button
          variant="outlined"
          startIcon={<BsLayoutThreeColumns />}
          onClick={(e) => setManageAnchorEl(e.currentTarget)}
        >
          Manage Columns
        </Button>
        <Popover
          open={Boolean(manageAnchorEl)}
          anchorEl={manageAnchorEl}
          onClose={() => setManageAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              p: 2,
              width: 320,
              borderRadius: 2,
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Select fields to display and arrange order.
          </Typography>
          <List dense>
            {columns.map((col: Column, index: number) => (
              <ListItem key={col.id}>
                <ListItemText primary={col.label} />
                <ListItemSecondaryAction sx={{ display: "flex", gap: 1 }}>
                  <Switch
                    checked={col.enabled}
                    onChange={() => handleToggleColumn(col.id)}
                    size="small"
                  />
                  <Box>
                    <Button
                      size="small"
                      onClick={() => handleMove(index, "up")}
                    >
                      ↑
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleMove(index, "down")}
                    >
                      ↓
                    </Button>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              onClick={() => setManageAnchorEl(null)}
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveColumns}
              variant="contained"
              size="small"
            >
              Save
            </Button>
          </Box>
        </Popover>
        <PrimaryButton 
          className="px-16! font-medium!"
          onClick={() => navigate('/dashboard/users/create')}
        >
          Add New User
        </PrimaryButton>
      </Box>
    </Box>
  );
};
