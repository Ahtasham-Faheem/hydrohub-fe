import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext";
import { UnifiedFormProvider } from "./contexts/UnifiedFormContext";
import { ThemeProvider as CustomThemeProvider, useTheme } from "./contexts/ThemeContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { muiTheme } from "./theme/muiTheme";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { LoginAccess } from "./pages/auth/LoginAccess";
import { QRCodeLogin } from "./pages/auth/QRCodeLogin";

// Inner component that uses theme
const AppContent = () => {
  const { colors } = useTheme();
  
  return (
    <ThemeProvider theme={muiTheme}>
      <div 
        style={{ 
          backgroundColor: colors.background.primary,
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <AuthProvider>
          <UnifiedFormProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={<Navigate to="/login-access" replace />}
                />
                <Route path="/login-access" element={<LoginAccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/qr-login" element={<QRCodeLogin />} />
                <Route path="/forgot-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard/*"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={<Navigate to="/login-access" replace />}
                />
              </Routes>
            </Router>
          </UnifiedFormProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}
