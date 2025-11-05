import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PrimaryButton } from "../PrimaryButton";

interface PersonalInformationProps {
  image: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageReset: () => void;
}

export const PersonalInformation = ({ image, onImageUpload, onImageReset }: PersonalInformationProps) => {
  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: "5%",
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {image ? (
              <img
                src={image}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography color="textSecondary">No Image</Typography>
            )}
          </Box>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="photo-upload"
            type="file"
            onChange={onImageUpload}
          />
          <div className="flex flex-col gap-2 justify-start">
            <Box sx={{ display: "flex", gap: 1 }}>
              <PrimaryButton
                className="mx-6"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                Upload New Photo
              </PrimaryButton>
              {image && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onImageReset}
                >
                  Reset
                </Button>
              )}
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Allowed JPG, GIF or PNG. Max size of 800K
            </Typography>
          </div>
        </Box>
      </Box>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Employee ID"
          variant="outlined"
          placeholder="#001"
        />
        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <Select label="Title">
            <MenuItem value="Mr">Mr</MenuItem>
            <MenuItem value="Mrs">Mrs</MenuItem>
            <MenuItem value="Ms">Ms</MenuItem>
            <MenuItem value="Dr">Dr</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          placeholder="John Doe"
        />
        <TextField
          fullWidth
          label="Father Name"
          variant="outlined"
          placeholder="Enter father's name"
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date of Birth" sx={{ width: "100%" }} />
        </LocalizationProvider>
        <TextField fullWidth label="National ID" variant="outlined" />
      </Stack>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select label="Gender">
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Marital Status</InputLabel>
          <Select label="Marital Status">
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="married">Married</MenuItem>
            <MenuItem value="divorced">Divorced</MenuItem>
            <MenuItem value="widowed">Widowed</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
};