// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Avatar,
//   IconButton,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Chip,
//   Divider,
//   Menu,
//   Popover,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Switch,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import dayjs from "dayjs";
// import {
//   DateRange,
//   Edit,
//   Delete,
//   Visibility,
// } from "@mui/icons-material";
// import { TbSortAscendingSmallBig } from "react-icons/tb";
// import { IoIosArrowDown } from "react-icons/io";
// import { BsLayoutThreeColumns } from "react-icons/bs";
// import { LuUserRoundCheck, LuUserRoundX, LuSearch } from "react-icons/lu";
// import { BsThreeDots } from "react-icons/bs";
// import { useState, useEffect } from "react";
// import { CustomInput } from "../components/CustomInput";
// import { PrimaryButton } from "../components/PrimaryButton";
// import { usersService } from "../services/api";
// import type { User } from "../types/user";

// export const UsersPage = () => {
//   const [status, setStatus] = useState("");
//   const [role, setRole] = useState("");
//   const [search, setSearch] = useState("");
//   const [shift, setShift] = useState("");
//   const [department, setDepartment] = useState("");
//   const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);
//   const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
//   const [manageAnchorEl, setManageAnchorEl] = useState<null | HTMLElement>(
//     null
//   );
//   const handleSaveColumns = () => {
//     setManageAnchorEl(null);
//   };

//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await usersService.getUsers(currentPage, 10);
//         setUsers(response.data);
//         setTotalPages(response.pagination.totalPages);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [currentPage]);

//   const dateRangeOptions = [
//     { label: "Today", value: "today", date: dayjs() },
//     {
//       label: "Yesterday",
//       value: "yesterday",
//       date: dayjs().subtract(1, "day"),
//     },
//     { label: "Last 7 Days", value: "last7", date: dayjs().subtract(7, "day") },
//     {
//       label: "Last 30 Days",
//       value: "last30",
//       date: dayjs().subtract(30, "day"),
//     },
//     { label: "This Month", value: "thisMonth", date: dayjs().startOf("month") },
//     {
//       label: "Last Month",
//       value: "lastMonth",
//       date: dayjs().subtract(1, "month").startOf("month"),
//     },
//   ];

//   const handleToggleColumn = (id: number) => {
//     setColumns((prev) =>
//       prev.map((col) =>
//         col.id === id ? { ...col, enabled: !col.enabled } : col
//       )
//     );
//   };

//   const cards = [
//     {
//       title: "Active Users",
//       value: users.filter((u) => u.status === "active").length.toString(),
//       change: "+0%",
//       desc: "All staff currently authorized in the system",
//       color: "#22c55e",
//       icon: <LuUserRoundCheck />,
//     },
//     {
//       title: "Present User",
//       value: users
//         .filter((u) => u.isEmailVerified && u.isPhoneVerified)
//         .length.toString(),
//       change: "+0%",
//       desc: "Staff checked in for the ongoing shift",
//       color: "#3b82f6",
//       icon: <LuUserRoundCheck />,
//     },
//     {
//       title: "On Leaves User",
//       value: users
//         .filter((u) => !u.isEmailVerified || !u.isPhoneVerified)
//         .length.toString(),
//       change: "0%",
//       desc: "Staff offcially marked on leave",
//       color: "#f59e0b",
//       icon: <LuUserRoundX />,
//     },
//     {
//       title: "Inactive user",
//       value: users.filter((u) => u.status === "inactive").length.toString(),
//       change: "0%",
//       desc: "Staff no longer of operations",
//       color: "#ef4444",
//       icon: <LuUserRoundX />,
//     },
//   ];

