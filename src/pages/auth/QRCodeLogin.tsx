import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import WaterLogo from "../../assets/WATER-INN-logo.svg";
import { Footer } from "../../components/auth/Footer";
import { useTheme } from "../../contexts/ThemeContext";

export const QRCodeLogin = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full px-12 pt-8">
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

      <Card
        sx={{
          maxWidth: 500,
          width: "90%",
          boxShadow: colors.shadow.lg,
          borderRadius: 2,
          margin: "auto 0",
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 5 }}>
          {/* Title */}
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
            sx={{ mt: 1, mb: 1, fontSize: 26, color: colors.text.primary }}
          >
            Log in with QR Code
          </Typography>
          <Typography
            align="center"
            sx={{ mt: 1, mb: 4, fontSize: 15, color: colors.text.secondary }}
          >
            Empower your team, enhance performance and grow smarter everyday
          </Typography>

          {/* QR Code */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              borderRadius: 2,
              backgroundColor: colors.background.secondary,
            }}
          >
            <Box
              sx={{
                width: 160,
                height: 160,
                backgroundColor: "white",
                borderRadius: 1,
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* QR Code SVG Pattern */}
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                {/* Corner squares */}
                <rect x="0" y="0" width="60" height="60" fill="black"/>
                <rect x="10" y="10" width="40" height="40" fill="white"/>
                <rect x="20" y="20" width="20" height="20" fill="black"/>
                
                <rect x="120" y="0" width="60" height="60" fill="black"/>
                <rect x="130" y="10" width="40" height="40" fill="white"/>
                <rect x="140" y="20" width="20" height="20" fill="black"/>
                
                <rect x="0" y="120" width="60" height="60" fill="black"/>
                <rect x="10" y="130" width="40" height="40" fill="white"/>
                <rect x="20" y="140" width="20" height="20" fill="black"/>
                
                {/* Timing patterns */}
                {Array.from({length: 9}, (_, i) => (
                  <rect key={`h-${i}`} x={70 + i * 10} y="30" width="10" height="10" fill={i % 2 === 0 ? "black" : "white"}/>
                ))}
                {Array.from({length: 9}, (_, i) => (
                  <rect key={`v-${i}`} x="30" y={70 + i * 10} width="10" height="10" fill={i % 2 === 0 ? "black" : "white"}/>
                ))}
                
                {/* Data modules - random pattern */}
                <rect x="70" y="70" width="10" height="10" fill="black"/>
                <rect x="80" y="70" width="10" height="10" fill="white"/>
                <rect x="90" y="70" width="10" height="10" fill="black"/>
                <rect x="100" y="70" width="10" height="10" fill="black"/>
                <rect x="110" y="70" width="10" height="10" fill="white"/>
                
                <rect x="70" y="80" width="10" height="10" fill="white"/>
                <rect x="80" y="80" width="10" height="10" fill="black"/>
                <rect x="90" y="80" width="10" height="10" fill="white"/>
                <rect x="100" y="80" width="10" height="10" fill="black"/>
                <rect x="110" y="80" width="10" height="10" fill="black"/>
                
                <rect x="70" y="90" width="10" height="10" fill="black"/>
                <rect x="80" y="90" width="10" height="10" fill="black"/>
                <rect x="90" y="90" width="10" height="10" fill="black"/>
                <rect x="100" y="90" width="10" height="10" fill="white"/>
                <rect x="110" y="90" width="10" height="10" fill="black"/>
                
                <rect x="70" y="100" width="10" height="10" fill="white"/>
                <rect x="80" y="100" width="10" height="10" fill="black"/>
                <rect x="90" y="100" width="10" height="10" fill="black"/>
                <rect x="100" y="100" width="10" height="10" fill="black"/>
                <rect x="110" y="100" width="10" height="10" fill="white"/>
                
                <rect x="70" y="110" width="10" height="10" fill="black"/>
                <rect x="80" y="110" width="10" height="10" fill="white"/>
                <rect x="90" y="110" width="10" height="10" fill="white"/>
                <rect x="100" y="110" width="10" height="10" fill="black"/>
                <rect x="110" y="110" width="10" height="10" fill="black"/>
                
                {/* More data modules */}
                <rect x="120" y="70" width="10" height="10" fill="black"/>
                <rect x="130" y="70" width="10" height="10" fill="white"/>
                <rect x="140" y="70" width="10" height="10" fill="black"/>
                <rect x="150" y="70" width="10" height="10" fill="white"/>
                <rect x="160" y="70" width="10" height="10" fill="black"/>
                <rect x="170" y="70" width="10" height="10" fill="white"/>
                
                <rect x="120" y="80" width="10" height="10" fill="white"/>
                <rect x="130" y="80" width="10" height="10" fill="black"/>
                <rect x="140" y="80" width="10" height="10" fill="white"/>
                <rect x="150" y="80" width="10" height="10" fill="black"/>
                <rect x="160" y="80" width="10" height="10" fill="white"/>
                <rect x="170" y="80" width="10" height="10" fill="black"/>
                
                {/* Bottom section */}
                <rect x="70" y="120" width="10" height="10" fill="black"/>
                <rect x="80" y="120" width="10" height="10" fill="white"/>
                <rect x="90" y="120" width="10" height="10" fill="black"/>
                <rect x="100" y="120" width="10" height="10" fill="black"/>
                <rect x="110" y="120" width="10" height="10" fill="white"/>
                <rect x="120" y="120" width="10" height="10" fill="black"/>
                <rect x="130" y="120" width="10" height="10" fill="white"/>
                <rect x="140" y="120" width="10" height="10" fill="black"/>
                <rect x="150" y="120" width="10" height="10" fill="white"/>
                <rect x="160" y="120" width="10" height="10" fill="black"/>
                <rect x="170" y="120" width="10" height="10" fill="white"/>
                
                <rect x="70" y="130" width="10" height="10" fill="white"/>
                <rect x="80" y="130" width="10" height="10" fill="black"/>
                <rect x="90" y="130" width="10" height="10" fill="white"/>
                <rect x="100" y="130" width="10" height="10" fill="black"/>
                <rect x="110" y="130" width="10" height="10" fill="black"/>
                <rect x="120" y="130" width="10" height="10" fill="white"/>
                <rect x="130" y="130" width="10" height="10" fill="black"/>
                <rect x="140" y="130" width="10" height="10" fill="white"/>
                <rect x="150" y="130" width="10" height="10" fill="black"/>
                <rect x="160" y="130" width="10" height="10" fill="white"/>
                <rect x="170" y="130" width="10" height="10" fill="black"/>
              </svg>
            </Box>
          </Box>

          {/* Instructions */}
          <Box sx={{ textAlign: "left", mb: 4 }}>
            <Typography
              variant="body1"
              sx={{ 
                mb: 1, 
                fontWeight: 300,
                color: colors.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <Box
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                1.
              </Box>
              Scan with your mobile device's camera
            </Typography>
            <Typography
              variant="body1"
              sx={{ 
                mb: 2, 
                fontWeight: 300,
                color: colors.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <Box
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600
                }}
              >
                2.
              </Box>
              Approve login on your device
            </Typography>
          </Box>

          {/* Go Back Button */}
          <Button
            variant="text"
            onClick={() => navigate("/login-access")}
            sx={{
              color: colors.text.secondary,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 500,
              "&:hover": {
                color: colors.primary[500],
                backgroundColor: "transparent",
              },
            }}
            startIcon={<MdArrowBack />}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>

      {/* Terms */}
      <Typography
        align="center"
        sx={{ mt: 4, mb: 3, maxWidth: 500, px: 4, fontSize: 14, color: colors.text.secondary }}
      >
        By continuing, you agree to our{" "}
        <span
          className="hover:underline cursor-pointer"
          style={{ color: colors.primary[500] }}
        >
          Terms of Service
        </span>{" "}
        and{" "}
        <span
          className="hover:underline cursor-pointer"
          style={{ color: colors.primary[500] }}
        >
          Privacy Policy
        </span>{" "}
        for accounts registered in Pakistan.
      </Typography>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};