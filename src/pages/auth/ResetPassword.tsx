import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/common/CustomInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import WaterLogo from "../../assets/WATER-INN-logo.svg";
import { Footer } from "../../components/auth/Footer";
import { authService } from "../../services/api";
import { useTheme } from "../../contexts/ThemeContext";
import { PhoneInput } from "../../components/common/PhoneInput";

export const ResetPassword = () => {
  const { colors } = useTheme();
  const [resetMode, setResetMode] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", phone: "", otp: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("error");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  // Countdown timer for resend code
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    setErrors({ email: "", phone: "", otp: "", password: "" });
    setFieldErrors({});
    setIsLoading(true);
    
    // Validate input first
    if (resetMode === "email") {
      if (!email || !email.trim()) {
        setToastMessage("Please enter your email address");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ email: true });
        setIsLoading(false);
        return;
      }
      // More robust email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setToastMessage("Please enter a valid email address");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ email: true });
        setIsLoading(false);
        return;
      }
    } else {
      if (!phone || !phone.trim()) {
        setToastMessage("Please enter your phone number");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ phone: true });
        setIsLoading(false);
        return;
      }
      // Extract phone number without country code for validation
      const phoneNumber = phone.startsWith('+92') ? phone.substring(3) : phone;
      if (!/^(3\d{9}|03\d{8})$/.test(phoneNumber)) {
        setToastMessage("Please enter a valid Pakistani phone number");
        setToastSeverity("error");
        setToastOpen(true);
        setFieldErrors({ phone: true });
        setIsLoading(false);
        return;
      }
    }
    
    try {
      const requestData = resetMode === "email" 
        ? { email: email.trim() } 
        : { phone: phone.startsWith('+92') ? phone : `+92${phone}` };
      
      await authService.requestResetPassword(requestData);
      setCodeSent(true);
      setCountdown(60); // Start 1-minute countdown
      setToastMessage(`Verification code sent to ${
        resetMode === "email" ? email : phone
      }`);
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send code";
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setToastOpen(true);
      
      // Set field errors based on error type and also for API failures
      if (errorMessage.toLowerCase().includes('email') || resetMode === "email") {
        setFieldErrors({ email: true });
      } else if (errorMessage.toLowerCase().includes('phone') || resetMode === "phone") {
        setFieldErrors({ phone: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if send code button should be disabled
  const isSendCodeDisabled = () => {
    if (isLoading || countdown > 0) return true;
    
    if (resetMode === "email") {
      return !email || !email.trim() || !/\S+@\S+\.\S+/.test(email);
    } else {
      if (!phone || !phone.trim()) return true;
      const phoneNumber = phone.startsWith('+92') ? phone.substring(3) : phone;
      return !/^(3\d{9}|03\d{8})$/.test(phoneNumber);
    }
  };

  // Validate password strength
  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(pwd)) return "Password must contain at least one number";
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(pwd)) return "Password must contain at least one special character";
    return null;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", phone: "", otp: "", password: "" });
    setFieldErrors({});
    setIsLoading(true);
    
    let hasErrors = false;
    let errorMessage = "";
    const newFieldErrors: { [key: string]: boolean } = {};
    
    // Validate all fields
    if (resetMode === "email" && (!email || !email.trim())) {
      errorMessage = "Please enter your email address";
      newFieldErrors.email = true;
      hasErrors = true;
    } else if (resetMode === "email" && !/\S+@\S+\.\S+/.test(email)) {
      errorMessage = "Please enter a valid email address";
      newFieldErrors.email = true;
      hasErrors = true;
    }
    
    if (!hasErrors && resetMode === "phone" && (!phone || !phone.trim())) {
      errorMessage = "Please enter your phone number";
      newFieldErrors.phone = true;
      hasErrors = true;
    } else if (!hasErrors && resetMode === "phone") {
      const phoneNumber = phone.startsWith('+92') ? phone.substring(3) : phone;
      if (!/^(3\d{9}|03\d{8})$/.test(phoneNumber)) {
        errorMessage = "Please enter a valid Pakistani phone number";
        newFieldErrors.phone = true;
        hasErrors = true;
      }
    }
    
    if (!hasErrors && (!otp || !otp.trim())) {
      errorMessage = "Please enter the verification code";
      newFieldErrors.otp = true;
      hasErrors = true;
    } else if (!hasErrors && !/^\d{6}$/.test(otp)) {
      errorMessage = "Verification code must be exactly 6 digits";
      newFieldErrors.otp = true;
      hasErrors = true;
    }
    
    if (!hasErrors) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        errorMessage = passwordError;
        newFieldErrors.password = true;
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      setToastMessage(errorMessage);
      setToastSeverity("error");
      setToastOpen(true);
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // Use verifyLoginCode to verify the code, then call resetPassword
      // const verifyData = {
      //   ...(resetMode === "email" ? { email } : { phone: phone.startsWith('+92') ? phone : `+92${phone}` }),
      //   code: otp,
      // };
      
      // First verify the code
      // await authService.verifyLoginCode(verifyData);
      
      // If verification successful, proceed with password reset
      const resetData = {
        ...(resetMode === "email" ? { email } : { phone: phone.startsWith('+92') ? phone : `+92${phone}` }),
        code: otp,
        newPassword: password,
      };
      
      await authService.resetPassword(resetData);
      
      setToastMessage("Password reset successfully! Redirecting to login...");
      setToastSeverity("success");
      setToastOpen(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to reset password";
      setToastMessage(errorMsg);
      setToastSeverity("error");
      setToastOpen(true);
      
      // Set appropriate field errors based on error message
      if (errorMsg.toLowerCase().includes('code') || errorMsg.toLowerCase().includes('invalid')) {
        setFieldErrors({ otp: true });
      } else if (errorMsg.toLowerCase().includes('password')) {
        setFieldErrors({ password: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header - Reduced padding */}
      <div className="flex justify-between items-center w-full px-12 pt-8">
        <Link
          to="/login"
          className="hover:underline cursor-pointer"
          style={{ color: colors.primary[500] }}
        >
          <img
            src={WaterLogo}
            alt="HydroHub Logo"
            className="w-[190px]" // Reduced size
          />
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
          <span className="font-medium text-sm underline ml-1"> {/* Reduced text size */}
            Feedback and help
          </span>
        </div>
      </div>

      {/* Reset Password Card - Reduced padding and size */}
      <Card
        sx={{
          maxWidth: 500, // Reduced width
          width: "90%",
          boxShadow: colors.shadow.lg,
          borderRadius: 2,
          margin: 'auto 0', // Centers vertically
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <CardContent sx={{ px: 4, py: 5 }}> {/* Reduced padding */}
          <Typography
            variant="h4"
            align="center"
            fontWeight="800"
            sx={{ fontSize: 24, color: colors.primary[500] }} // Reduced font size
          >
            Business Control Center
          </Typography>
          <Typography
            variant="h4"
            align="center"
            fontWeight="800"
            sx={{ mt: 1, mb: 2, fontSize: 26, color: colors.text.primary }} // Reduced margins and font size
          >
            Reset Password
          </Typography>
          <Typography
            align="center"
            sx={{ mt: 1, mb: 3, fontSize: 15, color: colors.text.secondary }} // Reduced margins and font size
          >
            Empower your team, enhance performance and grow smarter everyday
          </Typography>

          <Box
            component="form"
            onSubmit={handleReset}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Label & Toggle */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <div></div>
              <Typography
                sx={{
                  color: colors.primary[500],
                  fontSize: 14, // Reduced font size
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() =>
                  setResetMode(resetMode === "email" ? "phone" : "email")
                }
              >
                {resetMode === "email"
                  ? "Reset with Phone"
                  : "Reset with Email"}
              </Typography>
            </Box>

            {/* Email / Phone Input */}
            {resetMode === "email" ? (
              <CustomInput
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear error styling when user types
                  if (fieldErrors.email) {
                    setFieldErrors(prev => ({ ...prev, email: false }));
                  }
                }}
                error={errors.email}
                sx={fieldErrors.email ? { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: colors.status.error }, color: colors.text.primary } } : {}}
                endAdornment={<Email sx={{ color: colors.text.secondary, fontSize: 22 }} />}
              />
            ) : (
              <PhoneInput
                label="Phone Number"
                value={phone}
                onChange={(value: string) => {
                  setPhone(value);
                  // Clear error styling when user types
                  if (fieldErrors.phone) {
                    setFieldErrors(prev => ({ ...prev, phone: false }));
                  }
                }}
                error={errors.phone}
                sx={fieldErrors.phone ? { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: colors.status.error } } } : {}}
              />
            )}

            {/* Code input */}
            <Box>
              <CustomInput
                label="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  // Only allow numeric input and limit to 6 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  // Clear error styling when user types
                  if (fieldErrors.otp) {
                    setFieldErrors(prev => ({ ...prev, otp: false }));
                  }
                }}
                error={errors.otp}
                disabled={!codeSent}
                placeholder="Enter 6-digit code"
                sx={{
                  ...(fieldErrors.otp ? { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: colors.status.error, borderWidth: "2px" } } } : {}),
                  // Improve disabled text visibility
                  "& .MuiOutlinedInput-root.Mui-disabled": {
                    cursor: "not-allowed",
                    "& input": {
                      color: colors.text.secondary,
                      WebkitTextFillColor: colors.text.secondary,
                      cursor: "not-allowed",
                    },
                    "& fieldset": {
                      borderColor: colors.border.secondary,
                    }
                  },
                  "& .MuiInputLabel-root.Mui-disabled": {
                    color: colors.text.secondary,
                  }
                }}
                endAdornment={
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      height: "38px",
                      border: "none",
                      fontSize: 15,
                      color: isSendCodeDisabled() ? colors.text.secondary : colors.text.secondary,
                      borderLeft: `1px solid ${colors.border.primary}`,
                      borderRadius: 0,
                      paddingRight: 0,
                      cursor: isSendCodeDisabled() ? "not-allowed" : "pointer",
                      ":hover": { textDecoration: isSendCodeDisabled() ? "none" : "underline" },
                      "&.Mui-disabled": {
                        color: colors.text.secondary,
                        cursor: "not-allowed",
                      }
                    }}
                    onClick={handleSendCode}
                    disabled={isSendCodeDisabled()}
                  >
                    {isLoading ? "Sending..." : countdown > 0 ? `Resend (${countdown}s)` : "Send code"}
                  </Button>
                }
              />
            </Box>

            {/* Password field */}
            <CustomInput
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Clear error styling when user types
                if (fieldErrors.password) {
                  setFieldErrors(prev => ({ ...prev, password: false }));
                }
              }}
              error={errors.password}
              disabled={!codeSent || otp.length !== 6}
              placeholder="Enter new password"
              sx={{
                ...(fieldErrors.password ? { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: colors.status.error, borderWidth: "2px" } } } : {}),
                // Improve disabled text visibility
                "& .MuiOutlinedInput-root.Mui-disabled": {
                  cursor: "not-allowed",
                  "& input": {
                    color: colors.text.secondary,
                    WebkitTextFillColor: colors.text.secondary,
                    cursor: "not-allowed",
                  },
                  "& fieldset": {
                    borderColor: colors.border.secondary,
                  }
                },
                "& .MuiInputLabel-root.Mui-disabled": {
                  color: colors.text.secondary,
                }
              }}
              endAdornment={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={!codeSent || otp.length !== 6}
                  sx={{
                    cursor: (!codeSent || otp.length !== 6) ? "not-allowed" : "pointer",
                    "&.Mui-disabled": {
                      cursor: "not-allowed",
                    }
                  }}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ 
                      color: (!codeSent || otp.length !== 6) ? colors.text.tertiary : colors.text.secondary, 
                      fontSize: 22,
                      cursor: (!codeSent || otp.length !== 6) ? "not-allowed" : "pointer"
                    }} />
                  ) : (
                    <Visibility sx={{ 
                      color: (!codeSent || otp.length !== 6) ? colors.text.tertiary : colors.text.secondary, 
                      fontSize: 22,
                      cursor: (!codeSent || otp.length !== 6) ? "not-allowed" : "pointer"
                    }} />
                  )}
                </IconButton>
              }
            />

            {/* Password requirements */}
            {password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: 12 }}>
                  Password must contain:
                </Typography>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="caption" sx={{ 
                    color: password.length >= 8 ? colors.status.success : colors.status.error, 
                    fontSize: 11,
                    display: 'block'
                  }}>
                    • At least 8 characters
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: /(?=.*[a-z])/.test(password) ? colors.status.success : colors.status.error, 
                    fontSize: 11,
                    display: 'block'
                  }}>
                    • One lowercase letter
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: /(?=.*[A-Z])/.test(password) ? colors.status.success : colors.status.error, 
                    fontSize: 11,
                    display: 'block'
                  }}>
                    • One uppercase letter
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: /(?=.*\d)/.test(password) ? colors.status.success : colors.status.error, 
                    fontSize: 11,
                    display: 'block'
                  }}>
                    • One number
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password) ? colors.status.success : colors.status.error, 
                    fontSize: 11,
                    display: 'block'
                  }}>
                    • One special character
                  </Typography>
                </Box>
              </Box>
            )}

            <PrimaryButton 
              type="submit" 
              fullWidth 
              disabled={isLoading || !codeSent || otp.length !== 6 || !password}
            >
              {isLoading ? "Processing..." : "Reset Password"}
            </PrimaryButton>

            {/* Back to Login link */}
            <Box textAlign="center" mt={1}>
              <Link
                to="/login"
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
                Back to Login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Terms - Reduced margins */}
      <Typography
        align="center"
        sx={{ mt: 3, mb: 2, maxWidth: 500, px: 4, fontSize: 14, color: colors.text.secondary }}
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