//   const [columns, setColumns] = useState([
//     { id: 1, label: "User", enabled: true },
//     { id: 2, label: "Email", enabled: true },
//     { id: 3, label: "Phone", enabled: true },
//     { id: 4, label: "Role", enabled: true },
//     { id: 5, label: "Status", enabled: true },
//     { id: 6, label: "Verified", enabled: true },
//     { id: 7, label: "Actions", enabled: true },
//   ]);
//   const handleMove = (index: number, direction: "up" | "down") => {
//     const newColumns = [...columns];
//     const swapWith = direction === "up" ? index - 1 : index + 1;
//     if (swapWith < 0 || swapWith >= columns.length) return;
//     [newColumns[index], newColumns[swapWith]] = [
//       newColumns[swapWith],
//       newColumns[index],
//     ];
//     setColumns(newColumns);
//   };

//   return (
//     <Box sx={{ minHeight: "100vh" }}>
//       {/* Cards Row */}
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 3,
//           mb: 4,
//         }}
//       >
//         {cards.map((card, idx) => (
//           <Box
//             key={idx}
//             sx={{
//               flex: "1 1 calc(25% - 24px)",
//               minWidth: "250px",
//             }}
//           >
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//                 border: "1px solid #f1f5f9",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 "&:hover": {
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
//                 },
//               }}
//             >
//               <CardContent sx={{ p: 2.5 }}>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   mb={2}
//                 >
//                   <Box display="flex" alignItems="center" gap={1.5}>
//                     <Box
//                       sx={{
//                         bgcolor:
//                           card.title === "Active User"
//                             ? "#e0f2fe"
//                             : card.title === "Present User"
//                             ? "#dcfce7"
//                             : card.title === "On Leaves User"
//                             ? "#fef9c3"
//                             : "#fee2e2",
//                         borderRadius: "5px",
//                         p: 2,
//                         width: 50,
//                         height: 50,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Box
//                         component="span"
//                         sx={{
//                           fontSize: 26,
//                           color:
//                             card.title === "Active User"
//                               ? "var(--color-primary-600)"
//                               : card.title === "Present User"
//                               ? "var(--color-status-success)"
//                               : card.title === "On Leaves User"
//                               ? "var(--color-status-warning)"
//                               : "var(--color-status-error)",
//                         }}
//                       >
//                         {card.icon}
//                       </Box>
//                     </Box>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: 600, color: "#374151" }}
//                     >
//                       {card.title}
//                     </Typography>
//                   </Box>
//                   <BsThreeDots
//                     className={`p-2 text-4xl rounded-lg hover:shadow ${
//                       card.title === "Active User"
//                         ? "hover:bg-primary-light hover:text-primary-600"
//                         : card.title === "Present User"
//                         ? "hover:bg-[#dcfce7] hover:text-status-success"
//                         : card.title === "On Leaves User"
//                         ? "hover:bg-[#fef9c3] hover:text-status-warning"
//                         : "hover:bg-[#fee2e2] hover:text-status-error"
//                     }`}
//                   />
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   <Typography
//                     variant="h5"
//                     sx={{ fontWeight: 400, color: "#111827", mr: 1 }}
//                   >
//                     {card.value}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: card.change.startsWith("-")
//                         ? "var(--color-status-error)"
//                         : "var(--color-status-success)",
//                       fontWeight: 600,
//                     }}
//                   >
//                     ({card.change})
//                   </Typography>
//                 </Box>

//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "var(--color-text-600)",
//                     lineHeight: 1.5,
//                     fontSize: 14,
//                   }}
//                 >
//                   {card.desc}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>
//         ))}
//       </Box>

