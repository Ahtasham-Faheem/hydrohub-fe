import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import WaterLogo from "../assets/WATER-INN-logo.svg";
import {
  menuConfig,
  getParentIds,
  hasChildren,
  getAllDescendantIds
} from "../utils/menuConfig";
import type { MenuItem } from "../utils/menuConfig";

interface SidebarProps {
  onSelect: (section: string) => void;
  activeSection: string;
  collapsed?: boolean;
}

export const Sidebar = ({
  onSelect,
  activeSection,
  collapsed = false,
}: SidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const drawerWidth = collapsed ? 80 : 309;

  // Auto-open parents when navigating into nested pages
  useEffect(() => {
    const parentIds = getParentIds(menuConfig, activeSection);
    const newOpenSections: Record<string, boolean> = {};
    
    parentIds.forEach(parentId => {
      newOpenSections[parentId] = true;
    });

    setOpenSections(newOpenSections);
  }, [activeSection]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if item or any of its children is active
  const isItemOrChildActive = (item: MenuItem): boolean => {
    if (item.id === activeSection) return true;
    const descendantIds = getAllDescendantIds(item);
    return descendantIds.includes(activeSection);
  };

  // Styling helpers
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
    return "#2092ec";
  };

  const getTextColorClass = (item: MenuItem) => {
    const isSelected = activeSection === item.id;
    const isParent = isItemOrChildActive(item) && !isSelected;
    
    if (isSelected) return "text-white";
    if (isParent) return "text-primary-600 font-bold";
    return "";
  };

  // Render divider
  const renderDivider = (label: string) => {
    if (collapsed) return null;
    
    return (
      <div className="flex gap-2 items-center text-sm font-medium text-text-300 rounded-none mb-3 mt-2 px-2">
        <div className="shrink-0 self-stretch my-auto h-px border border-gray-300 border-solid w-[15px]" />
        <h2 className="self-stretch basis-auto text-gray-500 whitespace-nowrap">{label}</h2>
        <div className="shrink-0 self-stretch my-auto h-px border border-gray-300 border-solid w-full" />
      </div>
    );
  };

  // Render menu item recursively
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    // Render divider
    if (item.type === 'divider') {
      return renderDivider(item.dividerLabel || item.label);
    }

    const Icon = item.icon;
    const hasChildItems = hasChildren(item);
    const paddingLeft = level === 0 ? 2 : level === 1 ? 6 : 8;
    const showIcon = Icon && (level === 0 || level === 1);

    return (
      <div key={item.id}>
        <Tooltip title={collapsed && level === 0 ? item.label : ""} placement="right">
          <ListItemButton
            selected={activeSection === item.id}
            onClick={() => hasChildItems ? toggleSection(item.id) : onSelect(item.id)}
            className={getActiveClass(item)}
            sx={{
              pl: paddingLeft,
              justifyContent: collapsed && level === 0 ? "center" : "flex-start",
              borderRadius: level === 0 ? '12px' : 'inherit',
            }}
          >
            {showIcon && Icon && (
              <Icon
                sx={{
                  color: getIconColor(item),
                  mr: collapsed && level === 0 ? 0 : 2,
                }}
              />
            )}
            {(!collapsed || level > 0) && (
              <ListItemText
                primary={item.label}
                className={getTextColorClass(item)}
              />
            )}
            {!collapsed && hasChildItems && (
              openSections[item.id] ? (
                <ExpandLess sx={{ color: getIconColor(item) }} />
              ) : (
                <ExpandMore sx={{ color: getIconColor(item) }} />
              )
            )}
          </ListItemButton>
        </Tooltip>

        {/* Render children */}
        {hasChildItems && (
          <Collapse
            in={openSections[item.id] && !collapsed}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding >
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.3s ease",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "transparent",
            borderRight: "none",
            marginRight: "20px",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        <Box>
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Link
              to="/dashboard"
              className="text-primary-600 hover:underline cursor-pointer flex justify-center"
            >
              <img
                src={WaterLogo}
                alt="HydroHub Logo"
                className={`${
                  collapsed ? "w-[70px]" : "w-[202px]"
                } h-auto transition-all duration-300`}
              />
            </Link>
          </Box>

          <List component="nav" disablePadding>
            {menuConfig.map((item) => renderMenuItem(item))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};