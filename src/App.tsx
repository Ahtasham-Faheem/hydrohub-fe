import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { muiTheme } from "./theme/muiTheme";
import { ResetPassword } from "./pages/ResetPassword";
import { LoginAccess } from "./pages/LoginAccess";

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
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Add more protected routes here as needed */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={["admin"]}>
                  {/* Admin routes component */}
                  <div>Admin Area</div>
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
