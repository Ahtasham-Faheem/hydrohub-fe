import {
  Box,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Typography,
  TableSortLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, Edit, Delete, FolderOpen } from "@mui/icons-material";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { useTheme } from "../../contexts/ThemeContext";

// Custom hook to safely use FormContext only when available
const useFormContextSafe = () => {
  try {
    return useFormContext();
  } catch {
    return null;
  }
};

// Helper component for displaying info items in the modal
const InfoItem = ({ label, value, colors, fullWidth = false }: { label: string; value: any; colors: any; fullWidth?: boolean }) => (
  <Box sx={{ gridColumn: fullWidth ? "span 2" : "auto" }}>
    <Typography sx={{ fontSize: 11, color: colors.text.tertiary, mb: 0.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {label}
    </Typography>
    <Typography sx={{ 
      fontSize: 14, 
      color: value ? colors.text.primary : colors.text.tertiary, 
      fontWeight: 500,
      wordBreak: "break-word",
    }}>
      {value || "Not provided"}
    </Typography>
  </Box>
);

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortOrder;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  keyField?: string;
  showActions?: boolean;
  showCheckbox?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  sortConfig?: SortConfig | null;
  onSort?: (key: string) => void;
  visibleColumns?: string[];
}

export const DataTable = ({
  columns,
  data,
  isLoading,
  currentPage,
  setCurrentPage,
  totalPages,
  keyField = "id",
  showActions = true,
  showCheckbox = false,
  selectedItems = [],
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  visibleColumns,
}: DataTableProps) => {
  const formContext = useFormContextSafe();
  const { colors } = useTheme();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Filter columns based on visibility
  const displayColumns = visibleColumns 
    ? columns.filter(col => visibleColumns.includes(col.key) || col.visible !== false)
    : columns.filter(col => col.visible !== false);

  // Handle sort click
  const handleSort = (columnKey: string) => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  // Safely get nested value from object using dot notation
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  // Render cell value based on column configuration
  const renderCellValue = (item: any, column: Column) => {
    if (column.render) {
      return column.render(getNestedValue(item, column.key), item);
    }
    return getNestedValue(item, column.key) || "N/A";
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeletingId(getNestedValue(itemToDelete, keyField));
    setDeleteConfirmOpen(false);
    try {
      await onDelete?.(itemToDelete);
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setOpenModal(true);
    onView?.(item);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  // Checkbox selection handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((item) => getNestedValue(item, keyField));
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    const currentIndex = selectedItems.indexOf(itemId);
    const newSelected = [...selectedItems];

    if (currentIndex === -1) {
      newSelected.push(itemId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    onSelectionChange?.(newSelected);
  };

  const isSelected = (itemId: string) => selectedItems.indexOf(itemId) !== -1;
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: colors.shadow.md,
        border: `1px solid ${colors.border.primary}`,
        backgroundColor: colors.background.card,
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Box sx={{ p: 2 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.background.secondary }}>
                {displayColumns.map((column) => (
                  <TableCell key={column.key} sx={{ color: colors.text.primary }}>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                ))}
                {showActions && <TableCell align="center" sx={{ color: colors.text.primary }}><Skeleton variant="text" width={60} /></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {displayColumns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton variant="text" width={Math.random() * 100 + 50} />
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8,
          color: colors.text.tertiary
        }}>
          <FolderOpen sx={{ fontSize: 64, mb: 2, color: colors.text.tertiary }} />
          <Typography variant="h6" sx={{ mb: 1, color: colors.text.secondary, fontWeight: 500 }}>
            No Data Found
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.tertiary, textAlign: 'center' }}>
            There are no records to display at the moment.
          </Typography>
        </Box>
      ) : (
        <>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: colors.background.secondary }}>
                {showCheckbox && (
                  <TableCell padding="checkbox" sx={{ width: 50 }}>
                    <Checkbox
                      indeterminate={isIndeterminate}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      sx={{
                        color: colors.text.secondary,
                        '&.Mui-checked': {
                          color: colors.primary[600],
                        },
                        '&.MuiCheckbox-indeterminate': {
                          color: colors.primary[600],
                        },
                      }}
                    />
                  </TableCell>
                )}
                {displayColumns.map((column) => (
                  <TableCell key={column.key} sx={{ color: colors.text.primary, fontWeight: 600 }}>
                    {column.sortable !== false && onSort ? (
                      <TableSortLabel
                        active={sortConfig?.key === column.key}
                        direction={sortConfig?.key === column.key ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort(column.key)}
                        sx={{
                          color: colors.text.primary,
                          '&.Mui-active': {
                            color: colors.primary[600],
                          },
                          '&:hover': {
                            color: colors.primary[600],
                          },
                          '& .MuiTableSortLabel-icon': {
                            color: `${colors.primary[600]} !important`,
                          },
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {showActions && <TableCell align="center" sx={{ color: colors.text.primary, fontWeight: 600 }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item: any) => {
                const itemId = getNestedValue(item, keyField);
                const isItemSelected = isSelected(itemId);
                
                return (
                <TableRow 
                  key={itemId} 
                  hover
                  selected={isItemSelected}
                  sx={{
                    '&:hover': {
                      backgroundColor: colors.background.secondary,
                    },
                    '&.Mui-selected': {
                      backgroundColor: `${colors.primary[600]}10`,
                      '&:hover': {
                        backgroundColor: `${colors.primary[600]}20`,
                      },
                    },
                  }}
                >
                  {showCheckbox && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleSelectItem(itemId)}
                        sx={{
                          color: colors.text.secondary,
                          '&.Mui-checked': {
                            color: colors.primary[600],
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  {displayColumns.map((column) => (
                    <TableCell
                      key={`${itemId}-${column.key}`}
                      sx={{ color: colors.text.primary }}
                    >
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell align="center">
                      {onView && (
                        <IconButton
                          size="small"
                          sx={{ color: colors.text.secondary }}
                          onClick={() => handleOpenModal(item)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton
                          size="small"
                          sx={{ color: colors.status.warning }}
                          onClick={() => {
                            // Reset form context if available (when editing within a form)
                            if (formContext?.resetForm) {
                              formContext.resetForm();
                            }
                            localStorage.removeItem("createUserCurrentStep");
                            localStorage.removeItem("createUserFormData");
                            onEdit(item);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          sx={{ color: colors.status.error }}
                          onClick={() => handleDeleteClick(item)}
                          disabled={
                            deletingId === getNestedValue(item, keyField)
                          }
                        >
                          {deletingId === getNestedValue(item, keyField) ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: colors.status.error }}
                            />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1,
              p: 2,
              borderTop: `1px solid ${colors.border.primary}`,
              backgroundColor: colors.background.secondary,
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

      {/* Details Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: colors.shadow.xl,
            backgroundColor: colors.background.card,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 20,
            color: colors.text.primary,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.background.secondary,
            borderBottom: `1px solid ${colors.border.primary}`,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {selectedItem?.profilePictureAsset?.fileUrl ? (
              <img
                src={selectedItem.profilePictureAsset.fileUrl}
                alt="Profile"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${colors.primary[500]}`,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: colors.primary[600],
                  color: colors.text.inverse,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {(selectedItem?.firstName?.[0] || "U") + (selectedItem?.lastName?.[0] || "")}
              </Box>
            )}
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: colors.text.primary }}>
                {selectedItem?.title} {selectedItem?.firstName} {selectedItem?.lastName}
              </Typography>
              <Typography sx={{ fontSize: 13, color: colors.text.secondary }}>
                {selectedItem?.customerId} • {selectedItem?.customerType}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: colors.text.secondary,
              "&:hover": { 
                bgcolor: colors.background.tertiary,
                color: colors.text.primary,
              },
            }}
            size="small"
          >
            <IoMdClose size={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "auto" }}>
          {selectedItem && (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Status & Progress Section */}
              <Box sx={{ 
                p: 3, 
                backgroundColor: colors.background.primary,
                borderBottom: `1px solid ${colors.border.primary}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}>
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: colors.text.tertiary, mb: 0.5 }}>Status</Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        bgcolor: selectedItem?.status === "active" ? `${colors.status.success}20` : `${colors.status.error}20`,
                        color: selectedItem?.status === "active" ? colors.status.success : colors.status.error,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedItem?.status || "N/A"}
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: colors.text.tertiary, mb: 0.5 }}>Onboarding Progress</Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.primary[600] }}>
                      {selectedItem?.onboardingProgress?.["progress percentage"] || 0}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 12, color: colors.text.tertiary }}>Created</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}>
                      {selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Basic Information Section */}
              <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border.primary}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text.primary, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 4, height: 16, bgcolor: colors.primary[600], borderRadius: 1 }} />
                  Basic Information
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
                  <InfoItem label="Email" value={selectedItem?.email} colors={colors} />
                  <InfoItem label="Phone" value={selectedItem?.phone} colors={colors} />
                  <InfoItem label="Username" value={selectedItem?.username} colors={colors} />
                </Box>
              </Box>

              {/* Personal Information Section */}
              {selectedItem?.personalInfo && (
                <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border.primary}` }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text.primary, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 4, height: 16, bgcolor: colors.status.info, borderRadius: 1 }} />
                    Personal Information
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
                    <InfoItem label="Father's Name" value={selectedItem.personalInfo.fathersName} colors={colors} />
                    <InfoItem label="Mother's Name" value={selectedItem.personalInfo.mothersName} colors={colors} />
                    <InfoItem label="Date of Birth" value={selectedItem.personalInfo.dateOfBirth ? new Date(selectedItem.personalInfo.dateOfBirth).toLocaleDateString() : null} colors={colors} />
                    <InfoItem label="Gender" value={selectedItem.personalInfo.gender} colors={colors} />
                    <InfoItem label="Marital Status" value={selectedItem.personalInfo.maritalStatus} colors={colors} />
                    <InfoItem label="Nationality" value={selectedItem.personalInfo.nationality} colors={colors} />
                    <InfoItem label="National ID (CNIC)" value={selectedItem.personalInfo.nationalId} colors={colors} />
                    <InfoItem label="Alternate Contact" value={selectedItem.personalInfo.alternateContactNumber} colors={colors} />
                    <InfoItem label="Secondary Email" value={selectedItem.personalInfo.secondaryEmailAddress} colors={colors} />
                  </Box>
                </Box>
              )}

              {/* Address Information Section */}
              {selectedItem?.personalInfo && (
                <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border.primary}` }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text.primary, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 4, height: 16, bgcolor: colors.status.warning, borderRadius: 1 }} />
                    Address Information
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }}>
                    <InfoItem label="Present Address" value={selectedItem.personalInfo.presentAddress} colors={colors} fullWidth />
                    <InfoItem label="Permanent Address" value={selectedItem.personalInfo.permanentAddress} colors={colors} fullWidth />
                  </Box>
                </Box>
              )}

              {/* Emergency Contact Section */}
              {selectedItem?.personalInfo && (
                <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border.primary}` }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text.primary, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 4, height: 16, bgcolor: colors.status.error, borderRadius: 1 }} />
                    Emergency Contact
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
                    <InfoItem label="Contact Name" value={selectedItem.personalInfo.emergencyContactName} colors={colors} />
                    <InfoItem label="Relation" value={selectedItem.personalInfo.emergencyContactRelation} colors={colors} />
                    <InfoItem label="Contact Number" value={selectedItem.personalInfo.emergencyContactNumber} colors={colors} />
                    <InfoItem label="Alternate Emergency Contact" value={selectedItem.personalInfo.alternateEmergencyContact} colors={colors} />
                  </Box>
                </Box>
              )}

              {/* Onboarding Progress Section */}
              {selectedItem?.onboardingProgress && (
                <Box sx={{ p: 3 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text.primary, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 4, height: 16, bgcolor: colors.status.success, borderRadius: 1 }} />
                    Onboarding Steps
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                    {Object.entries(selectedItem.onboardingProgress).map(([key, value]) => {
                      if (key === "progress percentage") return null;
                      return (
                        <Box
                          key={key}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: value ? `${colors.status.success}10` : colors.background.secondary,
                            border: `1px solid ${value ? colors.status.success : colors.border.primary}`,
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: value ? colors.status.success : colors.text.tertiary,
                              color: colors.text.inverse,
                              fontSize: 12,
                            }}
                          >
                            {value ? "✓" : "○"}
                          </Box>
                          <Typography sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>
                            {key}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            backgroundColor: colors.background.secondary,
            borderTop: `1px solid ${colors.border.primary}`,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseModal}
            sx={{
              color: colors.text.secondary,
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 24px",
              borderRadius: "8px",
              border: `1px solid ${colors.border.primary}`,
              backgroundColor: colors.background.card,
              "&:hover": {
                backgroundColor: colors.background.tertiary,
                borderColor: colors.text.secondary,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1f2937",
            p: 3,
            pb: 2,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Box sx={{ color: "#4b5563", fontSize: 15, lineHeight: 1.6 }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                borderColor: "#94a3b8",
              },
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: "#ffffff",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: "6px",
              backgroundColor: "#ef4444",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
              transition: "all 0.2s ease",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
