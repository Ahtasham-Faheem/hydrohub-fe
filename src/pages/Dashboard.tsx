import { useState } from "react";
import { Box } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Breadcrumb } from "../components/Breadcrumb";
import { DashboardFooter } from "../components/DashboardFooter";
import { UsersPage } from "./UsersPage";
import BusinessControlCenter from "./BusinessControlCenter";
import { CreateUser } from "./CreateUser";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

export const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the active section from the current path
  const getActiveSection = () => {
    const path = location.pathname.split("/").filter(Boolean);
    return path[1] || "overview";
  };

  // Handle section changes from sidebar
  const handleSectionChange = (section: string) => {
    navigate(`/dashboard/${section}`);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        onSelect={handleSectionChange}
        activeSection={getActiveSection()}
        collapsed={sidebarCollapsed}
      />

      {/* Right Panel */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Area */}
        <div className="relative h-full">
          <Box sx={{ p: 2, pr: 3 }}>
            <Breadcrumb />
            <Routes>
              <Route path="/" element={<BusinessControlCenter />} />
              <Route path="overview" element={<BusinessControlCenter />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/create" element={<CreateUser />} />
              <Route
                path="*"
                element={<div className="h-[75vh]">Coming Soon...</div>}
              />
            </Routes>
          </Box>

          <DashboardFooter />
        </div>
      </Box>
    </Box>
  );
};
