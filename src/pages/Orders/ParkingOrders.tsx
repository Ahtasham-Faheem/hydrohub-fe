import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  RestoreFromTrash as RestoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';

interface ParkedOrder {
  id: string;
  cart: Record<string, number>;
  createdAt: string;
  customer: string | null;
}

export const ParkingOrders = () => {
  const { colors } = useTheme();
  const [parkedOrders, setParkedOrders] = useState<ParkedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ParkedOrder | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadParkedOrders();
  }, []);

  const loadParkedOrders = () => {
    try {
      const saved = localStorage.getItem('hydrohub_parking_orders');
      if (saved) {
        setParkedOrders(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading parked orders:', error);
      showToast('Error loading parked orders', 'error');
    }
  };

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleRestoreOrder = (order: ParkedOrder) => {
    // Restore to walk-in sales cart
    localStorage.setItem('hydrohub_walkin_cart', JSON.stringify(order.cart));
    
    // Remove from parked orders
    const updatedOrders = parkedOrders.filter(o => o.id !== order.id);
    setParkedOrders(updatedOrders);
    localStorage.setItem('hydrohub_parking_orders', JSON.stringify(updatedOrders));
    
    showToast('Order restored to cart');
  };

  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = parkedOrders.filter(o => o.id !== orderId);
    setParkedOrders(updatedOrders);
    localStorage.setItem('hydrohub_parking_orders', JSON.stringify(updatedOrders));
    
    showToast('Parked order deleted');
  };

  const handleViewOrder = (order: ParkedOrder) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getItemCount = (cart: Record<string, number>) => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
          Parking Orders
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Manage temporarily saved orders
        </Typography>
      </Box>

      {/* Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                      No parked orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                parkedOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.customer || 'Walk-In Customer'} 
                        size="small"
                        color={order.customer ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${getItemCount(order.cart)} items`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewOrder(order)}
                          startIcon={<ViewIcon />}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleRestoreOrder(order)}
                          startIcon={<RestoreIcon />}
                        >
                          Restore
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteOrder(order.id)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* View Order Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details - {selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                <strong>Created:</strong> {formatDate(selectedOrder.createdAt)}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                <strong>Customer:</strong> {selectedOrder.customer || 'Walk-In Customer'}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2 }}>Cart Items</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(selectedOrder.cart).map(([productId, quantity]) => (
                      <TableRow key={productId}>
                        <TableCell>{productId}</TableCell>
                        <TableCell align="center">{quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setViewModalOpen(false)}>
            Close
          </SecondaryButton>
          {selectedOrder && (
            <PrimaryButton 
              onClick={() => {
                handleRestoreOrder(selectedOrder);
                setViewModalOpen(false);
              }}
              startIcon={<RestoreIcon />}
            >
              Restore to Cart
            </PrimaryButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};