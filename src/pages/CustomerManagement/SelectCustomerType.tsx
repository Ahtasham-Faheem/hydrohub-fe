import { Box, Card, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  CustomerFormProvider,
  useCustomerForm,
} from "../../contexts/CustomerFormContext";
import {
  MdOutlineHome,
  MdOutlineStorefront,
  MdOutlineWork,
} from "react-icons/md";

const SelectCustomerTypeContent = () => {
  const navigate = useNavigate();
  const { setCustomerType } = useCustomerForm();

  const handleSelectType = (type: "domestic" | "business" | "commercial") => {
    setCustomerType(type);
    if (type === "domestic") {
      navigate("/dashboard/customer-profiles/create/domestic");
    } else if (type === "business") {
      navigate("/dashboard/customer-profiles/create/business");
    } else if (type === "commercial") {
      navigate("/dashboard/customer-profiles/create/commercial");
    }
  };

  const customerTypes = [
    {
      type: "domestic",
      title: "Domestic Customer",
      description:
        "Individual/Household customer for residential water delivery",
      icon: <MdOutlineHome size={48} />,
      color: "var(--color-primary-600)",
    },
    {
      type: "business",
      title: "Business Customer",
      description:
        "Commercial business or company requiring water delivery services",
      icon: <MdOutlineStorefront size={48} />,
      color: "#10B981",
    },
    {
      type: "commercial",
      title: "Commercial / Other Customer",
      description:
        "Industrial, institutional, or other specialized water delivery",
      icon: <MdOutlineWork size={48} />,
      color: "#F59E0B",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Create New Customer
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
            }}
          >
            Select the type of customer you want to create
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {customerTypes.map((item) => (
            <Card
              key={item.type}
              sx={{
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid transparent",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  borderColor: item.color,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  color: item.color,
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                {item.icon}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  flexGrow: 1,
                  mb: 2,
                }}
              >
                {item.description}
              </Typography>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: item.color,
                  "&:hover": {
                    backgroundColor: item.color,
                    opacity: 0.9,
                  },
                  mt: "auto",
                }}
                onClick={() => handleSelectType(item.type as any)}
              >
                Select
              </Button>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export const SelectCustomerType = () => (
  <CustomerFormProvider>
    <SelectCustomerTypeContent />
  </CustomerFormProvider>
);
