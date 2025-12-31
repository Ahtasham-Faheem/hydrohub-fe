import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  FlashOn as FlashOnIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { catalogService, customerService } from '../../services/api';
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
  sku?: string;
  category?: string | { id: string; name: string } | undefined;
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

export const WalkInSales = () => {
  const { colors } = useTheme();
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'quick'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Customer states
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [walkInName, setWalkInName] = useState('Walk-In Customer');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  
  // Payment states
  const [otherCharges, setOtherCharges] = useState(0);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  
  // Modal states
  const [quickPickOpen, setQuickPickOpen] = useState(false);
  const [quickPickProduct, setQuickPickProduct] = useState<Product | null>(null);
  const [quickPickQuantity, setQuickPickQuantity] = useState(1);
  
  // Toast
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const productsResponse = await catalogService.getProducts(1, 100);
      setProducts(productsResponse.data || []);
      
      // Load customers
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const vendorId = userData?.vendorId || userData?.id || '';
      const customersResponse = await customerService.getCustomers(vendorId, 1, 100);
      
      // Map API response to Customer interface
      const mappedCustomers = (customersResponse.data || []).map((profile: any) => ({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email,
        presentAddress: profile.personalInfo?.presentAddress || '',
        balance: 0, // This would come from a separate balance API call
      }));
      setCustomers(mappedCustomers);
      
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.subHeading || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch) ||
    (customer.email || '').toLowerCase().includes(customerSearch.toLowerCase())
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
  const grandTotal = base + taxAmount;
  const change = receivedAmount - grandTotal;

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart({ ...cart, [productId]: quantity });
    }
  };

  const clearCart = () => {
    setCart({});
    setSelectedCustomer(null);
    setCustomerSearch('');
    setWalkInName('Walk-In Customer');
    setOtherCharges(0);
    setDiscountValue(0);
    setTaxPercent(0);
    setReceivedAmount(0);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.firstName} ${customer.lastName}`);
    setShowCustomerSuggestions(false);
  };

  const openQuickPick = (product?: Product) => {
    if (product) {
      setQuickPickProduct(product);
      setQuickPickQuantity(cart[product.id] || 1);
    } else {
      setQuickPickProduct(null);
    }
    setQuickPickOpen(true);
  };

  const addQuickPickToCart = () => {
    if (quickPickProduct && quickPickQuantity > 0) {
      updateQuantity(quickPickProduct.id, quickPickQuantity);
      setQuickPickOpen(false);
      showToast(`Added ${quickPickProduct.name} to cart`);
    }
  };

  const handleProceedToBilling = () => {
    if (cartItems.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    // Create order object
    const order = {
      id: `W-${Date.now()}`,
      cart,
      subtotal,
      otherCharges,
      discountType,
      discountValue,
      taxPercent,
      grandTotal,
      receivedAmount,
      changeAmount: change,
      customer: selectedCustomer?.id || null,
      walkInName: selectedCustomer ? null : walkInName,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (in production, this would be an API call)
    localStorage.setItem('hydrohub_current_order', JSON.stringify(order));
    
    showToast('Order created successfully!');
    clearCart();
  };

  const handleParkOrder = () => {
    if (cartItems.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    // Get existing parked orders
    const existingParked = JSON.parse(localStorage.getItem('hydrohub_parking_orders') || '[]');
    
    const parkedOrder = {
      id: `PARK-${Date.now()}`,
      cart,
      createdAt: new Date().toISOString(),
      customer: selectedCustomer?.id || null,
    };

    existingParked.unshift(parkedOrder);
    localStorage.setItem('hydrohub_parking_orders', JSON.stringify(existingParked));
    
    clearCart();
    showToast('Order parked successfully');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} PKR`;
  };

  const renderProductCard = (product: Product) => {
    const quantity = cart[product.id] || 0;
    const price = product.salePrice > 0 ? product.salePrice : product.sellingPrice;

    return (
      <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
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
                sx={{ border: `1px solid ${colors.primary[600]}`, color: colors.primary[600] }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                sx={{ border: `1px solid ${colors.primary[600]}`, color: colors.primary[600] }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  };

  const renderProductList = () => (
    <TableContainer component={Card}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => {
            const price = product.salePrice > 0 ? product.salePrice : product.sellingPrice;
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, backgroundColor: colors.background.secondary, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {product.mainImage ? (
                        <img src={product.mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <Typography>📦</Typography>
                      )}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{product.sku || '-'}</TableCell>
                <TableCell>{typeof product.category === 'string' ? product.category : product.category?.name || '-'}</TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openQuickPick(product)}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
          Walk-In Sales
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Point of sale system for immediate cash sales
        </Typography>
      </Box>

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
            {/* Customer Search */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Customer Search</Typography>
              <CustomInput
                label=""
                placeholder="Search name / phone / address"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  if (e.target.value === '') {
                    setSelectedCustomer(null);
                    setShowCustomerSuggestions(false);
                  } else {
                    setShowCustomerSuggestions(true);
                  }
                }}
                size="small"
              />
              
              {/* Customer Suggestions */}
              {showCustomerSuggestions && customerSearch && (
                <Card sx={{ mt: 1, maxHeight: 200, overflow: 'auto', border: `1px solid ${colors.border.secondary}` }}>
                  {filteredCustomers.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        No matching customers
                      </Typography>
                    </Box>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <Box
                        key={customer.id}
                        sx={{ 
                          p: 1.5, 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: colors.background.secondary },
                          borderBottom: `1px solid ${colors.border.secondary}`,
                        }}
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {customer.phone}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Card>
              )}
              
              <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                Select a saved customer or keep as Walk-In.
              </Typography>
            </Card>

            {/* Catalogue */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: colors.text.primary }}>Catalogue</Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="card">
                    <GridViewIcon />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="quick">
                    <FlashOnIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <CustomInput
                label=""
                placeholder="Search catalogue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />

              {viewMode === 'card' && (
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
              )}

              {viewMode === 'list' && renderProductList()}

              {viewMode === 'quick' && (
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => openQuickPick()}
                    sx={{ mb: 2 }}
                  >
                    Quick Pick Multiple Items
                  </Button>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2 
                  }}>
                    {filteredProducts.slice(0, 20).map((product) => (
                      <Box key={product.id}>
                        <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ width: 60, height: 60, backgroundColor: colors.background.secondary, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.mainImage ? (
                              <img src={product.mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                            ) : (
                              <Typography>📦</Typography>
                            )}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                              {formatCurrency(product.salePrice > 0 ? product.salePrice : product.sellingPrice)}
                            </Typography>
                          </Box>
                          <TextField
                            type="number"
                            size="small"
                            defaultValue={1}
                            inputProps={{ min: 1, style: { width: 60, textAlign: 'center' } }}
                            sx={{ width: 80 }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => openQuickPick(product)}
                          >
                            Add
                          </Button>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Card>
          </Stack>
        </Box>

        {/* Right Side - Customer Info, Cart & Summary */}
        <Box sx={{ width: { xs: '100%', lg: '400px' }, flexShrink: 0 }}>
          <Stack spacing={3}>
            {/* Customer Summary */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              {selectedCustomer ? (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Customer Summary</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {selectedCustomer.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                    {selectedCustomer.presentAddress || 'No address'}
                  </Typography>
                  
                  <Box sx={{ border: `1px solid ${colors.border.secondary}`, borderRadius: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Account Balance</Typography>
                      <Chip 
                        label={formatCurrency(selectedCustomer.balance || 0)}
                        color={selectedCustomer.balance && selectedCustomer.balance < 0 ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Customer Name</Typography>
                  <CustomInput
                    label=""
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    size="small"
                  />
                  <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                    This name will appear on the bill if no saved customer is selected.
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Cart */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Cart</Typography>
              {cartItems.length === 0 ? (
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center', py: 3 }}>
                  No items in cart
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Box key={item.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {formatCurrency(item.price)} each
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(item.price * item.quantity)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            sx={{ border: `1px solid ${colors.primary[600]}`, color: colors.primary[600] }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            sx={{ border: `1px solid ${colors.primary[600]}`, color: colors.primary[600] }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => updateQuantity(item.id, 0)}
                          startIcon={<DeleteIcon />}
                        >
                          Remove
                        </Button>
                      </Box>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Card>

            {/* Order Summary */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Order Summary</Typography>
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
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Grand Total</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.primary[600] }}>
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Payments */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Payments</Typography>
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
                  label="Received Amount"
                  type="number"
                  size="small"
                  value={receivedAmount.toString()}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                />
              </Box>
              
              <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                Change / Return
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: change >= 0 ? colors.status.success : colors.status.error }}>
                {formatCurrency(change)}
              </Typography>
            </Card>

            {/* Actions */}
            <Card sx={{ 
              p: 2,
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.sm,
            }}>
              <Stack spacing={2}>
                <PrimaryButton
                  fullWidth
                  onClick={handleProceedToBilling}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Billing →
                </PrimaryButton>
                <SecondaryButton
                  fullWidth
                  onClick={handleParkOrder}
                  disabled={cartItems.length === 0}
                >
                  Park Order
                </SecondaryButton>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  Clear Cart
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Box>
      </Box>

      {/* Quick Pick Modal */}
      <Dialog 
        open={quickPickOpen} 
        onClose={() => setQuickPickOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.background.modal,
            border: `1px solid ${colors.border.primary}`,
          }
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>
          {quickPickProduct ? quickPickProduct.name : 'Quick Pick'}
        </DialogTitle>
        <DialogContent>
          {quickPickProduct ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{ width: 60, height: 60, backgroundColor: colors.background.secondary, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {quickPickProduct.mainImage ? (
                  <img src={quickPickProduct.mainImage} alt={quickPickProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                  <Typography>📦</Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary }}>
                  {quickPickProduct.name}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {quickPickProduct.subHeading}
                </Typography>
                <Typography variant="h6" sx={{ color: colors.primary[600], fontWeight: 700, mt: 1 }}>
                  {formatCurrency(quickPickProduct.salePrice > 0 ? quickPickProduct.salePrice : quickPickProduct.sellingPrice)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ color: colors.text.primary }}>Select multiple items quickly</Typography>
          )}
          
          {quickPickProduct && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <TextField
                type="number"
                label="Quantity"
                size="small"
                value={quickPickQuantity}
                onChange={(e) => setQuickPickQuantity(Math.max(1, Number(e.target.value)))}
                inputProps={{ min: 1 }}
                sx={{ 
                  width: 100,
                  '& .MuiInputLabel-root': { color: colors.text.secondary },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: colors.background.secondary,
                    '& fieldset': { borderColor: colors.border.primary },
                    '&:hover fieldset': { borderColor: colors.border.secondary },
                    '&.Mui-focused fieldset': { borderColor: colors.primary[600] },
                  },
                  '& .MuiInputBase-input': { color: colors.text.primary },
                }}
              />
              <PrimaryButton onClick={addQuickPickToCart}>
                Add to Cart
              </PrimaryButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.modal }}>
          <SecondaryButton onClick={() => setQuickPickOpen(false)}>
            Close
          </SecondaryButton>
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