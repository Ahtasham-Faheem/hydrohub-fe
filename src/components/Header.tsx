import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Apps as AppsIcon,
  Language as LanguageIcon,
  LightMode as LightModeIcon,
  NotificationsNone as NotificationsIcon,
  StarBorder as StarIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        height: 70,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginRight: "20px",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 1200,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <Grid container alignItems="center" spacing={1} width={"100%"}>
        <Grid item size={2}>
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              color: "#2092ec",
              borderRadius: 2,
            }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
        </Grid>
        <Grid item size={6}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              height: 42,
              borderRadius: 2,
              px: 1.5,
              boxShadow: "none",
            }}
          >
            <SearchIcon sx={{ color: "#9ca3af", mr: 1 }} />
            <InputBase
              sx={{ flex: 1, fontSize: 14, border: "none" }}
              placeholder="Search [CTRL + K]"
              inputProps={{ "aria-label": "search" }}
            />
          </Paper>
        </Grid>
        <Grid
          item
          size={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Tooltip title="Apps">
            <IconButton>
              <AppsIcon sx={{ color: "#6b7280" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Language">
            <IconButton>
              <LanguageIcon sx={{ color: "#6b7280" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Theme">
            <IconButton>
              <LightModeIcon sx={{ color: "#6b7280" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Favorites">
            <IconButton>
              <StarIcon sx={{ color: "#6b7280" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsIcon sx={{ color: "#ef4444" }} />
            </IconButton>
          </Tooltip>

          {/* Profile Avatar */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              alt="User Profile"
              src="https://i.pravatar.cc/150?img=3"
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>
        </Grid>
      </Grid>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.2,
            minWidth: 180,
            borderRadius: 2,
            boxShadow:
              "0px 2px 8px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ fontSize: 18, mr: 1, color: "#6b7280" }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            logout();
          }}
        >
          <LogoutIcon sx={{ fontSize: 18, mr: 1, color: "#ef4444" }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};
