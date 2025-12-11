import { useState } from "react";
import { Box } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Breadcrumb } from "../components/Breadcrumb";
import { DashboardFooter } from "../components/DashboardFooter";
import { UsersPage } from "./WorkforceShiftManagement/UsersPage";
import BusinessControlCenter from "./BusinessControlCenter";
import { CreateUser } from "./WorkforceShiftManagement/CreateUser";
import { EditUser } from "./WorkforceShiftManagement/EditUser";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { CustomerProfiles } from "./CustomerManagement/CustomerProfiles";
import { CreateCustomer } from "./CustomerManagement/CreateCustomer";
import { EditCustomer } from "./CustomerManagement/EditCustomer";
import { CustomerFormProvider } from "../contexts/CustomerFormContext";
import { CatalogueManagement } from "./CatalogeManagement/CatalogueManagement";
import { OrderFlow } from "./Orders/OrderFlow";

export const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div className="absolute top-0 w-full">
          <Header
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            isVisible={headerVisible}
          />
        </div>
        {/* Add toggle button in top-right when header is hidden */}
        {!headerVisible && (
          <Box
            onClick={() => setHeaderVisible(true)}
            sx={{
              position: "absolute",
              top: 14,
              right: 20,
              width: 34,
              height: 34,
              cursor: "pointer",
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              background: "white",
              borderRadius: "50%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              color: "#666",
              "&:hover": { color: "#000" },
            }}
            title="Show header"
          >
            <FaAngleDown />
          </Box>
        )}

        {/* Content Area */}
        <div className="h-screen flex flex-col justify-between">
          <Box sx={{ p: 2, pr: 3, pt: 10 }}>
            <Breadcrumb />
            <Routes>
              <Route
                path="/"
                element={
                  <BusinessControlCenter
                    onHideHeader={() => setHeaderVisible(!headerVisible)}
                  />
                }
              />
              <Route
                path="overview"
                element={
                  <BusinessControlCenter
                    onHideHeader={() => setHeaderVisible(!headerVisible)}
                  />
                }
              />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/create" element={<CreateUser />} />
              <Route path="users/edit/:id" element={<EditUser />} />
              <Route path="customer-profiles" element={<CustomerProfiles />} />
              <Route
                path="customer-profiles/create"
                element={
                  <CustomerFormProvider>
                    <CreateCustomer />
                  </CustomerFormProvider>
                }
              />
              <Route
                path="customer-profiles/edit/:id"
                element={
                  <CustomerFormProvider>
                    <EditCustomer />
                  </CustomerFormProvider>
                }
              />
              <Route path="catalogue" element={<CatalogueManagement />} />
              <Route path="orders" element={<OrderFlow />} />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-full">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                          animation:
                            "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                        }}
                      >
                        🚀
                      </Box>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          Coming Soon
                        </h2>
                        <p className="text-gray-500 text-sm">
                          This feature is under development. Check back later!
                        </p>
                      </div>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 2,
                          "& > div": {
                            width: "60px",
                            height: "12px",
                            borderRadius: "6px",
                            background: "#e0e0e0",
                            animation: "shimmer 1.5s infinite",
                          },
                        }}
                      >
                        <div />
                        <div style={{ animationDelay: "0.2s" }} />
                        <div style={{ animationDelay: "0.4s" }} />
                      </Box>
                    </Box>
                    <style>{`
                      @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                      }
                      @keyframes shimmer {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 1; }
                      }
                    `}</style>
                  </div>
                }
              />
            </Routes>
          </Box>

          <DashboardFooter />
        </div>
      </Box>
    </Box>
  );
};
