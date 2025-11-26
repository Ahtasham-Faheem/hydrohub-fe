import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { muiTheme } from "./theme/muiTheme";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { LoginAccess } from "./pages/auth/LoginAccess";

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login-access" replace />} />
            <Route path="/login-access" element={<LoginAccess />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="*" element={<Navigate to="/login-access" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
