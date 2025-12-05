import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useOrder } from '../../contexts/OrderContext';
import { CatalogueService } from '../../services/catalogueService';
import { theme } from '../../theme/colors';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';

interface CatalogueItem {
  id: string;
  name: string;
  salePrice: number;
  mainImage?: string;
}

const COUNTRY_CODES = [
  { code: '+92', label: 'Pakistan (PK)' },
  { code: '+91', label: 'India (IN)' },
  { code: '+1', label: 'USA (US)' },
];

export const Step2OrderSummary = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { cart, customerInfo, setCustomerInfo, updateCartQuantity, removeFromCart } = useOrder();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [formData, setFormData] = useState({
    name: customerInfo?.name || '',
    phone: customerInfo?.phone || '',
    address: customerInfo?.address || '',
    notes: customerInfo?.notes || '',
    countryCode: '+92',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);

  useEffect(() => {
    const catalogueItems = CatalogueService.getAll();
    const activeItems = catalogueItems.filter(item => item.status !== 'inactive');
    setItems(activeItems as CatalogueItem[]);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Basic phone validation
    if (formData.phone.trim() && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must have at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleProceed = () => {
    if (validateForm()) {
      setCustomerInfo({
        name: formData.name,
        phone: `${formData.countryCode}${formData.phone}`,
        address: formData.address,
        notes: formData.notes,
      });
      onNext();
    } else {
      setValidationDialogOpen(true);
    }
  };

  const handleSaveDraft = () => {
    if (validateForm()) {
      setCustomerInfo({
        name: formData.name,
        phone: `${formData.countryCode}${formData.phone}`,
        address: formData.address,
        notes: formData.notes,
      });
      // In a real app, you'd also save the order with draft status
      alert('Draft saved successfully!');
    } else {
      setValidationDialogOpen(true);
    }
  };

  if (!items.length) {
    return <Typography>Loading...</Typography>;
  }

  const cartItems = items.filter((item) => cart[item.id]);
  
  // Calculate order summary on the fly
  const subtotal = cartItems.reduce((sum, item) => sum + (item.salePrice * (cart[item.id] || 0)), 0);
  const deliveryCharges = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryCharges;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
      {/* Left: Order Review */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.colors.text600 }}>
          Order Summary
        </Typography>

        <TableContainer component={Card}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.colors.primary[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Total
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => {
                const quantity = cart[item.id];
                const itemTotal = item.salePrice * quantity;

                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value, 10) || 0;
                          if (qty <= 0) {
                            removeFromCart(item.id);
                          } else {
                            updateCartQuantity(item.id, qty);
                          }
                        }}
                        inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                      />
                    </TableCell>
                    <TableCell align="right">PKR {item.salePrice.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      PKR {itemTotal.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Card sx={{ mt: 2, p: 2 }}>
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
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.colors.primary[600], fontSize: '16px' }}>
                PKR {total.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Box>

      {/* Right: Customer Form */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.colors.text600 }}>
          Customer Details
        </Typography>

        <Card component={Stack} spacing={2} sx={{ p: 2 }}>
          <TextField
            label="Full Name"
            placeholder="Enter customer name"
            fullWidth
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 1 }}>
            <TextField
              select
              label="Country Code"
              value={formData.countryCode}
              onChange={(e) => handleFieldChange('countryCode', e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  height: '40px',
                },
              }}
            >
              {COUNTRY_CODES.map((cc) => (
                <MenuItem key={cc.code} value={cc.code}>
                  {cc.code}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone Number"
              placeholder="1234567890"
              fullWidth
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, ''))}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Box>

          <TextField
            label="Delivery Address"
            placeholder="Enter complete delivery address"
            fullWidth
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />

          <TextField
            label="Notes (Optional)"
            placeholder="Any special instructions or notes"
            fullWidth
            multiline
            rows={2}
            value={formData.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
          />

          <Stack spacing={1.5} sx={{ mt: 3 }}>
            <PrimaryButton fullWidth onClick={handleProceed} sx={{ textTransform: 'none' }}>
              Confirm & Create Invoice
            </PrimaryButton>

            <SecondaryButton fullWidth onClick={handleSaveDraft} sx={{ textTransform: 'none' }}>
              Save as Draft
            </SecondaryButton>

            <SecondaryButton fullWidth onClick={onPrev} sx={{ textTransform: 'none' }}>
              Back to Items
            </SecondaryButton>
          </Stack>
        </Card>
      </Box>

      {/* Validation Error Dialog */}
      <Dialog open={validationDialogOpen} onClose={() => setValidationDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Please fill all required fields</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            {Object.values(errors)
              .filter((e) => e)
              .map((error, idx) => (
                <div key={idx}>• {error}</div>
              ))}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
