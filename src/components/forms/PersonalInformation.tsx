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

export const PersonalInformation = ({
  image,
  onImageUpload,
  onImageReset,
}: PersonalInformationProps) => {
  return (
    <Stack spacing={3}>
      {/* Profile Upload Section */}
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
              <Typography color="textSecondary">Profile Photo</Typography>
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
                <Button variant="outlined" color="error" onClick={onImageReset}>
                  Reset
                </Button>
              )}
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Allowed JPG, GIF or PNG. Max size 800KB.
            </Typography>
          </div>
        </Box>
      </Box>

      {/* Employee ID + Title */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Employee ID"
          variant="outlined"
          placeholder="#001"
          InputProps={{ readOnly: true }}
          helperText="View only — get API call to fetch next available ID for vendor"
        />
        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <Select label="Title" defaultValue="Mr">
            <MenuItem value="Mr">Mr</MenuItem>
            <MenuItem value="Mrs">Mrs</MenuItem>
            <MenuItem value="Ms">Ms</MenuItem>
            <MenuItem value="Dr">Dr</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* First Name + Last Name */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          placeholder="John"
        />
        <TextField
          fullWidth
          label="Last Name"
          variant="outlined"
          placeholder="Doe"
        />
      </Stack>

      {/* Email + Phone */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          placeholder="john.doe@waterinn.com"
          type="email"
        />
        <TextField
          fullWidth
          label="Phone"
          variant="outlined"
          placeholder="+92 302 6648100"
        />
      </Stack>

      {/* Father Name + Date of Birth */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Father Name"
          variant="outlined"
          placeholder="Michael Doe"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            sx={{ width: "100%" }}
          />
        </LocalizationProvider>
      </Stack>

      {/* Gender + National ID */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select label="Gender" defaultValue="Male">
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="National ID"
          variant="outlined"
          placeholder="35101-988945510-3"
        />
      </Stack>

      {/* Marital Status + Password */}
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Marital Status</InputLabel>
          <Select label="Marital Status" defaultValue="Single">
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          placeholder="********"
        />
      </Stack>

      {/* Confirm Password */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          type="password"
          placeholder="********"
        />
        <div className="w-full"></div>
      </Stack>
    </Stack>
  );
};
