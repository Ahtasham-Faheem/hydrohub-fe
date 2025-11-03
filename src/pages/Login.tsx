import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Phone } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import WaterLogo from "../assets/WATER-INN-logo.svg";
import { LuMail } from "react-icons/lu";
import { Footer } from "./Footer";
import { PrimaryButton } from "../components/PrimaryButton";
import { CustomInput } from "../components/CustomInput";

export const Login = () => {
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [useCodeLogin, setUseCodeLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", phone: "" };

    if (loginMode === "email") {
      if (!email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Enter a valid email address";
        valid = false;
      }
    } else {
      if (!phone) {
        newErrors.phone = "Phone number is required";
        valid = false;
      } else if (!/^\d{7,15}$/.test(phone)) {
        newErrors.phone = "Enter a valid phone number";
        valid = false;
      }
    }

    if (!useCodeLogin) {
      if (!password) {
        newErrors.password = "Password is required";
        valid = false;
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({ email: "", password: "", phone: "" });

    try {
      await login({
        email: loginMode === "email" ? email : `${countryCode}${phone}`,
        password: useCodeLogin ? otp : password,
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrors({ email: errorMessage, password: "", phone: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = () => {
    if (!phone) return alert("Please enter your phone number first");
    alert(`Code sent to ${countryCode} ${phone}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-12 pt-8">
        <Link
          to="/login"
          className="text-primary-600 hover:underline cursor-pointer"
        >
          <img src={WaterLogo} alt="HydroHub Logo" className="w-[190px]" />
        </Link>
        <div className="text-center font-extrabold text-primary-600 flex items-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height="20px"
            width="20px"
            fill="#2092ec"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 
              2 12s4.48 10 10 10 10-4.48 
              10-10S17.52 2 12 2zm0 18c-4.41 
              0-8-3.59-8-8s3.59-8 
              8-8 8 3.59 8 8-3.59 8-8 
              8zm0-14c-2.21 
              0-4 1.79-4 4h2c0-1.1.9-2 
              2-2s2 .9 2 2c0 2-3 1.75-3 
              5h2c0-2.25 3-2.5 3-5 
              0-2.21-1.79-4-4-4z"
            />
          </svg>
          <span className="font-medium text-sm underline ml-1">
            Feedback and help
          </span>
        </div>
      </div>

      {/* Login Card */}
      <Card
        sx={{
          maxWidth: 500,
          width: "90%",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ px: 4, py: 5 }}>
          <Typography
            align="center"
            fontWeight="800"
            className="text-primary-600 text-2xl!"
          >
            Business Control Center
          </Typography>
          <Typography
            variant="h4"
            align="center"
            fontWeight="800"
            color="text.primary"
            sx={{ mt: 1, mb: 2, fontSize: 26 }}
          >
            Log in
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 1, mb: 3, fontSize: 15 }}
          >
            Empower your team, enhance performance and grow smarter everyday
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {/* Toggle Login Mode */}
            <Typography
              sx={{
                color: "#2092ec",
                textAlign: "right",
                fontSize: 14,
                cursor: "pointer",
                marginBottom: 0.5,
              }}
              onClick={() => {
                setLoginMode(loginMode === "email" ? "phone" : "email");
                setUseCodeLogin(false);
              }}
            >
              {loginMode === "email"
                ? "Log in with Phone"
                : "Log in with email & password"}
            </Typography>

            {/* Email or Phone Input */}
            {loginMode === "email" ? (
              <div className="mb-4">
                <CustomInput
                  label="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  endAdornment={
                    <LuMail style={{ color: "#9ca3af", fontSize: 22 }} />
                  }
                />
              </div>
            ) : (
              <div className="mb-4">
                <CustomInput
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  startAdornment={
                    <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none"
                      >
                        <option value="+92">PK +92</option>
                        <option value="+91">IN +91</option>
                        <option value="+1">US +1</option>
                      </select>
                      <span className="ml-2 text-gray-400 border-r border-text-300 h-6"></span>
                    </Box>
                  }
                  endAdornment={
                    <Phone sx={{ color: "#9ca3af", fontSize: 22 }} />
                  }
                />
              </div>
            )}

            {/* Password or Code */}
            <div className="mb-2">
              {loginMode === "phone" && useCodeLogin ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CustomInput
                    label="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    endAdornment={
                      <Button
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          border: "none",
                          height: "38px",
                          fontSize: 15,
                          color: "#4b5563",
                          borderLeft: "1px solid #D1CFD4",
                          borderRadius: 0,
                          paddingRight: 0,
                          ":hover": { textDecoration: "underline" },
                        }}
                        onClick={handleSendCode}
                      >
                        Send code
                      </Button>
                    }
                  />
                </Box>
              ) : (
                <CustomInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  endAdornment={
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: "#9ca3af", fontSize: 22 }}
                        />
                      ) : (
                        <Visibility sx={{ color: "#9ca3af", fontSize: 22 }} />
                      )}
                    </IconButton>
                  }
                />
              )}
            </div>

            {/* Remember Me or Code Toggle */}
            {loginMode === "phone" ? (
              <Typography
                sx={{
                  color: "#2092ec",
                  fontSize: 14,
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginBottom: 3,
                }}
                onClick={() => setUseCodeLogin(!useCodeLogin)}
              >
                {useCodeLogin ? "Log in with password" : "Log in with code"}
              </Typography>
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#2092ec",
                        "&.Mui-checked": { color: "#2092ec" },
                        padding: 0,
                        paddingX: 1,
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#2092ec",
                      fontWeight: 400,
                      fontSize: 14,
                    },
                  }}
                />
                <Link
                  to="/forgot-password"
                  className="text-primary-600 hover:underline text-sm"
                >
                  Forgot password?
                </Link>
              </Box>
            )}

            <PrimaryButton
              type="submit"
              onClick={() => handleSubmit}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </PrimaryButton>
            <Box textAlign="center" mt={3}>
              <Link
                to="/"
                className="text-text-600 text-sm flex justify-center items-center hover:text-text-600"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 0 24 24"
                    width="20px"
                    fill="#4b5563"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
                  </svg>
                </span>{" "}
                Go Back
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Terms */}
      <Typography
        color="text.secondary"
        align="center"
        sx={{ mt: 4, mb: 3, maxWidth: 500, px: 4, fontSize: 14 }}
      >
        By continuing, you agree to our{" "}
        <Link
          to="/terms"
          className="text-primary-600 hover:underline"
          target="_blank"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="text-primary-600 hover:underline"
          target="_blank"
        >
          Privacy Policy
        </Link>{" "}
        for accounts registered in Pakistan.
      </Typography>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};
