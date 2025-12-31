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
} from "@mui/material";
import {
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  LuSearch,
  LuSun,
  LuMoon,
  LuChevronUp,
  LuChevronDown,
  LuBell,
  LuMessageCircle,
  LuGlobe,
  LuMaximize,
  LuPackage,
} from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  onToggleSidebar: () => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const Header = ({
  isVisible = true,
  onToggleVisibility,
}: HeaderProps) => {
  const { logout } = useAuth();
  const { mode, toggleTheme, colors } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Box
        sx={{
          height: 70,
          backgroundColor: colors.background.card,
          borderBottom: `1px solid ${colors.border.primary}`,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          mr: 6,
          px: 3,
          py: 1,
          ml: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          gap: 3,
          top: 0,
          zIndex: 1200,
          boxShadow: colors.shadow.sm,
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        {/* Left Section: Sidebar Toggle + Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              height: 42,
              borderRadius: 2,
              px: 1.5,
              boxShadow: "none",
              flex: 1,
              minWidth: 200,
              maxWidth: "80%",
              backgroundColor: colors.background.secondary,
            }}
          >
            <LuSearch
              style={{ color: colors.text.secondary, marginRight: 8 }}
            />
            <InputBase
              sx={{
                flex: 1,
                fontSize: 14,
                border: "none",
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                "& input::placeholder": {
                  color: colors.text.tertiary,
                },
              }}
              placeholder="Search [CTRL + K]"
              inputProps={{ "aria-label": "search" }}
            />
          </Paper>
        </Box>

        {/* Right Section: Icons + Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <Tooltip
            title={
              mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            <Box
              onClick={toggleTheme}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.background.secondary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.sm,
                color: colors.text.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.md,
                  transform: "translateY(-1px)",
                },
              }}
            >
              {mode === "light" ? <LuMoon size={16} /> : <LuSun size={16} />}
            </Box>
          </Tooltip>

          <Tooltip title="Maximize">
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.background.secondary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.sm,
                color: colors.text.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.md,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LuMaximize size={16} />
            </Box>
          </Tooltip>

          <Tooltip title="Packages">
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.background.secondary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.sm,
                color: colors.text.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.md,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LuPackage size={16} />
            </Box>
          </Tooltip>

          <Tooltip title="Language">
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.background.secondary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.sm,
                color: colors.text.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.md,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LuGlobe size={16} />
            </Box>
          </Tooltip>

          <Tooltip title="Chat">
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.background.secondary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.sm,
                color: colors.text.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.md,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LuMessageCircle size={16} />
            </Box>
          </Tooltip>

          <Tooltip title="Notifications">
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.background.secondary,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.sm,
                color: colors.text.secondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.md,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LuBell size={16} />
            </Box>
          </Tooltip>

          <IconButton onClick={handleMenuOpen}>
            <Avatar
              alt="User Profile"
              src="https://i.pravatar.cc/150?img=3"
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          slotProps={{
            paper: {
              sx: {
                mt: 1.2,  
                minWidth: 180,
                borderRadius: 2,
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.lg,
                "& .MuiMenuItem-root": {
                  color: colors.text.primary,
                  "&:hover": {
                    backgroundColor: colors.background.tertiary,
                  },
                },
                "& .MuiDivider-root": {
                  borderColor: colors.border.primary,
                },
              },
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

        {/* Header Toggle Button - Bottom Right */}
        {onToggleVisibility && (
          <Box
            sx={{
              position: "absolute",
              bottom: -16,
              right: -10,
              zIndex: 1300,
            }}
          >
            <Tooltip title={isVisible ? "Hide header" : "Show header"}>
              <IconButton
                onClick={onToggleVisibility}
                sx={{
                  width: 34,
                  height: 34,
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.border.primary}`,
                  boxShadow: colors.shadow.md,
                  color: colors.text.secondary,
                  "&:hover": {
                    color: colors.text.primary,
                    backgroundColor: colors.background.tertiary,
                    boxShadow: colors.shadow.lg,
                  },
                }}
              >
                {isVisible ? (
                  <LuChevronUp size={16} />
                ) : (
                  <LuChevronDown size={16} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Toggle Button When Header is Hidden */}
      {onToggleVisibility && !isVisible && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 35,
            zIndex: 1300,
          }}
        >
          <Tooltip title="Show header">
            <IconButton
              onClick={onToggleVisibility}
              sx={{
                width: 34,
                height: 34,
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.primary}`,
                boxShadow: colors.shadow.md,
                color: colors.text.secondary,
                "&:hover": {
                  color: colors.text.primary,
                  backgroundColor: colors.background.tertiary,
                  boxShadow: colors.shadow.lg,
                },
              }}
            >
              <LuChevronDown size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
};