//       {/* Filters Section */}
//       <Card
//         sx={{
//           mb: 3,
//           borderRadius: 3,
//           boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
//           border: "1px solid #e5e7eb",
//           p: 3,
//           overflow: "visible",
//         }}
//       >
//         <h2 className="mb-4 text-lg">Filters</h2>
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//             gap: 2,
//             width: "100%",
//           }}
//         >
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Box sx={{ position: "relative" }}>
//               <Button
//                 variant="outlined"
//                 onClick={() => setIsCalendarOpen(!isCalendarOpen)}
//                 startIcon={<DateRange />}
//                 sx={{
//                   borderColor: "#d1d5db",
//                   textTransform: "none",
//                   color: "#374151",
//                   fontWeight: 500,
//                   width: "100%",
//                   py: 1,
//                   height: "40px",
//                   minWidth: "200px",
//                   justifyContent: "flex-start",
//                 }}
//               >
//                 {selectedDate?.format("DD MMM YY")}
//               </Button>
//               {isCalendarOpen && (
//                 <Card
//                   sx={{
//                     position: "absolute",
//                     top: "100%",
//                     left: 0,
//                     mt: 1,
//                     zIndex: 1000,
//                     p: 2,
//                     display: "flex",
//                     gap: 2,
//                   }}
//                 >
//                   <Box sx={{ width: "50%" }}>
//                     {dateRangeOptions.map((option) => (
//                       <Button
//                         key={option.value}
//                         onClick={() => {
//                           setSelectedDate(option.date);
//                           setIsCalendarOpen(false);
//                         }}
//                         sx={{
//                           width: "100%",
//                           justifyContent: "flex-start",
//                           color: "text.primary",
//                           py: 1,
//                           textTransform: "none",
//                           "&:hover": {
//                             bgcolor: "primary.light",
//                           },
//                         }}
//                       >
//                         {option.label}
//                       </Button>
//                     ))}
//                   </Box>
//                   <Box sx={{ flex: 1 }}>
//                     <DatePicker
//                       value={selectedDate}
//                       onChange={(newValue) => {
//                         setSelectedDate(newValue);
//                         setIsCalendarOpen(false);
//                       }}
//                       sx={{
//                         width: "100%",
//                         height: "40px",
//                         "& .MuiInputBase-root": {
//                           display: "none",
//                         },
//                       }}
//                     />
//                   </Box>
//                 </Card>
//               )}
//             </Box>
//           </LocalizationProvider>

//           <FormControl size="small" sx={{ flex: 1 }}>
//             <InputLabel sx={{ fontSize: 14 }}>Select Status</InputLabel>
//             <Select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               label="Select Status"
//               sx={{ fontSize: 14, height: "40px" }}
//               fullWidth
//             >
//               <MenuItem value="Active">Active</MenuItem>
//               <MenuItem value="Inactive">Inactive</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Suspended">Suspended</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl size="small" sx={{ flex: 1 }}>
//             <InputLabel sx={{ fontSize: 14 }}>Select Role</InputLabel>
//             <Select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               label="Select Role"
//               sx={{ fontSize: 14, height: "40px" }}
//               fullWidth
//             >
//               <MenuItem value="Admin">Admin</MenuItem>
//               <MenuItem value="Editor">Editor</MenuItem>
//               <MenuItem value="Author">Author</MenuItem>
//               <MenuItem value="Maintainer">Maintainer</MenuItem>
//               <MenuItem value="Subscriber">Subscriber</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl size="small" sx={{ flex: 1 }}>
//             <InputLabel sx={{ fontSize: 14 }}>Select Shift</InputLabel>
//             <Select
//               value={shift}
//               onChange={(e) => setShift(e.target.value)}
//               label="Select Shift"
//               sx={{ fontSize: 14, height: "40px" }}
//               fullWidth
//             >
//               <MenuItem value="Morning">Morning Shift</MenuItem>
//               <MenuItem value="Evening">Evening Shift</MenuItem>
//               <MenuItem value="Night">Night Shift</MenuItem>
//               <MenuItem value="Flexible">Flexible Hours</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl size="small" sx={{ flex: 1 }}>
//             <InputLabel sx={{ fontSize: 14 }}>Select Department</InputLabel>
//             <Select
//               value={department}
//               onChange={(e) => setDepartment(e.target.value)}
//               label="Select Department"
//               sx={{ fontSize: 14, height: "40px" }}
//               fullWidth
//             >
//               <MenuItem value="IT">Information Technology</MenuItem>
//               <MenuItem value="HR">Human Resources</MenuItem>
//               <MenuItem value="Finance">Finance</MenuItem>
//               <MenuItem value="Marketing">Marketing</MenuItem>
//               <MenuItem value="Operations">Operations</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         <Divider sx={{ marginY: 3 }} />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//             gap: 2,
//           }}
//         >
//           <Box>
//             <CustomInput
//               label=""
//               placeholder="Search User"
//               startAdornment={<LuSearch />}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </Box>

