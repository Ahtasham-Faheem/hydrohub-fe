import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff, Phone, Email } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { CustomInput } from "../components/CustomInput";
import { PrimaryButton } from "../components/PrimaryButton";
import WaterLogo from "../assets/WATER-INN-logo.svg";
import { Footer } from "./Footer";

export const ResetPassword = () => {
  const [resetMode, setResetMode] = useState<"email" | "phone">("email");
  const [countryCode, setCountryCode] = useState("+92");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (resetMode === "email" && !email)
      return alert("Please enter your email first");
    if (resetMode === "phone" && !phone)
      return alert("Please enter your phone number first");
    alert(
      `Verification code sent to ${
        resetMode === "email" ? email : countryCode + phone
      }`
    );
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      {/* Header - Reduced padding */}
      <div className="flex justify-between items-center w-full px-12 pt-8">
        <Link
          to="/login"
          className="text-primary-600 hover:underline cursor-pointer"
        >
          <img
            src={WaterLogo}
            alt="HydroHub Logo"
            className="w-[190px]" // Reduced size
          />
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
          boxShadow: 3,
          borderRadius: 2,
          margin: 'auto 0' // Centers vertically
        }}
      >
        <CardContent sx={{ px: 4, py: 5 }}> {/* Reduced padding */}
          <Typography
            variant="h4"
            align="center"
            fontWeight="800"
            className="text-primary-600 !text-2xl" // Reduced font size
          >
            Business Control Center
          </Typography>
          <Typography
            variant="h4"
            align="center"
            fontWeight="800"
            color="text.primary"
            sx={{ mt: 1, mb: 2, fontSize: 26 }} // Reduced margins and font size
          >
            Reset Password
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 1, mb: 3, fontSize: 15 }} // Reduced margins and font size
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
                  color: "#2092ec",
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
                onChange={(e) => setEmail(e.target.value)}
                endAdornment={<Email sx={{ color: "#9ca3af", fontSize: 22 }} />} // Reduced icon size
              />
            ) : (
              <CustomInput
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                startAdornment={
                  <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="border-none bg-transparent text-sm text-gray-600 cursor-pointer pr-2 focus:outline-none" // Reduced font size
                    >
                      <option value="+92">PK +92</option>
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
                    </select>
                    <span className="ml-2 text-gray-400 border-r border-text-300 h-6"></span>
                  </Box>
                }
                endAdornment={<Phone sx={{ color: "#9ca3af", fontSize: 22 }} />} // Reduced icon size
              />
            )}

            {/* Code input */}
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
                      height: "38px", // Reduced height
                      border: "none",
                      fontSize: 15, // Reduced font size
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

            {/* Password field */}
            <CustomInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ color: "#9ca3af", fontSize: 22 }} /> // Reduced icon size
                  ) : (
                    <Visibility sx={{ color: "#9ca3af", fontSize: 22 }} /> // Reduced icon size
                  )}
                </IconButton>
              }
            />

            <PrimaryButton type="submit" fullWidth>
              Reset Password {/* Changed button text */}
            </PrimaryButton>

            {/* Back to Login link */}
            <Box textAlign="center" mt={1}>
              <Link
                to="/login"
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
                Back to Login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Terms - Reduced margins */}
      <Typography
        color="text.secondary"
        align="center"
        sx={{ mt: 3, mb: 2, maxWidth: 500, px: 4, fontSize: 14 }}
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