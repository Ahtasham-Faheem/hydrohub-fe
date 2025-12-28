import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { MdArrowBack, MdPhoneAndroid, MdInfo } from "react-icons/md";
import WaterLogo from "../../assets/WATER-INN-logo.svg";
import QRImage from "../../assets/qr.png";
import { Footer } from "../../components/auth/Footer";
import { useTheme } from "../../contexts/ThemeContext";

export const QRCodeLogin = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [stayLoggedIn, setStayLoggedIn] = useState(true);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full px-12 pt-8 mb-8">
        <img src={WaterLogo} alt="HydroHub Logo" className="w-[190px]" />
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 max-w-4xl mx-auto w-full">
        
        {/* App Download Section */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 900,
            mb: 3,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: 3,
            boxShadow: colors.shadow.sm,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
              {/* Mobile Icon */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: colors.primary[100],
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MdPhoneAndroid size={32} style={{ color: colors.primary[600] }} />
              </Box>
              
              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: colors.text.primary,
                    textAlign: 'center'
                  }}
                >
                  Download the HYDROHUB app for your Mobile Device
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: colors.text.secondary,
                    lineHeight: 1.6,
                    fontSize: 14
                  }}
                >
                  Experience <strong>Secure, Efficient, and Accurate</strong> end-to-end water business management.{" "}
                  A complete business solution right in your pocket.
                </Typography>
                
                {/* Store Badges */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap",justifyContent: "center", mr: 5 }}>
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on App Store"
                    style={{ height: 60, cursor: "pointer" }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    style={{ height: 60, cursor: "pointer" }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* QR Code Login Section */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 900,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: 3,
            boxShadow: colors.shadow.sm,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", gap: 6, alignItems: "center", flexDirection: { xs: "column", md: "row" } }}>
              
              {/* Left Side - Steps */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    color: colors.text.primary,
                    fontSize: { xs: "1.25rem", md: "1.5rem" }
                  }}
                >
                  Steps to log in
                </Typography>

                {/* Step 1 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: colors.primary[100],
                      color: colors.primary[600],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    1
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.primary, fontWeight: 500, fontSize: 14 }}
                    >
                      Open <strong>HYDROHUB</strong>{" "}
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          verticalAlign: "middle",
                          ml: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: colors.primary[600],
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              backgroundColor: "white",
                              borderRadius: "50%",
                            }}
                          />
                        </Box>
                      </Box>{" "}
                      on your phone
                    </Typography>
                  </Box>
                </Box>

                {/* Step 2 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: colors.primary[100],
                      color: colors.primary[600],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    2
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.primary, fontWeight: 500, fontSize: 14 }}
                    >
                      On Android tap Menu{" "}
                      <Tooltip 
                        title="Look for the three horizontal lines (hamburger menu) usually located in the top-left corner of the app"
                        arrow
                        placement="top"
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            verticalAlign: "middle",
                            mx: 0.5,
                            cursor: "help",
                          }}
                        >
                          <MdInfo size={16} style={{ color: colors.text.secondary }} />
                        </Box>
                      </Tooltip>{" "}
                      • On iPhone tap Settings{" "}
                      <Tooltip 
                        title="Look for the gear icon (⚙️) usually found in the bottom navigation or top-right corner of the app"
                        arrow
                        placement="top"
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            verticalAlign: "middle",
                            ml: 0.5,
                            cursor: "help",
                          }}
                        >
                          <MdInfo size={16} style={{ color: colors.text.secondary }} />
                        </Box>
                      </Tooltip>
                    </Typography>
                  </Box>
                </Box>

                {/* Step 3 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                     width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: colors.primary[100],
                      color: colors.primary[600],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    3
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: colors.text.primary, fontWeight: 500, fontSize: 14 }}
                  >
                    Tap Linked devices, then Link device
                  </Typography>
                </Box>

                {/* Step 4 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      backgroundColor: colors.primary[100],
                      color: colors.primary[600],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  >
                    4
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: colors.text.primary, fontWeight: 500, fontSize: 14 }}
                  >
                    Scan the QR code to confirm
                  </Typography>
                </Box>

                {/* Stay logged in checkbox */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={stayLoggedIn}
                        onChange={(e) => setStayLoggedIn(e.target.checked)}
                        sx={{
                          color: colors.primary[600],
                          "&.Mui-checked": {
                            color: colors.primary[600],
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.text.primary, fontWeight: 500, fontSize: 14 }}
                        >
                          Stay logged in on this browser
                        </Typography>
                        <Tooltip 
                          title="When enabled, you won't need to scan the QR code again on this browser. Your session will remain active until you manually log out."
                          arrow
                          placement="top"
                        >
                          <Box sx={{ cursor: "help", display: "flex", alignItems: "center" }}>
                            <MdInfo size={16} style={{ color: colors.text.secondary }} />
                          </Box>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Box>
              </Box>

              {/* Right Side - QR Code */}
              <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", width: { xs: "100%", md: "auto" } }}>
                <Box
                  sx={{
                    width: 220,
                    height: 220,
                    backgroundColor: "white",
                    border: `3px solid ${colors.border.primary}`,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    mb: 3,
                  }}
                >
                  {/* QR Code Image */}
                  <img 
                    src={QRImage} 
                    alt="QR Code for Login" 
                    style={{ 
                      width: '190px', 
                      height: '190px',
                      objectFit: 'contain'
                    }} 
                  />
                </Box>

                {/* Phone Login Button */}
                <Typography
                  onClick={() => navigate("/login?mode=phone")}
                  sx={{
                    color: colors.text.primary,
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                   "&:hover": {
                    textDecoration: 'underline'
                  },
                  }}
                >
                  Log in with phone number
                </Typography>
              </Box>
            </Box>

            {/* Bottom Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${colors.border.primary}`,
              }}
            >
              <Button
                variant="text"
                onClick={() => navigate("/login-access")}
                sx={{
                  color: colors.text.secondary,
                  textTransform: "none",
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 500,
                  "&:hover": {
                    color: colors.primary[500],
                    backgroundColor: "transparent",
                  },
                }}
                startIcon={<MdArrowBack />}
              >
                Go back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Terms */}
      <Box sx={{ mt: 4, mb: 3, textAlign: "center", px: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: colors.text.secondary, maxWidth: 600, mx: "auto" }}
        >
          By continuing, you agree to our{" "}
          <Box
            component="span"
            sx={{
              color: colors.primary[500],
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Terms of Service
          </Box>{" "}
          and{" "}
          <Box
            component="span"
            sx={{
              color: colors.primary[500],
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Privacy Policy
          </Box>{" "}
          for accounts registered in Pakistan.
        </Typography>
      </Box>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};