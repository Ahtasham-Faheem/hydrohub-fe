import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { catalogService, staffService } from '../../services/api';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { CustomSelect } from '../../components/common/CustomSelect';
import { CustomInput } from '../../components/common/CustomInput';

interface Product {
  id: string;
  name: string;
  subHeading?: string;
  salePrice: number;
  sellingPrice: number;
  mainImage?: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  presentAddress?: string;
  balance?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const DeliveryOrderStep2 = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Staff state
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  
  // Account balance handling
  const [addOutstanding, setAddOutstanding] = useState(true);
  
  // Payment states
  const [otherCharges, setOtherCharges] = useState(0);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  
  // Toast
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load selected customer from previous step
      const savedCustomer = localStorage.getItem('hydrohub_selected_customer');
      if (savedCustomer) {
        setSelectedCustomer(JSON.parse(savedCustomer));
      } else {
        showToast('No customer selected. Redirecting to step 1.', 'error');
        navigate('/dashboard/orders/delivery-step-1');
        return;
      }
      
      // Load products
      const productsResponse = await catalogService.getProducts(1, 100);
      setProducts(productsResponse.data || []);
      
      // Load delivery staff
      await loadStaff();
      
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const vendorId = userData?.vendorId || userData?.id || '';
      
      const response = await staffService.getStaff(vendorId, 1, 100, { role: 'delivery_staff' });
      
      // Map StaffMember to Staff interface - handle potential API structure differences
      const mappedStaff = (response.data || []).map((staffMember: any) => ({
        id: staffMember.id,
        firstName: staffMember.user?.firstName || staffMember.firstName || 'Unknown',
        lastName: staffMember.user?.lastName || staffMember.lastName || 'Staff',
        role: staffMember.userRole || staffMember.role || 'delivery_staff',
      }));
      
