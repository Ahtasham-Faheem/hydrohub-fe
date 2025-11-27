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
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

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
  // Safely get nested value from object using dot notation
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Render cell value based on column configuration
  const renderCellValue = (item: any, column: Column) => {
    if (column.render) {
      return column.render(getNestedValue(item, column.key), item);
    }
    return getNestedValue(item, column.key) || 'N/A';
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
                {showActions && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={getNestedValue(item, keyField)} hover>
                  {columns.map((column) => (
                    <TableCell key={`${getNestedValue(item, keyField)}-${column.key}`}>
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell align="center">
                      {onView && (
                        <IconButton
                          size="small"
                          sx={{ color: "#6b7280" }}
                          onClick={() => onView(item)}
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
                          onClick={() => onDelete(item)}
                        >
                          <Delete fontSize="small" />
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
    </Card>
  );
};