//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}
//           >
//             {/* Sort Dropdown */}
//             <Button
//               variant="outlined"
//               startIcon={<TbSortAscendingSmallBig />}
//               endIcon={<IoIosArrowDown />}
//               onClick={(e) => setSortAnchorEl(e.currentTarget)}
//               sx={{
//                 borderColor: "var(--color-text-300)",
//                 color: "var(--color-text-500)",
//                 borderRadius: 2,
//                 fontSize: 14,
//                 '&:hover': {
//                   border: 'none',
//                   bgcolor: 'var(--color-primary-bg-light)',
//                   color: 'var(--color-primary-600)',
//                   '& svg': {
//                     color: 'var(--color-primary-600)'
//                   }
//                 }
//               }}
//             >
//               Sort By
//             </Button>
//             <Menu
//               anchorEl={sortAnchorEl}
//               open={Boolean(sortAnchorEl)}
//               onClose={() => setSortAnchorEl(null)}
//             >
//               <MenuItem>Name</MenuItem>
//               <MenuItem>Email</MenuItem>
//               <MenuItem>Status</MenuItem>
//               <MenuItem>Created Date</MenuItem>
//             </Menu>

//             {/* Manage Columns Dropdown */}
//             <Button
//               variant="outlined"
//               startIcon={<BsLayoutThreeColumns className="text-base!" />}
//               onClick={(e) => setManageAnchorEl(e.currentTarget)}
//               sx={{
//                 borderColor: "var(--color-text-300)",
//                 color: "var(--color-text-500)",
//                 borderRadius: 2,
//                 fontSize: 14,
//                 '&:hover': {
//                   border: 'none',
//                   bgcolor: 'var(--color-primary-bg-light)',
//                   color: 'var(--color-primary-600)',
//                   '& svg': {
//                     color: 'var(--color-primary-600)'
//                   }
//                 }
//               }}
//             >
//               Manage Columns
//             </Button>
//             <Popover
//               open={Boolean(manageAnchorEl)}
//               anchorEl={manageAnchorEl}
//               onClose={() => setManageAnchorEl(null)}
//               anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//               transformOrigin={{ vertical: "top", horizontal: "left" }}
//               PaperProps={{
//                 sx: {
//                   p: 2,
//                   width: 320,
//                   borderRadius: 2,
//                   boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
//                 },
//               }}
//             >
//               <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
//                 Select the fields to display and arrange their order. Click Save
//                 to apply.
//               </Typography>
//               <List dense>
//                 {columns.map((col, index) => (
//                   <ListItem
//                     key={col.id}
//                     sx={{
//                       py: 0.5,
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <ListItemText primary={col.label} sx={{ fontSize: 14 }} />
//                     <ListItemSecondaryAction
//                       sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                     >
//                       <Switch
//                         checked={col.enabled}
//                         onChange={() => handleToggleColumn(col.id)}
//                         size="small"
//                       />
//                       <Box>
//                         <Button
//                           size="small"
//                           sx={{ minWidth: 0 }}
//                           onClick={() => handleMove(index, "up")}
//                         >
//                           ↑
//                         </Button>
//                         <Button
//                           size="small"
//                           sx={{ minWidth: 0 }}
//                           onClick={() => handleMove(index, "down")}
//                         >
//                           ↓
//                         </Button>
//                       </Box>
//                     </ListItemSecondaryAction>
//                   </ListItem>
//                 ))}
//               </List>
//               <Divider sx={{ my: 1 }} />
//               <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
//                 <Button
//                   onClick={() => setManageAnchorEl(null)}
//                   variant="outlined"
//                   size="small"
//                   sx={{ textTransform: "none" }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSaveColumns}
//                   variant="contained"
//                   size="small"
//                   sx={{ textTransform: "none" }}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             </Popover>
//             <PrimaryButton className="px-16! font-medium!">
//               Add New User
//             </PrimaryButton>
//           </Box>
//         </Box>
//       </Card>

