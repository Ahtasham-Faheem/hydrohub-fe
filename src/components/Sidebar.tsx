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
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import WaterLogo from "../assets/WATER-INN-logo.svg";

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    reports: false,
    sales: false,
    performance: false,
  });

  // Menu structure
  const menuHierarchy: Record<string, string[]> = {
    reports: [
      "sales",
      "performance",
      "monthlySales",
      "regionalSales",
      "productBreakdown",
      "teamMetrics",
      "individualKpis",
      "revenueSummary",
    ],
    sales: ["monthlySales", "regionalSales", "productBreakdown"],
    performance: ["teamMetrics", "individualKpis"],
  };

  // Check if parent should appear active
  const isParentActive = (parentKey: string): boolean => {
    const children = menuHierarchy[parentKey];
    return children ? children.includes(activeSection) : false;
  };

  // Auto-open parents when navigating into nested pages
  useEffect(() => {
    const newOpenSections = { ...openSections };

    if (menuHierarchy.sales.includes(activeSection)) {
      newOpenSections.reports = true;
      newOpenSections.sales = true;
    } else if (menuHierarchy.performance.includes(activeSection)) {
      newOpenSections.reports = true;
      newOpenSections.performance = true;
    } else if (menuHierarchy.reports.includes(activeSection)) {
      newOpenSections.reports = true;
    }

    setOpenSections(newOpenSections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const drawerWidth = collapsed ? 80 : 279;

  // Styling helpers
  const getActiveClass = (section: string) => {
    const isSelected = activeSection === section;
    const isParent = isParentActive(section) && !isSelected;
    if (isSelected)
      return "!rounded-r-4xl bg-gradient-to-r from-sidebar-gradient-start to-primary-600 !text-white shadow-md !mb-1";
    if (isParent)
      return "!rounded-r-4xl !bg-primary-light border-l-4 border-primary-400 !text-primary-700 !mb-1 pl-5";
    return "";
  };

  const getIconColor = (section: string) => {
    const isSelected = activeSection === section;
    const isParent = isParentActive(section) && !isSelected;
    if (isSelected) return "white";
    if (isParent) return "#2092EC";
    return "#2092ec";
  };

  const getTextColorClass = (section: string) => {
    const isSelected = activeSection === section;
    const isParent = isParentActive(section) && !isSelected;
    if (isSelected) return "text-white";
    if (isParent) return "text-primary-600 font-bold";
    return "";
  };

  return (
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
            to="/login"
            className="text-primary-600 hover:underline cursor-pointer flex justify-center"
          >
            <img
              src={WaterLogo}
              alt="HydroHub Logo"
              className={`${collapsed ? 'w-[70px]' : 'w-[202px]'} h-auto transition-all duration-300`}
            />
          </Link>
        </Box>

        <List component="nav" disablePadding>
          {/* Section Header */}
          {!collapsed && (
            <div className="flex gap-2 items-center text-sm font-medium text-text-300 rounded-none mb-3 px-2">
              <div className="shrink-0 self-stretch my-auto h-px border border-text-300 border-solid w-[15px]" />
              <h2 className="self-stretch basis-auto text-gray-500">
                Business Operations
              </h2>
              <div className="shrink-0 self-stretch my-auto h-px border border-text-300 border-solid w-[84px]" />
            </div>
          )}

          {/* Overview */}
          <Tooltip title={collapsed ? "Overview" : ""} placement="right">
            <ListItemButton
              selected={activeSection === "overview"}
              onClick={() => onSelect("overview")}
              className={getActiveClass("overview")}
              sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <DashboardIcon
                sx={{ color: getIconColor("overview"), mr: collapsed ? 0 : 2 }}
              />
              {!collapsed && (
                <ListItemText
                  primary="Overview"
                  className={getTextColorClass("overview")}
                />
              )}
            </ListItemButton>
          </Tooltip>

          {/* Users */}
          <Tooltip title={collapsed ? "Users" : ""} placement="right">
            <ListItemButton
              selected={activeSection === "users"}
              onClick={() => onSelect("users")}
              className={getActiveClass("users")}
              sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <PeopleIcon
                sx={{ color: getIconColor("users"), mr: collapsed ? 0 : 2 }}
              />
              {!collapsed && (
                <ListItemText
                  primary="Users"
                  className={getTextColorClass("users")}
                />
              )}
            </ListItemButton>
          </Tooltip>

          {/* Section Divider */}
          {!collapsed && (
            <div className="flex gap-2 items-center text-sm font-medium text-text-300 rounded-none mb-3 mt-2 px-2">
              <div className="shrink-0 self-stretch my-auto h-px border border-text-300 border-solid w-[15px]" />
              <h2 className="self-stretch basis-auto text-gray-500">
                Reports & Metrics
              </h2>
              <div className="shrink-0 self-stretch my-auto h-px border border-text-300 border-solid w-[84px]" />
            </div>
          )}

          {/* Reports Root */}
          <Tooltip title={collapsed ? "Reports" : ""} placement="right">
            <ListItemButton
              onClick={() => toggleSection("reports")}
              className={getActiveClass("reports")}
              sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <BarChartIcon
                sx={{ color: getIconColor("reports"), mr: collapsed ? 0 : 2 }}
              />
              {!collapsed && (
                <ListItemText
                  primary="Reports"
                  className={getTextColorClass("reports")}
                />
              )}
              {!collapsed &&
                (openSections.reports ? (
                  <ExpandLess sx={{ color: getIconColor("reports") }} />
                ) : (
                  <ExpandMore sx={{ color: getIconColor("reports") }} />
                ))}
            </ListItemButton>
          </Tooltip>

          {/* Reports Nested */}
          <Collapse in={openSections.reports && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Sales */}
              <ListItemButton
                sx={{ pl: 6 }}
                onClick={() => toggleSection("sales")}
                className={getActiveClass("sales")}
              >
                <TrendingUpIcon
                  sx={{ color: getIconColor("sales"), mr: 2 }}
                />
                <ListItemText
                  primary="Sales"
                  className={getTextColorClass("sales")}
                />
                {openSections.sales ? (
                  <ExpandLess sx={{ color: getIconColor("sales") }} />
                ) : (
                  <ExpandMore sx={{ color: getIconColor("sales") }} />
                )}
              </ListItemButton>

              {/* Sales Submenu */}
              <Collapse in={openSections.sales} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 8 }}
                    selected={activeSection === "monthlySales"}
                    onClick={() => onSelect("monthlySales")}
                    className={getActiveClass("monthlySales")}
                  >
                    <ListItemText
                      primary="Monthly Sales"
                      className={getTextColorClass("monthlySales")}
                    />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 8 }}
                    selected={activeSection === "regionalSales"}
                    onClick={() => onSelect("regionalSales")}
                    className={getActiveClass("regionalSales")}
                  >
                    <ListItemText
                      primary="Regional Sales"
                      className={getTextColorClass("regionalSales")}
                    />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 8 }}
                    selected={activeSection === "productBreakdown"}
                    onClick={() => onSelect("productBreakdown")}
                    className={getActiveClass("productBreakdown")}
                  >
                    <ListItemText
                      primary="Product Breakdown"
                      className={getTextColorClass("productBreakdown")}
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Performance */}
              <ListItemButton
                sx={{ pl: 6 }}
                onClick={() => toggleSection("performance")}
                className={getActiveClass("performance")}
              >
                <PieChartIcon
                  sx={{ color: getIconColor("performance"), mr: 2 }}
                />
                <ListItemText
                  primary="Performance"
                  className={getTextColorClass("performance")}
                />
                {openSections.performance ? (
                  <ExpandLess sx={{ color: getIconColor("performance") }} />
                ) : (
                  <ExpandMore sx={{ color: getIconColor("performance") }} />
                )}
              </ListItemButton>

              {/* Performance Submenu */}
              <Collapse in={openSections.performance} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 8 }}
                    selected={activeSection === "teamMetrics"}
                    onClick={() => onSelect("teamMetrics")}
                    className={getActiveClass("teamMetrics")}
                  >
                    <ListItemText
                      primary="Team Metrics"
                      className={getTextColorClass("teamMetrics")}
                    />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 8 }}
                    selected={activeSection === "individualKpis"}
                    onClick={() => onSelect("individualKpis")}
                    className={getActiveClass("individualKpis")}
                  >
                    <ListItemText
                      primary="Individual KPIs"
                      className={getTextColorClass("individualKpis")}
                    />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Revenue Summary */}
              <ListItemButton
                sx={{ pl: 6 }}
                selected={activeSection === "revenueSummary"}
                onClick={() => onSelect("revenueSummary")}
                className={getActiveClass("revenueSummary")}
              >
                <ListItemText
                  primary="Revenue Summary"
                  className={getTextColorClass("revenueSummary")}
                />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Settings */}
          <Tooltip title={collapsed ? "Settings" : ""} placement="right">
            <ListItemButton
              selected={activeSection === "settings"}
              onClick={() => onSelect("settings")}
              className={getActiveClass("settings")}
              sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <SettingsIcon
                sx={{ color: getIconColor("settings"), mr: collapsed ? 0 : 2 }}
              />
              {!collapsed && (
                <ListItemText
                  primary="Settings"
                  className={getTextColorClass("settings")}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>
    </Drawer>
  );
};