      setStaff(mappedStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
      // Fallback demo data
      setStaff([
        { id: 'S1', firstName: 'Raza', lastName: 'Ahmed', role: 'delivery_staff' },
        { id: 'S2', firstName: 'Bilal', lastName: 'Khan', role: 'delivery_staff' },
        { id: 'S3', firstName: 'Ayesha', lastName: 'Ali', role: 'delivery_staff' },
      ]);
    }
  };

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.subHeading || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;
      return {
        id: productId,
        name: product.name,
        price: product.salePrice > 0 ? product.salePrice : product.sellingPrice,
        quantity,
      };
    })
    .filter(Boolean) as CartItem[];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = discountType === 'flat' ? discountValue : (subtotal * discountValue) / 100;
  const base = Math.max(0, subtotal + otherCharges - discount);
  const taxAmount = (base * taxPercent) / 100;
  const payable = base + taxAmount;
  
  // Account balance calculations
  const customerBalance = selectedCustomer?.balance || 0;
  const accountLeft = addOutstanding ? customerBalance - payable : customerBalance;
  const grandTotal = addOutstanding ? accountLeft : payable;
  
  // Payment summary
  const change = receivedAmount - payable;

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart({ ...cart, [productId]: quantity });
    }
  };

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    if (!selectedCustomer) {
      showToast('No customer selected', 'error');
      return;
    }

    // Update customer balance if adding outstanding
    if (addOutstanding) {
      // In production, this would be an API call to update customer balance
      const updatedCustomer = { ...selectedCustomer, balance: accountLeft };
      localStorage.setItem('hydrohub_selected_customer', JSON.stringify(updatedCustomer));
    }

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      status: selectedStaffId ? 'assigned' : 'new',
      customer: selectedCustomer,
      items: cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
      })),
      billTotal: payable,
      previousBalance: addOutstanding ? customerBalance : 0,
      assignedTo: selectedStaffId ? {
        id: selectedStaffId,
        name: staff.find(s => s.id === selectedStaffId)?.firstName + ' ' + staff.find(s => s.id === selectedStaffId)?.lastName || 'Unknown Staff'
      } : undefined,
      assignedAt: selectedStaffId ? Date.now() : undefined,
      createdAt: Date.now(),
    };

    // Save order to localStorage (in production, this would be an API call)
    const existingOrders = JSON.parse(localStorage.getItem('hydrohub_orders_v1') || '[]');
    existingOrders.unshift(order);
    localStorage.setItem('hydrohub_orders_v1', JSON.stringify(existingOrders));

    showToast('✔ Delivery Order Created');
    
    // Clear cart and navigate back
    setCart({});
    localStorage.removeItem('hydrohub_selected_customer');
    navigate('/dashboard/orders');
  };

  const handlePaymentAction = (action: 'return' | 'addBalance') => {
    if (!selectedCustomer) return;

    if (action === 'return') {
      // Return change as cash, no balance update
      finalizePayment(customerBalance);
    } else {
      // Add excess to customer balance
      const newBalance = customerBalance + change;
      finalizePayment(newBalance);
    }
  };

  const finalizePayment = (newBalance: number) => {
    if (selectedCustomer) {
      const updatedCustomer = { ...selectedCustomer, balance: newBalance };
      setSelectedCustomer(updatedCustomer);
      localStorage.setItem('hydrohub_selected_customer', JSON.stringify(updatedCustomer));
      showToast('✔ Payment processed.');
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} PKR`;
  };

  const renderProductCard = (product: Product) => {
    const quantity = cart[product.id] || 0;
    const price = product.salePrice > 0 ? product.salePrice : product.sellingPrice;

    return (
      <Card key={product.id} sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.primary}`,
        boxShadow: colors.shadow.sm,
        '&:hover': {
          boxShadow: colors.shadow.md,
          borderColor: colors.primary[600],
        }
      }}>
        <Box sx={{ height: 140, backgroundColor: colors.background.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.mainImage ? (
            <img 
              src={product.mainImage} 
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Typography variant="h1" sx={{ fontSize: 36, color: colors.text.tertiary }}>
              📦
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: colors.text.primary }}>
            {product.name}
          </Typography>
          {product.subHeading && (
            <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 1 }}>
              {product.subHeading}
            </Typography>
          )}
          <Typography variant="h6" sx={{ color: colors.primary[600], fontWeight: 700, mb: 2, mt: 'auto' }}>
            {formatCurrency(price)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                sx={{ 
                  border: `1px solid ${colors.primary[600]}`, 
                  color: colors.primary[600],
                  '&:hover': {
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600, color: colors.text.primary }}>
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                sx={{ 
                  border: `1px solid ${colors.primary[600]}`, 
                  color: colors.primary[600],
                  '&:hover': {
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                  }
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        backgroundColor: colors.background.primary,
        minHeight: '100vh',
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Typography sx={{ color: colors.text.primary }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: colors.background.primary, 
      minHeight: '100vh',
      p: 3 
    }}>
      {/* Header */}
      {/* <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
          Create Delivery Order
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Select products and finalize the order
        </Typography>
      </Box> */}

      {/* Export Bar */}
      <Card sx={{ 
        p: 2, 
        mb: 3, 
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.primary}`,
        boxShadow: colors.shadow.sm,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="body2" sx={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PrintIcon fontSize="small" />
          Export / Print
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<CsvIcon />}
            sx={{ 
              borderColor: colors.border.primary,
              color: colors.text.primary,
              '&:hover': {
                borderColor: colors.primary[600],
                backgroundColor: colors.background.secondary,
              }
            }}
          >
            CSV
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<PrintIcon />} 
            onClick={() => window.print()}
            sx={{ 
              borderColor: colors.border.primary,
              color: colors.text.primary,
              '&:hover': {
                borderColor: colors.primary[600],
                backgroundColor: colors.background.secondary,
              }
            }}
          >
            Print
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<PdfIcon />}
            sx={{ 
              borderColor: colors.border.primary,
              color: colors.text.primary,
              '&:hover': {
                borderColor: colors.primary[600],
                backgroundColor: colors.background.secondary,
              }
            }}
          >
            PDF
          </Button>
        </Box>
      </Card>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Left Side - Customer & Catalogue */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={3}>
            {/* Customer Search (Read-only display) */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Customer Search</Typography>
              <TextField
                fullWidth
                size="small"
                value={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : ''}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/dashboard/orders/delivery-step-1')}
                sx={{ mt: 1 }}
              >
                🔄 Change Customer
              </Button>
            </Card>

            {/* Account Balance Handling */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.text.primary }}>Account Balance Handling</Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    Use account balance in this bill or keep separate
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    Account Balance
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
                    {formatCurrency(customerBalance)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={addOutstanding ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setAddOutstanding(true)}
                  sx={{background: colors.text.primaryBlue}}
                >
                  Add to Bill
                </Button>
                <Button
                  variant={!addOutstanding ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setAddOutstanding(false)}
                >
                  Keep Separate
                </Button>
              </Box>
            </Card>

            {/* Catalogue */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Catalogue</Typography>
              <CustomInput
                label=""
                placeholder="Search catalogue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2 
              }}>
                {filteredProducts.map((product) => (
                  <Box key={product.id}>
                    {renderProductCard(product)}
                  </Box>
                ))}
              </Box>
            </Card>
          </Stack>
        </Box>

        {/* Right Side - Customer Summary & Order */}
        <Box sx={{ width: { xs: '100%', lg: '400px' }, flexShrink: 0 }}>
          <Stack spacing={3}>
            {/* Customer Summary */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 1, color: colors.text.primary }}>Customer Summary</Typography>
              {selectedCustomer && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {selectedCustomer.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                    {selectedCustomer.presentAddress || 'No address'}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* Compact Customer History Summary */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Recent Orders</Typography>
                      <Typography variant="caption">0</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Unpaid Receipts</Typography>
                      <Typography variant="caption">0</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Last Order</Typography>
                      <Typography variant="caption">-</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Card>

            {/* Delivery Staff Assignment */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Delivery Assignment</Typography>
              <CustomSelect
                label="Select Delivery Staff"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                options={[
                  { value: '', label: '-- Select Staff --' },
                  ...staff.map((staffMember) => ({
                    value: staffMember.id,
                    label: `${staffMember.firstName} ${staffMember.lastName}`
                  }))
                ]}
                size="small"
              />
              <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                Assign this order to a delivery staff member
              </Typography>
            </Card>

             {/* Charges & Payments */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Charges & Payments</Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                mb: 2 
              }}>
                <CustomInput
                  label="Other Charges"
                  type="number"
                  size="small"
                  value={otherCharges.toString()}
                  onChange={(e) => setOtherCharges(Number(e.target.value))}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CustomSelect
                    label=""
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percent')}
                    options={[
                      { value: 'flat', label: 'Flat' },
                      { value: 'percent', label: '%' }
                    ]}
                    size="small"
                    fullWidth={false}
                  />
                  <CustomInput
                    label="Discount"
                    type="number"
                    size="small"
                    value={discountValue.toString()}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <CustomInput
                  label="Tax (%)"
                  type="number"
                  size="small"
                  value={taxPercent.toString()}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                />
                <CustomInput
                  label="Received"
                  type="number"
                  size="small"
                  value={receivedAmount.toString()}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                />
              </Box>
              
              <SecondaryButton
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              >
                Recalculate
              </SecondaryButton>

              {/* Payment Summary */}
              <Box sx={{ borderTop: `1px dashed ${colors.border.secondary}`, pt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Payment Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Received Amount</Typography>
                  <Typography variant="body2">{formatCurrency(receivedAmount)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Change / Balance</Typography>
                  <Typography variant="body2">{formatCurrency(change)}</Typography>
                </Box>

                {selectedCustomer && change !== 0 && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {change > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handlePaymentAction('return')}
                        sx={{ flex: 1 }}
                      >
                        Return
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handlePaymentAction('addBalance')}
                      sx={{ flex: 1 }}
                    >
                      Add Balance
                    </Button>
                  </Box>
                )}

                {!selectedCustomer && change !== 0 && (
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    Walk-in customer: Return change in cash. No account update.
                  </Typography>
                )}
              </Box>
            </Card>

            {/* Order Summary */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Order Summary</Typography>
              
              {/* Cart Items */}
              <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                {cartItems.length === 0 ? (
                  <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center', py: 2 }}>
                    No items
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {cartItems.map((item) => (
                      <Box key={item.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                sx={{ minWidth: 24, height: 24 }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography variant="caption">{item.quantity}</Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                sx={{ minWidth: 24, height: 24 }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => updateQuantity(item.id, 0)}
                                sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Box>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Summary Totals */}
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Sub Total</Typography>
                  <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Other Charges</Typography>
                  <Typography variant="body2">{formatCurrency(otherCharges)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Discount</Typography>
                  <Typography variant="body2">{formatCurrency(discount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Tax ({taxPercent}%)</Typography>
                  <Typography variant="body2">{formatCurrency(taxAmount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Payable Amount</Typography>
                  <Typography variant="body2">{formatCurrency(payable)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Account Balance</Typography>
                  <Typography variant="body2">{formatCurrency(customerBalance)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Grand Total</Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700, 
                      color: addOutstanding && accountLeft < 0 ? colors.status.error[600] : 
                             addOutstanding && accountLeft > 0 ? colors.status.success[600] : 
                             colors.text.primary
                    }}
                  >
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Create Order Button */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <PrimaryButton
                fullWidth
                onClick={handleCreateOrder}
                disabled={cartItems.length === 0}
                startIcon={<span>✓</span>}
              >
                Create Delivery Order
              </PrimaryButton>
            </Card>

           
          </Stack>
        </Box>
      </Box>

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