//       {/* Table */}
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
//           border: "1px solid #e5e7eb",
//           overflow: "hidden",
//         }}
//       >
//         {isLoading ? (
//           <Box sx={{ p: 4, textAlign: 'center', color: 'var(--color-text-500)' }}>
//             Loading users...
//           </Box>
//         ) : (
//           <Box>
//             <Table sx={{ minWidth: 800 }}>
//               <TableHead>
//             <TableRow sx={{ bgcolor: "#f8fafc" }}>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Email</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Role</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Verified</TableCell>
//               <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((u) => (
//               <TableRow key={u.id} hover>
//                 <TableCell sx={{ py: 2 }}>
//                   <Box display="flex" alignItems="center" gap={2}>
//                     <Avatar sx={{ width: 40, height: 40 }}>
//                       {u.firstName[0]}
//                       {u.lastName[0]}
//                     </Avatar>
//                     <Box>
//                       <Typography fontWeight={600} fontSize={14}>
//                         {u.firstName} {u.lastName}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         fontSize={12}
//                       >
//                         @{u.username}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell sx={{ py: 2, fontSize: 14 }}>{u.email}</TableCell>
//                 <TableCell sx={{ py: 2, fontSize: 14 }}>
//                   {u.vendorRoles.map((role) => role.role).join(", ")}
//                 </TableCell>
//                 <TableCell sx={{ py: 2 }}>
//                   <Chip
//                     label={u.status}
//                     size="small"
//                     sx={{
//                       bgcolor: u.status === "active" ? "#dcfce7" : "#fef2f2",
//                       color: u.status === "active" ? "#16a34a" : "#dc2626",
//                       fontWeight: 600,
//                       fontSize: 12,
//                       minWidth: 80,
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell sx={{ py: 2 }}>
//                   <Chip
//                     label={
//                       u.isEmailVerified && u.isPhoneVerified
//                         ? "Verified"
//                         : "Unverified"
//                     }
//                     size="small"
//                     sx={{
//                       bgcolor:
//                         u.isEmailVerified && u.isPhoneVerified
//                           ? "#dcfce7"
//                           : "#fef2f2",
//                       color:
//                         u.isEmailVerified && u.isPhoneVerified
//                           ? "#16a34a"
//                           : "#dc2626",
//                       fontWeight: 600,
//                       fontSize: 12,
//                       minWidth: 80,
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell align="center" sx={{ py: 2 }}>
//                   <IconButton size="small" sx={{ color: "#6b7280" }}>
//                     <Visibility fontSize="small" />
//                   </IconButton>
//                   <IconButton size="small" sx={{ color: "#f59e0b" }}>
//                     <Edit fontSize="small" />
//                   </IconButton>
//                   <IconButton size="small" sx={{ color: "#ef4444" }}>
//                     <Delete fontSize="small" />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <Box sx={{
//           display: 'flex',
//           justifyContent: 'end',
//           gap: 1,
//           p: 2,
//           borderTop: '1px solid #e5e7eb'
//         }}>
//           <Button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             sx={{
//               color: 'var(--color-text-500)',
//               '&:hover': {
//                 bgcolor: 'var(--color-primary-light)',
//                 color: 'var(--color-primary-600)',
//               }
//             }}
//           >
//             Previous
//           </Button>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             {[...Array(totalPages)].map((_, idx) => (
//               <Button
//                 key={idx}
//                 onClick={() => setCurrentPage(idx + 1)}
//                 variant={currentPage === idx + 1 ? "contained" : "text"}
//                 sx={{
//                   minWidth: 40,
//                   height: 40,
//                   p: 0,
//                   borderRadius: 20,
//                   ...(currentPage === idx + 1 ? {
//                     bgcolor: 'var(--color-primary-600)',
//                     '&:hover': {
//                       bgcolor: 'var(--color-primary-700)',
//                     }
//                   } : {
//                     color: 'var(--color-text-500)',
//                     '&:hover': {
//                       bgcolor: 'var(--color-primary-light)',
//                       color: 'var(--color-primary-600)',
//                     }
//                   })
//                 }}
//               >
//                 {idx + 1}
//               </Button>
//             ))}
//           </Box>
//           <Button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             sx={{
//               color: 'var(--color-text-500)',
//               '&:hover': {
//                 bgcolor: 'var(--color-primary-light)',
//                 color: 'var(--color-primary-600)',
//               }
//             }}
//           >
//             Next
//           </Button>
//         </Box>
//           </Box>
//         )}
//       </Card>
//       {/* <Footer /> */}
//     </Box>
//   );
// };

