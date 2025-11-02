import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { UsersPage } from "./UsersPage";
import BusinessControlCenter from "./BusinessControlCenter";

export const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <BusinessControlCenter />;
      case "users":
        return <UsersPage />;
      case "sales":
        return <Typography>Sales reports and analytics appear here.</Typography>;
      case "performance":
        return <Typography>Performance metrics and charts.</Typography>;
      case "settings":
        return <Typography>Adjust platform settings here.</Typography>;
      default:
        return <Typography>Select a section from the sidebar.</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f4f6" }}>
      {/* Sidebar */}
      <Sidebar
        onSelect={setActiveSection}
        activeSection={activeSection}
        collapsed={sidebarCollapsed}
      />

      {/* Right Panel */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
};
