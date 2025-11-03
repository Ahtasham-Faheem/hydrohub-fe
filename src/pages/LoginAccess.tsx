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
import InstagramIcon from "../assets/instagram.svg";
import FacebookIcon from "../assets/facebook.svg";
import TwitterIcon from "../assets/twitter.svg";
import XIcon from "../assets/X.svg";
import WaterLogo from "../assets/WATER-INN-logo.svg";
import { Footer } from "./Footer";

export const LoginAccess = () => {
  const navigate = useNavigate();

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

      <Card
        sx={{
          maxWidth: 500,
          width: "90%",
          boxShadow: 3,
          borderRadius: 2,
          margin: "auto 0",
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 5 }}>
          {/* Title */}
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

          {/* QR Code Login */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => (window.location.href = "/#")}
            sx={{
              borderWidth: 2,
              borderRadius: 2,
              fontSize: 16,
              color: "#374151",
              fontWeight: 400,
              mb: 2,
              borderColor: "#d1d5db",
              textTransform: 'none',
              "&:hover": {
                backgroundColor: "#eff6ff",
                borderColor: "#2092ec",
                color: "#2092ec",
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
              color: "#374151",
              fontWeight: 500,
              textTransform: 'none',
              mb: 2,
              borderColor: "#d1d5db",
              "&:hover": {
                backgroundColor: "#eff6ff",
                borderColor: "#2092ec",
                color: "#2092ec",
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
              color: "#6b7280",
              mt: 1,
              mb: 3,
            }}
          >
            Need access?{" "}
            <Link
              to="/contact"
              style={{
                color: "#2092ec",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Contact us
            </Link>{" "}
            to get started with{" "}
            <span style={{ color: "#2092ec", fontWeight: 600,cursor: "pointer" }}>HYDROHUB</span>
          </Typography>

          <Divider sx={{ my: 3 }}>Follow us</Divider>

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
