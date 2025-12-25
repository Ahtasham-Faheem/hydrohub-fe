import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import WaterLogo from "../assets/WATER-INN-logo.svg";
import {
  menuConfig,
  getParentIds,
  hasChildren,
  getAllDescendantIds,
} from "../utils/menuConfig";
import type { MenuItem } from "../utils/menuConfig";
import { useTheme } from "../contexts/ThemeContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

interface SidebarProps {
  onSelect: (section: string) => void;
  activeSection: string;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Sidebar = ({
  onSelect,
  activeSection,
  collapsed = false,
  onToggleSidebar,
}: SidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const { colors } = useTheme();

  // Determine if sidebar should be expanded
  const shouldExpand = collapsed && isHovered;
  const effectiveCollapsed = collapsed && !shouldExpand;
  const drawerWidth = effectiveCollapsed ? 80 : 270;

  // Auto-open parents when navigating into nested pages
  useEffect(() => {
    const parentIds = getParentIds(menuConfig, activeSection);
    const newOpenSections: Record<string, boolean> = {};

    parentIds.forEach((parentId) => {
      newOpenSections[parentId] = true;
    });

    setOpenSections(newOpenSections);
  }, [activeSection]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle collapse button click
  const handleToggleCollapse = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  // Handle mouse enter/leave for hover behavior
  const handleMouseEnter = () => {
    if (collapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed) {
      setIsHovered(false);
    }
  };

  // Check if item or any of its children is active
  const isItemOrChildActive = (item: MenuItem): boolean => {
    if (item.id === activeSection) return true;
    const descendantIds = getAllDescendantIds(item);
    return descendantIds.includes(activeSection);
  };

  // Styling helpers - keeping original selected styles, only changing non-selected text colors
  const getActiveClass = (item: MenuItem) => {
    const isSelected = activeSection === item.id;
    const isParent = isItemOrChildActive(item) && !isSelected;

    if (isSelected)
      return "!rounded-r-4xl bg-gradient-to-r from-sidebar-gradient-start to-primary-600 !text-white shadow-md !mb-1";
    if (isParent)
      return "!rounded-r-4xl !bg-primary-light border-l-4 border-primary-400 !text-primary-700 !mb-1 pl-5";
    return "";
  };

  const getIconColor = (item: MenuItem) => {
    const isSelected = activeSection === item.id;
    const isParent = isItemOrChildActive(item) && !isSelected;

    if (isSelected) return "white";
    if (isParent) return "#2092EC";
    return colors.text.primaryBlue; // This will adapt to theme
  };

  const getTextColorClass = (item: MenuItem) => {
    const isSelected = activeSection === item.id;
    const isParent = isItemOrChildActive(item) && !isSelected;

    if (isSelected) return "text-white";
    if (isParent) return "text-primary-600 font-bold";
    return ""; // We'll handle this with inline styles
  };

  const getTextColor = (item: MenuItem) => {
    const isSelected = activeSection === item.id;
    const isParent = isItemOrChildActive(item) && !isSelected;

    if (isSelected) return "white";
    if (isParent) return "#2092EC";
    return colors.text.primary; // This will be white in dark mode, dark in light mode
  };

  // Render divider
  const renderDivider = (label: string) => {
    if (effectiveCollapsed) return null;

    return (
      <Box sx={{ my: 2, mx: 2 }}>
        <Divider
          textAlign="left"
          sx={{
            color: colors.text.secondary,
            fontSize: "14px",
            fontWeight: 500,
            "&::before, &::after": {
              borderColor: colors.border.secondary,
            },
          }}
        >
          {label}
        </Divider>
      </Box>
    );
  };

  // Render menu item recursively
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    // Render divider
    if (item.type === "divider") {
      return renderDivider(item.dividerLabel || item.label);
    }

    const Icon = item.icon;
    const hasChildItems = hasChildren(item);
    const paddingLeft = level === 0 ? 2 : level === 1 ? 5 : 8;
    const showIcon = Icon && (level === 0 || level === 1);

    return (
      <div key={item.id}>
        <Tooltip
          title={item.label}
          placement="right"
          arrow
        >
          <ListItemButton
            selected={activeSection === item.id}
            onClick={() =>
              hasChildItems ? toggleSection(item.id) : onSelect(item.id)
            }
            className={getActiveClass(item)}
            sx={{
              pl: paddingLeft,
              justifyContent:
                effectiveCollapsed && level === 0 ? "center" : "flex-start",
              borderRadius: level === 0 ? "0px" : "inherit",
              // Only add hover styles for non-selected items
              ...(!getActiveClass(item) && {
                "&:hover": {
                  backgroundColor: colors.background.secondary,
                  borderRadius: "50px",
                },
              }),
            }}
          >
            {showIcon && Icon && (
              <Icon
                sx={{
                  color: getIconColor(item),
                  mr: effectiveCollapsed && level === 0 ? 0 : 2,
                }}
              />
            )}
            {(!effectiveCollapsed || level > 0) && (
              <ListItemText
                primary={item.label}
                className={getTextColorClass(item)}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: getTextColor(item),
                    whiteSpace: "nowrap",
                    maxWidth: "175px",
                    overflow: "hidden",
                    paddingRight: 1,
                    textOverflow: "ellipsis",
                    fontSize: 14,
                    fontWeight:
                      activeSection === item.id ||
                      (isItemOrChildActive(item) && activeSection !== item.id)
                        ? 600
                        : 400,
                  },
                }}
              />
            )}
            {!effectiveCollapsed &&
              hasChildItems &&
              (openSections[item.id] ? (
                <ExpandLess sx={{ color: getIconColor(item) }} />
              ) : (
                <ExpandMore sx={{ color: getIconColor(item) }} />
              ))}
          </ListItemButton>
        </Tooltip>

