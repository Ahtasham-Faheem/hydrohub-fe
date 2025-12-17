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
import { LuSearch, LuSun, LuMoon, LuChevronUp, LuChevronDown } from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
// import NightIcon from "../assets/HeaderIcons/night.svg";
import BellIcon from "../assets/HeaderIcons/bell.svg";
import boxesIcon from "../assets/HeaderIcons/boxes.svg";
import chatIcon from "../assets/HeaderIcons/chat.svg";
// import sunIcon from "../assets/HeaderIcons/sun.svg";
// import mailIcon from "../assets/HeaderIcons/mail.svg";
import cornersIcon from "../assets/HeaderIcons/corners.svg";
import languageIcon from "../assets/HeaderIcons/language.svg";
// import starIcon from "../assets/HeaderIcons/star.svg";

interface HeaderProps {
  onToggleSidebar: () => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const Header = ({ isVisible = true, onToggleVisibility }: HeaderProps) => {
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
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
          pointerEvents: isVisible ? 'auto' : 'none',
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
            maxWidth: '80%',
            // backgroundColor: colors.background.secondary,
            // border: `1px solid ${colors.border.primary}`,
          }}
        >
          <LuSearch style={{ color: colors.text.secondary, marginRight: 8 }} />
          <InputBase
            sx={{ 
              flex: 1, 
              fontSize: 14, 
              border: "none",
              color: colors.text.primary,
              '& input::placeholder': {
                color: colors.text.tertiary,
              }
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
        <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          <IconButton 
            onClick={toggleTheme}
            sx={{ 
              p: 0.5,
              color: colors.text.secondary,
              '&:hover': {
                color: colors.text.primary,
                backgroundColor: colors.background.tertiary,
              }
            }}
          >
            {mode === 'light' ? <LuMoon size={16} /> : <LuSun size={16} />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Corners">
          <IconButton sx={{ p: 0.5 }}>
            <img src={cornersIcon} alt="apps" style={{ width: 15, height: 15 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Boxes">
          <IconButton sx={{ p: 0.5 }}>
            <img src={boxesIcon} alt="apps" style={{ width: 15, height: 15 }} />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Favorites">
          <IconButton sx={{ p: 0.5 }}>
            <img src={starIcon} alt="favorites" style={{ width: 16, height: 16, opacity: 0.85 }} />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Language">
          <IconButton sx={{ p: 0.5 }}>
            <img src={languageIcon} alt="language" style={{ width: 16, height: 16, opacity: 0.85 }} />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Theme">
          <IconButton sx={{ p: 0.5 }}>
            <img src={sunIcon} alt="theme" style={{ width: 16, height: 16, opacity: 0.85 }} />
          </IconButton>
        </Tooltip> */}
        {/* <Tooltip title="Mail">
          <IconButton sx={{ p: 0.5 }}>
            <img src={mailIcon} alt="apps" style={{ width: 16, height: 16 }} />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Chat">
          <IconButton sx={{ p: 0.5 }}>
            <img src={chatIcon} alt="apps" style={{ width: 16, height: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton sx={{ p: 0.5 }}>
            <img src={BellIcon} alt="notifications" style={{ width: 16, height: 16 }} />
          </IconButton>
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

        {/* Header Toggle Button - Bottom Right */}
        {onToggleVisibility && (
          <Box
            sx={{
              position: "absolute",
              bottom: -16,
              right: 20,
              zIndex: 1300,
            }}
          >
            <Tooltip title={isVisible ? "Hide header" : "Show header"}>
              <IconButton
                onClick={onToggleVisibility}
                sx={{
                  width: 32,
                  height: 32,
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
                {isVisible ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
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
            top: 14,
            right: 20,
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