import { useState, useEffect } from "react";
import { Box, Card, Divider } from "@mui/material";
import dayjs from "dayjs";
import { usersService } from "../services/api";
import type { User } from "../types/user";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { UserStatsCards } from "../components/users/UserStatsCards";
import { UserFilters } from "../components/users/UserFilters";
import { SortAndManageColumns } from "../components/users/SortAndManageColumns";
import { UsersTable } from "../components/users/UsersTable";

export const UsersPage = () => {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [shift, setShift] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const [columns, setColumns] = useState([
    { id: 1, label: "User", enabled: true },
    { id: 2, label: "Email", enabled: true },
    { id: 3, label: "Role", enabled: true },
    { id: 4, label: "Status", enabled: true },
    { id: 5, label: "Verified", enabled: true },
    { id: 6, label: "Actions", enabled: true },
  ]);

  const dateRangeOptions = [
    { label: "Today", value: "today", date: dayjs() },
    { label: "Last 7 Days", value: "last7", date: dayjs().subtract(7, "day") },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersService.getUsers(currentPage, 10);
        setUsers(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]);

  const handleToggleColumn = (id: number) =>
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );

  const handleMove = (index: number, dir: string) => {
    const newCols = [...columns];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= newCols.length) return;
    [newCols[index], newCols[swap]] = [newCols[swap], newCols[index]];
    setColumns(newCols);
  };

  const cards = [
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      change: "+0%",
      desc: "All staff currently authorized in the system",
      color: "#22c55e",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "Present User",
      value: users
        .filter((u) => u.isEmailVerified && u.isPhoneVerified)
        .length.toString(),
      change: "+0%",
      desc: "Staff checked in for the ongoing shift",
      color: "#3b82f6",
      icon: <LuUserRoundCheck />,
    },
    {
      title: "On Leaves User",
      value: users
        .filter((u) => !u.isEmailVerified || !u.isPhoneVerified)
        .length.toString(),
      change: "0%",
      desc: "Staff offcially marked on leave",
      color: "#f59e0b",
      icon: <LuUserRoundX />,
    },
    {
      title: "Inactive user",
      value: users.filter((u) => u.status === "inactive").length.toString(),
      change: "0%",
      desc: "Staff no longer of operations",
      color: "#ef4444",
      icon: <LuUserRoundX />,
    },
  ];

  return (
    <Box>
      <UserStatsCards cards={cards} />
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          p: 3,
          overflow: "visible",
        }}
      >
        <h2 className="mb-4 text-lg">Filters</h2>

        <UserFilters
          {...{
            status,
            setStatus,
            role,
            setRole,
            shift,
            setShift,
            department,
            setDepartment,
            selectedDate,
            setSelectedDate,
            isCalendarOpen,
            setIsCalendarOpen,
            dateRangeOptions,
          }}
        />
        <Divider sx={{ my: 2 }} />
        <SortAndManageColumns
          {...{
            sortAnchorEl,
            setSortAnchorEl,
            manageAnchorEl,
            setManageAnchorEl,
            columns,
            handleMove,
            handleToggleColumn,
            handleSaveColumns: () => setManageAnchorEl(null),
            search,
            setSearch,
          }}
        />
      </Card>
      <UsersTable
        {...{
          users,
          isLoading,
          currentPage,
          setCurrentPage,
          totalPages,
        }}
      />
    </Box>
  );
};
