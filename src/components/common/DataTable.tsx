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
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

export interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
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
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
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
  onView,
  onEdit,
  onDelete,
}: DataTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

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

  const handleDelete = async (item: any) => {
    setDeletingId(getNestedValue(item, keyField));
    try {
      await onDelete?.(item);
    } finally {
      setDeletingId(null);
    }
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
          Loading data...
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
          No data available
        </Box>
      ) : (
        <>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.label}</TableCell>
                ))}
                {showActions && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={getNestedValue(item, keyField)} hover>
                  {columns.map((column) => (
                    <TableCell
                      key={`${getNestedValue(item, keyField)}-${column.key}`}
                    >
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell align="center">
                      {onView && (
                        <IconButton
                          size="small"
                          sx={{ color: "#6b7280" }}
                          onClick={() => handleOpenModal(item)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton
                          size="small"
                          sx={{ color: "#f59e0b" }}
                          onClick={() => onEdit(item)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          sx={{ color: "#ef4444" }}
                          onClick={() => handleDelete(item)}
                          disabled={
                            deletingId === getNestedValue(item, keyField)
                          }
                        >
                          {deletingId === getNestedValue(item, keyField) ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "#ef4444" }}
                            />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                  )}
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

      {/* Details Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 22,
            color: "#1f2937",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderBottom: "1px solid #e2e8f0",
            p: 3,
          }}
        >
          <Box>Details</Box>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: "#64748b",
              "&:hover": { 
                bgcolor: "rgba(100, 116, 139, 0.1)",
                color: "#334155",
              },
              transition: "all 0.2s ease",
            }}
            size="small"
          >
            <IoMdClose size={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedItem && (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Display all fields from the item */}
              {Object.entries(selectedItem).map(
                ([key, value]: [string, any], index: number) => {
                  // Skip nested objects and null values
                  if (
                    value === null ||
                    typeof value === "object" ||
                    key === "id" ||
                    key === "userId" ||
                    key === "vendorId" ||
                    key === "staffProfileId" ||
                    key === "customerProfileId" ||
                    key === "profilePictureAssetId" ||
                    key === "updatedAt"
                  ) {
                    return null;
                  }

                  // Format the key to readable format
                  const displayKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();

                  // Format the value
                  let displayValue = value;
                  if (displayValue instanceof Date) {
                    displayValue = new Date(displayValue).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    );
                  } else if (typeof displayValue === "string") {
                    displayValue =
                      displayValue.charAt(0).toUpperCase() +
                      displayValue.slice(1);
                  }

                  return (
                    <Box
                      key={key}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr",
                        gap: 3,
                        alignItems: "start",
                        p: 3,
                        borderBottom: index % 2 === 0 ? "1px solid #f1f5f9" : "none",
                        backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: index % 2 === 0 ? "#f1f5f9" : "#f8fafc",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: 13,
                          textTransform: "capitalize",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            backgroundColor: "#3b82f6",
                          }}
                        />
                        {displayKey}
                      </Box>
                      <Box
                        sx={{
                          color: "#1f2937",
                          fontSize: 14,
                          fontWeight: 500,
                          wordBreak: "break-word",
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                        }}
                      >
                        {displayValue || "-"}
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderTop: "1px solid #e2e8f0",
            gap: 1,
          }}
        >
          <Button
            onClick={handleCloseModal}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