        {/* Render children */}
        {hasChildItems && (
          <Collapse
            in={openSections[item.id] && !effectiveCollapsed}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <div
      className="sidebar pr-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          className: "noScrollbar",
          transition: "width 0.3s ease",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: colors.background.primary,
            transition: "width 0.3s ease, background-color 0.3s ease",
            overflowX: "hidden",
            zIndex: shouldExpand ? 1300 : "auto",
          },
        }}
      >
        <Box sx={{ backgroundColor: colors.background.primary, height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Logo - Sticky Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: effectiveCollapsed ? "center" : "start",
              alignItems: "flex-start",
              py: 1,
              px: effectiveCollapsed ? 0 : 2,
              backgroundColor: colors.background.primary,
              position: "sticky",
              top: 0,
              zIndex: 10,
              borderBottom: `1px solid ${colors.border.primary}`,
            }}
          >
            <Link
              to="/dashboard"
              className="hover:underline cursor-pointer flex justify-baseline"
              style={{ color: colors.primary[600] }}
            >
              <img
                src={WaterLogo}
                alt="HydroHub Logo"
                className={`${
                  effectiveCollapsed ? "w-[50px]" : "w-[150px]"
                } h-auto transition-all duration-300`}
              />
            </Link>

            {/* Collapse/Expand Button - Show when expanded OR when hovering over collapsed sidebar */}
            {(!collapsed || shouldExpand) && (
              <IconButton
                onClick={handleToggleCollapse}
                sx={{
                  color: colors.primary[500],
                  borderRadius: "50%",
                  backgroundColor: colors.background.secondary,
                  // border: `2px solid ${colors.primary[500]}`,
                  padding: "4px !important",
                  minWidth: "28px",
                  minHeight: "28px",
                  position: "absolute",
                  top: 20,
                  right: shouldExpand ? 16 : 16,
                  boxShadow: colors.shadow.md,
                  "&:hover": {
                    backgroundColor: colors.primary[50],
                    boxShadow: colors.shadow.lg,
                  },
                  transition: "all 0.3s ease",
                }}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <HiChevronDoubleRight size={16} color={colors.primary[500]} />
                ) : (
                  <HiChevronDoubleLeft size={16} color={colors.primary[500]} />
                )}
              </IconButton>
            )}
          </Box>

          {/* Scrollable Menu List */}
          <Box className='noScrollbar' sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <List
              component="nav"
              disablePadding
              sx={{ backgroundColor: colors.background.primary, paddingRight: 2, paddingTop: 1 }}
            >
              {menuConfig.map((item) => renderMenuItem(item))}
            </List>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};
