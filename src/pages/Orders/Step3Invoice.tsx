import { useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { useOrder } from '../../contexts/OrderContext';
import { CatalogueService } from '../../services/catalogueService';
import { theme } from '../../theme/colors';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';

export const Step3Invoice = ({ onNewOrder, onEdit }: { onNewOrder: () => void; onEdit: () => void }) => {
  const { customerInfo, cart, saveOrder, clearCart, setCurrentStep } = useOrder();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateInvoiceNumber = () => {
    return `INV-${Date.now().toString().slice(-8)}`;
  };

  const invoiceNumber = generateInvoiceNumber();
  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // For now, we'll use print to PDF functionality
    // In production, integrate with jsPDF or similar library
    alert('PDF download functionality would be integrated with jsPDF or similar library.');
    handlePrint();
  };

  const handleCreateOrder = () => {
    if (customerInfo) {
      // Build order summary from current cart and items
      const orderItems = items
        .filter(item => cart[item.id])
        .map(item => ({
          catalogueItemId: item.id,
          name: item.name,
          price: item.salePrice,
          quantity: cart[item.id],
          totalPrice: item.salePrice * cart[item.id],
        }));
      
      const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const deliveryCharges = subtotal > 0 ? 50 : 0;
      
      const order = {
        id: invoiceNumber,
        items: cart,
        customer: customerInfo,
        orderSummary: {
          items: orderItems,
          subtotal,
          deliveryCharges,
          total: subtotal + deliveryCharges,
        },
        createdAt: Date.now(),
        status: 'confirmed' as const,
      };
      saveOrder(order);
      alert('Order created successfully! Invoice: ' + invoiceNumber);

      // Reset for new order
      clearCart();
      setCurrentStep(1);
      onNewOrder();
    }
  };

  // Load catalogue items
  const items = CatalogueService.getAll().filter(item => item.status !== 'inactive');

  if (!customerInfo) {
    return <Typography>Loading invoice...</Typography>;
  }

  // Build order items from cart and catalogue
  const orderItems = items
    .filter(item => cart[item.id])
    .map(item => ({
      catalogueItemId: item.id,
      name: item.name,
      price: item.salePrice,
      quantity: cart[item.id],
      totalPrice: item.salePrice * cart[item.id],
    }));
  
  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharges = subtotal > 0 ? 50 : 0;

  return (
    <Box>
      {/* Print Container */}
      <Box
        ref={invoiceRef}
        sx={{
          p: 4,
          backgroundColor: '#fff',
          '@media print': {
            p: 0,
            backgroundColor: '#fff',
          },
        }}
      >
        {/* Invoice Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.colors.primary[600], mb: 0.5 }}>
            HydroHub
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text300 }}>
            Water Supply Management System
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Invoice Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
          <Box>
            <Typography variant="overline" sx={{ color: theme.colors.text300, fontWeight: 600 }}>
              Invoice Number
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.colors.text600 }}>
              {invoiceNumber}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: theme.colors.text300, fontWeight: 600 }}>
              Invoice Date
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.colors.text600 }}>
              {invoiceDate}
            </Typography>
          </Box>
        </Box>

        {/* Customer Information */}
        <Box sx={{ mb: 4, p: 2, backgroundColor: theme.colors.primary[50], borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: theme.colors.text600 }}>
            Customer Information
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2">
              <strong>Name:</strong> {customerInfo.name}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {customerInfo.phone}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong> {customerInfo.address}
            </Typography>
            {customerInfo.notes && (
              <Typography variant="body2">
                <strong>Notes:</strong> {customerInfo.notes}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Items Table */}
        <TableContainer component={Card} sx={{ mb: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.colors.primary[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item Description</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Unit Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">PKR {item.price.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    PKR {item.totalPrice.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Box */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 3, mb: 4 }}>
          <Box /> {/* Empty space on left */}
          <Card sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  PKR {subtotal.toFixed(2)}
                </Typography>
              </Stack>

              {deliveryCharges > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Delivery Charges:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    PKR {deliveryCharges.toFixed(2)}
                  </Typography>
                </Stack>
              )}

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '16px' }}>
                  Grand Total:
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: theme.colors.primary[600], fontSize: '18px' }}
                >
                  PKR {(subtotal + deliveryCharges).toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Box>

        {/* Paid Stamp */}
        <Box
          sx={{
            position: 'relative',
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            '@media print': {
              display: 'flex',
              justifyContent: 'center',
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '48px',
              fontWeight: 700,
              color: 'rgba(76, 175, 80, 0.3)',
              transform: 'rotate(-45deg)',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            PAID
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: theme.colors.text300 }}>
            Thank you for your business!
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons - Hidden in Print */}
      <Box
        sx={{
          mt: 4,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
          '@media print': {
            display: 'none',
          },
        }}
      >
        <PrimaryButton fullWidth onClick={handleCreateOrder} sx={{ textTransform: 'none' }}>
          Confirm & Create Order
        </PrimaryButton>

        <SecondaryButton fullWidth onClick={handleDownloadPDF} sx={{ textTransform: 'none' }}>
          Download PDF
        </SecondaryButton>

        <SecondaryButton fullWidth onClick={handlePrint} sx={{ textTransform: 'none' }}>
          Print Invoice
        </SecondaryButton>

        <SecondaryButton fullWidth onClick={onEdit} sx={{ textTransform: 'none' }}>
          Edit Order
        </SecondaryButton>
      </Box>
    </Box>
  );
};
