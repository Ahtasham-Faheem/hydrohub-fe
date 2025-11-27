import {
  Box,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import type { StaffMember } from "../../types/user";

interface UsersTableProps {
  users: StaffMember[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
}

export const UsersTable = ({
  users,
  isLoading,
  currentPage,
  setCurrentPage,
  totalPages,
}: UsersTableProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Box sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
          Loading users...
        </Box>
      ) : (
        <>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((staff: StaffMember) => (
                <TableRow key={staff.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>{(staff.user.firstName?.[0] || 'U') + (staff.user.lastName?.[0] || 'S')}</Avatar>
                      <Box>
                        <Typography fontWeight={600} fontSize={14}>
                          {staff.user.firstName || 'N/A'} {staff.user.lastName || 'N/A'}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize={12}
                        >
                          @{staff.staffId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{staff.user.email || 'N/A'}</TableCell>
                  <TableCell>{staff.userRole || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={staff.user.status}
                      size="small"
                      sx={{
                        bgcolor: staff.user.status === "active" ? "var(--color-status-success-light)" : "var(--color-status-error-light)",
                        color: staff.user.status === "active" ? "var(--color-status-success)" : "var(--color-status-error)",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={staff.user.isEmailVerified && staff.user.isPhoneVerified ? "Verified" : "Unverified"}
                      size="small"
                      sx={{
                        bgcolor:
                          staff.user.isEmailVerified && staff.user.isPhoneVerified
                            ? "var(--color-status-success-light)"
                            : "var(--color-status-error-light)",
                        color:
                          staff.user.isEmailVerified && staff.user.isPhoneVerified
                            ? "var(--color-status-success)"
                            : "var(--color-status-error)",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" sx={{ color: "#6b7280" }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#f59e0b" }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#ef4444" }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1,
              p: 2,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, idx: number) => (
              <Button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                variant={currentPage === idx + 1 ? "contained" : "text"}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p: number) => Math.min(totalPages, p + 1))
              }
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
};
