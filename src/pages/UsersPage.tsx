import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Divider,
} from "@mui/material";
import {
  DateRange,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Add,
  Download,
  Sort,
  ManageAccounts,
} from "@mui/icons-material";
import { useState } from "react";

export const UsersPage = () => {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [shift, setShift] = useState("");
  const [department, setDepartment] = useState("");

  const users = [
    {
      id: 1,
      name: "Jordan Stevenson",
      email: "susanna.Lind57@gmail.com",
      role: "Admin",
      plan: "Editor",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Author",
      plan: "Enterprise",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      role: "Maintainer",
      plan: "Team",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Mike Thompson",
      email: "mike.thompson@example.com",
      role: "Editor",
      plan: "Basic",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Subscriber",
      plan: "Editor",
      status: "Active",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const cards = [
    {
      title: "Active User",
      value: "21,459",
      change: "+29%",
      desc: "All staff currently authorized in the system",
      color: "#22c55e",
      icon: "🟢",
    },
    {
      title: "Present User",
      value: "4,567",
      change: "+19%",
      desc: "Staff checked in for the ongoing shift",
      color: "#3b82f6",
      icon: "📘",
    },
    {
      title: "On Leaves User",
      value: "19,860",
      change: "-15%",
      desc: "Staff officially marked on leave",
      color: "#f59e0b",
      icon: "🟡",
    },
    {
      title: "Inactive User",
      value: "19,830",
      change: "+17%",
      desc: "Staff no longer in operations",
      color: "#ef4444",
      icon: "🔴",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      {/* Cards Row */}
<Grid container spacing={3} sx={{ mb: 4 }}>
  {cards.map((card, idx) => (
    <Grid item size={3} key={idx}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header Row: Icon + Title + Menu */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  bgcolor:
                    card.title === "Active User"
                      ? "#e0f2fe"
                      : card.title === "Present User"
                      ? "#dcfce7"
                      : card.title === "On Leaves User"
                      ? "#fef9c3"
                      : "#fee2e2",
                  borderRadius: "10px",
                  p: 1.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 22,
                    color:
                      card.title === "Active User"
                        ? "#3b82f6"
                        : card.title === "Present User"
                        ? "#16a34a"
                        : card.title === "On Leaves User"
                        ? "#ca8a04"
                        : "#dc2626",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#374151" }}
              >
                {card.title}
              </Typography>
            </Box>

            <IconButton size="small" sx={{ color: "#9ca3af" }}>
              <span style={{ fontSize: "18px" }}>⋯</span>
            </IconButton>
          </Box>

          {/* Main Stat */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 400, color: "#111827", mr: 1 }}
            >
              {card.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#16a34a", fontWeight: 600 }}
            >
              {card.change}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#9ca3af",
              lineHeight: 1.5,
              fontSize: 13,
            }}
          >
            {card.desc}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* Filters Section */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Filter Controls */}
          <Grid container spacing={2} alignItems="center">
            <Grid item size={2.4}>
              <Button
                startIcon={<DateRange />}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: "#d1d5db",
                  textTransform: "none",
                  color: "#374151",
                  fontWeight: 500,
                  py: 1,
                  justifyContent: "flex-start",
                }}
              >
                25 Sep 25 - 24 Oct 25
              </Button>
            </Grid>
            <Grid container size={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: 14 }}>Select Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Select Status"
                  sx={{ fontSize: 14 }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: 14 }}>Select Role</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Select Role"
                  sx={{ fontSize: 14 }}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Editor">Editor</MenuItem>
                  <MenuItem value="Author">Author</MenuItem>
                  <MenuItem value="Maintainer">Maintainer</MenuItem>
                  <MenuItem value="Subscriber">Subscriber</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: 14 }}>Select Shift</InputLabel>
                <Select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  label="Select Shift"
                  sx={{ fontSize: 14 }}
                >
                  <MenuItem value="Morning">Morning Shift</MenuItem>
                  <MenuItem value="Evening">Evening Shift</MenuItem>
                  <MenuItem value="Night">Night Shift</MenuItem>
                  <MenuItem value="Flexible">Flexible Hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: 14 }}>Select Department</InputLabel>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label="Select Department"
                  sx={{ fontSize: 14 }}
                >
                  <MenuItem value="IT">Information Technology</MenuItem>
                  <MenuItem value="HR">Human Resources</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ marginTop: 3 }} />

          {/* Actions Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  textTransform: "none",
                  minWidth: "auto",
                }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Sort />}
                sx={{
                  textTransform: "none",
                  minWidth: "auto",
                }}
              >
                Sort By
              </Button>
              <Button
                variant="outlined"
                startIcon={<ManageAccounts />}
                sx={{
                  textTransform: "none",
                  minWidth: "auto",
                }}
              >
                Manage Columns
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                size="medium"
                placeholder="Search User..."
                sx={{
                  minWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    fontSize: 14,
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  textTransform: "none",
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  px: 3,
                }}
              >
                Add New User
              </Button>
            </Box>
          </Box>
        </CardContent>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u.id}
                hover
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={u.avatar} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography fontWeight={600} fontSize={14}>
                        {u.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={12}
                      >
                        @{u.name.split(" ")[0].toLowerCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2, fontSize: 14 }}>{u.email}</TableCell>
                <TableCell sx={{ py: 2, fontSize: 14 }}>{u.role}</TableCell>
                <TableCell sx={{ py: 2, fontSize: 14 }}>{u.plan}</TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={u.status}
                    size="small"
                    sx={{
                      bgcolor: u.status === "Active" ? "#dcfce7" : "#fef2f2",
                      color: u.status === "Active" ? "#16a34a" : "#dc2626",
                      fontWeight: 600,
                      fontSize: 12,
                      minWidth: 80,
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ py: 2 }}>
                  <IconButton
                    size="small"
                    sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f3f4f6" } }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#f59e0b", "&:hover": { bgcolor: "#fef3c7" } }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Table Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      ></Card>
    </Box>
  );
};
