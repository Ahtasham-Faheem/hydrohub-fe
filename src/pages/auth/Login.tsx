import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DEMO_MODE, useAuth } from "../../contexts/AuthContext";
import WaterLogo from "../../assets/WATER-INN-logo.svg";
import { LuMail } from "react-icons/lu";
import { Footer } from "../../components/auth/Footer";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { CustomInput } from "../../components/common/CustomInput";
import { PhoneInput } from "../../components/common/PhoneInput";
import { authService } from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";

export const Login = () => {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const [loginMode, setLoginMode] = useState<"email" | "phone">(() => {
    // Check URL parameter for initial login mode
    const mode = searchParams.get("mode");
    return mode === "phone" ? "phone" : "email";
  });
  const [useCodeLogin, setUseCodeLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSuccess, setCodeSuccess] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "error"
  );
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [countdown, setCountdown] = useState(0);
  const { login, isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend code
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validate = (): boolean => {
    // In demo mode, skip validation
    if (DEMO_MODE) {
      return true;
    }

    let valid = true;
    let errorMessage = "";

    // Validate email or phone
    if (loginMode === "email") {
      if (!email) {
        errorMessage = "Please enter your email address";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errorMessage = "Please enter a valid email address";
        valid = false;
      }
    } else {
      if (!phone) {
        errorMessage = "Please enter your phone number";
        valid = false;
      } else {
        const phoneDigits = phone.startsWith("+92")
          ? phone.substring(3)
          : phone;
        if (!/^(3\d{9}|03\d{9})$/.test(phoneDigits)) {
          errorMessage = "Please enter a valid phone number";
          valid = false;
        }
      }
    }

    // Validate password or OTP
    if (valid) {
      if (useCodeLogin) {
        if (!otp) {
          errorMessage = "Please enter the verification code";
          valid = false;
        } else if (!/^\d{6}$/.test(otp)) {
          errorMessage = "Verification code must be exactly 6 digits";
          valid = false;
        }
      } else {
        if (!password) {
          errorMessage = "Please enter your password";
          valid = false;
        } else if (password.length < 8) {
          errorMessage = "Password must be at least 8 characters";
          valid = false;
        }
      }
    }

    if (!valid) {
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setToastOpen(true);
      // Mark fields in error
      if (loginMode === "email" && !email)
        setFieldErrors((prev) => ({ ...prev, email: true }));
      if (loginMode === "email" && !/\S+@\S+\.\S+/.test(email))
        setFieldErrors((prev) => ({ ...prev, email: true }));
      if (loginMode === "phone" && !phone)
        setFieldErrors((prev) => ({ ...prev, phone: true }));
      if (loginMode === "phone") {
        const phoneDigits = phone.startsWith("+92")
          ? phone.substring(3)
          : phone;
        if (!/^(3\d{9}|03\d{9})$/.test(phoneDigits))
          setFieldErrors((prev) => ({ ...prev, phone: true }));
      }
      if (useCodeLogin && !otp)
        setFieldErrors((prev) => ({ ...prev, otp: true }));
      if (useCodeLogin && !/^\d{6}$/.test(otp))
        setFieldErrors((prev) => ({ ...prev, otp: true }));
      if (!useCodeLogin && !password)
        setFieldErrors((prev) => ({ ...prev, password: true }));
      if (!useCodeLogin && password.length < 8)
        setFieldErrors((prev) => ({ ...prev, password: true }));
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({ email: "", password: "", phone: "" });
    setCodeError(null);
    setFieldErrors({});

    try {
      if (useCodeLogin) {
        const verifyPayload =
          loginMode === "email"
            ? { email, code: otp }
            : {
                phone: phone.startsWith("+92") ? phone : `+92${phone}`,
                code: otp,
              };

        const response = await authService.verifyLoginCode(verifyPayload);

        // Store auth token and user data
        localStorage.setItem("authToken", response.access_token);
        localStorage.setItem("userData", JSON.stringify(response.user));

        setIsAuthenticated(true);

        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (e) {
          // Ignore any errors from this approach
        }
      } else {
        // Regular password login
        const loginPayload =
          loginMode === "email"
            ? { email, password }
            : {
                phone: phone.startsWith("+92") ? phone : `+92${phone}`,
                password,
              };

        await login(loginPayload);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      // Set field errors based on specific error messages
      const lowerErrorMessage = errorMessage.toLowerCase();

      if (
        lowerErrorMessage.includes("password") &&
        (lowerErrorMessage.includes("invalid") ||
          lowerErrorMessage.includes("incorrect") ||
          lowerErrorMessage.includes("wrong"))
      ) {
        // Password-specific error - only highlight password field
        setFieldErrors({ password: true });
      } else if (
        lowerErrorMessage.includes("user not found") ||
        lowerErrorMessage.includes("email not found") ||
        lowerErrorMessage.includes("phone not found")
      ) {
        // User/email/phone not found - highlight the identifier field
        if (loginMode === "email") {
          setFieldErrors({ email: true });
        } else {
          setFieldErrors({ phone: true });
        }
      } else if (
        lowerErrorMessage.includes("invalid credentials") ||
        lowerErrorMessage.includes("authentication failed")
      ) {
        // Generic authentication failure - highlight both fields
        if (loginMode === "email") {
          setFieldErrors({ email: true, password: true });
        } else {
          setFieldErrors({ phone: true, password: true });
        }
      } else {
        // For any other error, don't highlight specific fields
        setFieldErrors({});
      }

      setToastMessage(errorMessage);
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    // Validate email or phone first
    if (loginMode === "email") {
      if (!email || !email.trim()) {
        setToastMessage("Please enter your email address");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ email: true });
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setToastMessage("Please enter a valid email address");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ email: true });
        return;
      }
    } else {
      if (!phone || !phone.trim()) {
        setToastMessage("Please enter your phone number");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ phone: true });
        return;
      }
      // Extract phone number without +92 prefix for validation
      const phoneDigits = phone.startsWith("+92") ? phone.substring(3) : phone;
      // Valid Pakistani phone: 3XXXXXXXXX (10 digits) or 03XXXXXXXXX (11 digits)
      if (!/^(3\d{9}|03\d{9})$/.test(phoneDigits)) {
        setToastMessage("Please enter a valid phone number");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ phone: true });
        return;
      }
    }

    setCodeLoading(true);
    setCodeError(null);
    setCodeSuccess(null);

    try {
      const sendPayload =
        loginMode === "email"
          ? { email }
          : { phone: phone.startsWith("+92") ? phone : `+92${phone}` };

      const response = await authService.sendLoginCode(sendPayload);

      setToastMessage(response.message || "Code sent successfully!");
      setToastSeverity("success");
      setToastOpen(true);
      setOtp("");
      setCountdown(60); // Start 1-minute countdown
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send code. Please try again.";
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setCodeLoading(false);
    }
  };

  // Check if send code button should be disabled
  const isSendCodeDisabled = () => {
    if (codeLoading || countdown > 0) return true;

    if (loginMode === "email") {
      return !email || !email.trim() || !/\S+@\S+\.\S+/.test(email);
    } else {
      if (!phone || !phone.trim()) return true;
      // Extract phone number without +92 prefix for validation
      const phoneDigits = phone.startsWith("+92") ? phone.substring(3) : phone;
      // Valid Pakistani phone: 3XXXXXXXXX (10 digits) or 03XXXXXXXXX (11 digits)
      return !/^(3\d{9}|03\d{9})$/.test(phoneDigits);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full px-12 pt-8">
        <Link
          to="/login-access"
          className="text-primary-600 hover:underline cursor-pointer"
        >
          <img src={WaterLogo} alt="HydroHub Logo" className="w-[190px]" />
        </Link>
        <div
          className="text-center font-extrabold flex items-center cursor-pointer"
          style={{ color: colors.primary[500] }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height="20px"
            width="20px"
            fill={colors.primary[500]}
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
          boxShadow: colors.shadow.lg,
          borderRadius: 2,
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <CardContent sx={{ px: 4, py: 5 }}>
          <Typography
            align="center"
            fontWeight="800"
            sx={{ fontSize: 24, color: colors.primary[500] }}
          >
            Business Control Center
          </Typography>
          <Typography
            variant="h4"
            align="center"
            fontWeight="800"
            sx={{ mt: 1, mb: 2, fontSize: 26, color: colors.text.primary }}
          >
            Log in
          </Typography>
          <Typography
            align="center"
            sx={{ mt: 1, mb: 3, fontSize: 15, color: colors.text.secondary }}
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
                color: colors.primary[500],
                textAlign: "right",
                fontSize: 14,
                cursor: "pointer",
                marginBottom: 0.5,
              }}
              onClick={() => {
                setLoginMode(loginMode === "email" ? "phone" : "email");
                setUseCodeLogin(false);
                setCodeError(null);
                setCodeSuccess(null);
                setOtp("");
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
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear error styling when user types
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: false }));
                    }
                  }}
                  error={errors.email}
                  sx={
                    fieldErrors.email
                      ? {
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#dc2626",
                              borderWidth: "2px",
                            },
                          },
                        }
                      : {}
                  }
                  endAdornment={
                    <LuMail
                      style={{ color: colors.text.secondary, fontSize: 22 }}
                    />
                  }
                />
              </div>
            ) : (
              <div className="mb-4">
                <PhoneInput
                  label="Phone Number"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    // Clear error styling when user types
                    if (fieldErrors.phone) {
                      setFieldErrors((prev) => ({ ...prev, phone: false }));
                    }
                  }}
                  error={errors.phone}
                  sx={
                    fieldErrors.phone
                      ? {
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#dc2626",
                              borderWidth: "2px",
                            },
                          },
                        }
                      : {}
                  }
                />
              </div>
            )}

            {/* Password or Code */}
            <div className="mb-2">
              {useCodeLogin ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {codeError && (
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: `${colors.status.error}20`,
                        border: `1px solid ${colors.status.error}40`,
                        borderRadius: 1,
                        color: colors.status.error,
                        fontSize: 14,
                      }}
                    >
                      {codeError}
                    </Box>
                  )}
                  {codeSuccess && (
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: `${colors.status.success}20`,
                        border: `1px solid ${colors.status.success}40`,
                        borderRadius: 1,
                        color: colors.status.success,
                        fontSize: 14,
                      }}
                    >
                      {codeSuccess}
                    </Box>
                  )}
                  <CustomInput
                    label="Enter verification code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(value);
                      // Clear error when user starts typing
                      if (codeError) {
                        setCodeError(null);
                      }
                      // Clear field error styling when user types
                      if (fieldErrors.otp) {
                        setFieldErrors((prev) => ({ ...prev, otp: false }));
                      }
                    }}
                    placeholder="Enter 6-digit code"
                    sx={
                      fieldErrors.otp
                        ? {
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#dc2626",
                                borderWidth: "2px",
                              },
                            },
                          }
                        : {}
                    }
                    endAdornment={
                      <button
                        className="send-code-btn"
                        disabled={isSendCodeDisabled()}
                        style={{
                          textTransform: "none",
                          height: "54px",
                          fontSize: 15,
                          color: isSendCodeDisabled()
                            ? colors.text.tertiary
                            : colors.text.secondary,
                          borderLeftWidth: 1,
                          paddingLeft: 15,
                          borderLeft: `1px solid ${colors.border.primary}`,
                          borderRadius: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                        onClick={handleSendCode}
                      >
                        {isLoading ? "Sending..." : countdown > 0 ? `Resend (${countdown}s)` : "Send code"}
                      </button>
                    }
                  />
                </Box>
              ) : (
                <CustomInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear error styling when user types
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: false }));
                    }
                  }}
                  error={errors.email || errors.password}
                  sx={
                    fieldErrors.password
                      ? {
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#dc2626",
                              borderWidth: "2px",
                            },
                          },
                        }
                      : {}
                  }
                  endAdornment={
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: colors.text.secondary, fontSize: 22 }}
                        />
                      ) : (
                        <Visibility
                          sx={{ color: colors.text.secondary, fontSize: 22 }}
                        />
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
                  color: colors.primary[500],
                  fontSize: 14,
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginBottom: 3,
                }}
                onClick={() => {
                  setUseCodeLogin(!useCodeLogin);
                  setCodeError(null);
                  setCodeSuccess(null);
                  setOtp("");
                  setErrors({ email: "", password: "", phone: "" });
                }}
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
                        color: colors.primary[500],
                        "&.Mui-checked": { color: colors.primary[500] },
                        padding: 0,
                        paddingX: 1,
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: colors.primary[500],
                      fontWeight: 400,
                      fontSize: 14,
                    },
                  }}
                />
                <Link
                  to="/forgot-password"
                  className="hover:underline text-sm"
                  style={{ color: colors.primary[500] }}
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

            {/* Demo Login Button for Testing */}
            {DEMO_MODE && (
              <Button
                variant="outlined"
                fullWidth
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await login({
                      email: "demo@hydrohub.pk",
                      password: "demo123",
                    });
                    navigate("/dashboard");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  color: colors.primary[500],
                  borderColor: colors.primary[500],
                  "&:hover": {
                    borderColor: colors.primary[600],
                    color: colors.primary[600],
                  },
                }}
              >
                Demo Login (Testing)
              </Button>
            )}
            <Box textAlign="center" mt={3}>
              <Link
                to="/"
                className="text-sm flex justify-center items-center"
                style={{ color: colors.text.secondary }}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 0 24 24"
                    width="20px"
                    fill={colors.text.secondary}
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
        align="center"
        sx={{
          mt: 4,
          mb: 3,
          maxWidth: 500,
          px: 4,
          fontSize: 14,
          color: colors.text.secondary,
        }}
      >
        By continuing, you agree to our{" "}
        <Link
          to="/terms"
          className="hover:underline"
          target="_blank"
          style={{ color: colors.primary[500] }}
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="hover:underline"
          target="_blank"
          style={{ color: colors.primary[500] }}
        >
          Privacy Policy
        </Link>{" "}
        for accounts registered in Pakistan.
      </Typography>

      <div className="w-full">
        <Footer />
      </div>

      {/* Snackbar for Toast Notifications */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
