import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import { BsQrCode } from "react-icons/bs";
import { RiUserLine } from "react-icons/ri";
import InstagramIcon from "../../assets/instagram.svg";
import FacebookIcon from "../../assets/facebook.svg";
import TwitterIcon from "../../assets/twitter.svg";
import XIcon from "../../assets/X.svg";
import WaterLogo from "../../assets/WATER-INN-logo.svg";
import { Footer } from "../../components/auth/Footer";
import { useTheme } from "../../contexts/ThemeContext";

export const LoginAccess = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full px-12 pt-8">
        <Link
          to="/login"
          className="hover:underline cursor-pointer"
          style={{ color: colors.primary[500] }}
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

          {/* QR Code Login */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/qr-login")}
            sx={{
              borderWidth: 2,
              borderRadius: 2,
              fontSize: 16,
              color: colors.text.primary,
              fontWeight: 400,
              mb: 2,
              borderColor: colors.border.primary,
              textTransform: 'none',
              "&:hover": {
                borderColor: colors.primary[500],
                color: colors.primary[500],
              },
              position: "relative",
            }}
          >
            <span className="">
              <BsQrCode
                style={{
                  position: "absolute",
                  left: "12px",
                  top: 7,
                  fontSize: "24px",
                }}
              />
            </span>
            Use QR code
          </Button>

          {/* Normal Login */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
              borderWidth: 2,
              borderRadius: 2,
              fontSize: 16,
              color: colors.text.primary,
              fontWeight: 500,
              textTransform: 'none',
              mb: 2,
              borderColor: colors.border.primary,
              "&:hover": {
                borderColor: colors.primary[500],
                color: colors.primary[500],
              },
              position: "relative",
            }}
          >
            <span className="">
              <RiUserLine
                style={{
                  position: "absolute",
                  left: "12px",
                  top: 8,
                  fontSize: "24px",
                }}
              />
            </span>
            Use phone / email / username
          </Button>

          {/* Contact & Access */}
          <Typography
            sx={{
              fontSize: 13.5,
              color: colors.text.secondary,
              mt: 1,
              mb: 3,
            }}
          >
            Need access?{" "}
            <Link
              to="/contact"
              style={{
                color: colors.primary[500],
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Contact us
            </Link>{" "}
            to get started with{" "}
            <span style={{ color: colors.primary[500], fontWeight: 600, cursor: "pointer" }}>HYDROHUB</span>
          </Typography>

          <Divider sx={{ my: 3, borderColor: colors.border.primary, color: colors.text.secondary }}>
            Follow us
          </Divider>

          {/* Social Icons */}
          <Box display="flex" justifyContent="center" gap={2.5}>
            <IconButton className="hover:opacity-80 transition-opacity">
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="w-[50px] h-[50px]"
              />
            </IconButton>
            <IconButton className="hover:opacity-80 transition-opacity">
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="w-[50px] h-[50px]"
              />
            </IconButton>
            <IconButton className="hover:opacity-80 transition-opacity">
              <img src={XIcon} alt="X" className="w-[50px] h-[50px]" />
            </IconButton>
            <IconButton className="hover:opacity-80 transition-opacity">
              <img
                src={TwitterIcon}
                alt="Twitter"
                className="w-[50px] h-[50px]"
              />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Terms */}
      <Typography
        align="center"
        sx={{ mt: 4, mb: 3, maxWidth: 500, px: 4, fontSize: 14, color: colors.text.secondary }}
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
    </div>
  );
};
