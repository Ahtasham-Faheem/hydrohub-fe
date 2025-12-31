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
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { customerService } from '../../services/api';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { CustomInput } from '../../components/common/CustomInput';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  presentAddress?: string;
  balance?: number;
}

interface Order {
  id: string;
  status: string;
  billTotal: number;
  createdAt: number;
  type?: string;
}

export const DeliveryOrderStep1 = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<Order[]>([]);
  // const [loading, setLoading] = useState(true); // TODO: Implement loading state
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadCustomerOrders(selectedCustomer.id);
    } else {
      setRecentOrders([]);
      setUnpaidOrders([]);
    }
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    try {
      // setLoading(true); // TODO: Implement loading state
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const vendorId = userData?.vendorId || userData?.id || '';
      
      const response = await customerService.getCustomers(vendorId, 1, 100);
      
      // Map API response to Customer interface
      const mappedCustomers = (response.data || []).map((profile: any) => ({
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
      console.error('Error loading customers:', error);
      showToast('Error loading customers', 'error');
    } finally {
      // setLoading(false); // TODO: Implement loading state
    }
  };

  const loadCustomerOrders = (customerId: string) => {
    // Load from localStorage for now - in production this would be an API call
    const savedOrders = localStorage.getItem('hydrohub_orders_v1');
    if (savedOrders) {
      try {
        const allOrders: Order[] = JSON.parse(savedOrders);
        const customerOrders = allOrders.filter(order => 
          order.id.includes(customerId) // Simple filter for demo
        );
        
        // Sort by creation date, most recent first
        const sortedOrders = customerOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setRecentOrders(sortedOrders.slice(0, 10));
        setUnpaidOrders(sortedOrders.filter(order => 
          order.status !== 'completed' && order.status !== 'paid'
        ));
      } catch (error) {
        console.error('Error loading orders:', error);
        setRecentOrders([]);
        setUnpaidOrders([]);
      }
    }
  };

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.presentAddress || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(`${customer.firstName} ${customer.lastName}`);
    
    // Save selected customer to localStorage for next step
    localStorage.setItem('hydrohub_selected_customer', JSON.stringify(customer));
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCustomer(null);
    setRecentOrders([]);
    setUnpaidOrders([]);
    localStorage.removeItem('hydrohub_selected_customer');
  };

  const handleProceed = () => {
    if (!selectedCustomer) {
      showToast('Please select a customer before proceeding', 'error');
      return;
    }
    
    navigate('/dashboard/orders/delivery-step-2');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} PKR`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'shipped': return 'warning';
      case 'assigned': return 'info';
      case 'new': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background.primary, 
      minHeight: '100vh',
      p: 3 
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {/* <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
          Create Delivery Order — Step 1
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Select a customer and review recent activity before proceeding to catalogue.
        </Typography> */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Step 1 of 2
          </Typography>
          <br />
          <Chip label="Customer & History" color="primary" variant="outlined" size="small" />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.2fr 1.2fr' }, gap: 3 }}>
        {/* Left Side - Search & History */}
        <Stack spacing={3}>
          {/* Customer Search */}
          <Card sx={{ 
            p: 2,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.sm,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>Find Customer</Typography>
              <Chip label="Delivery Customers" variant="outlined" size="small" />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <CustomInput
                label=""
                placeholder="Search by name, phone, address…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
              <SecondaryButton
                size="small"
                onClick={handleReset}
                sx={{ minWidth: 80 }}
              >
                🔄 Reset
              </SecondaryButton>
            </Box>

            {/* Customer List */}
            <Box sx={{ 
              border: `1px dashed ${colors.border.secondary}`, 
              borderRadius: 2, 
              p: 2, 
              backgroundColor: colors.background.secondary,
              maxHeight: 320,
              overflow: 'auto'
            }}>
              {!searchTerm ? (
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center' }}>
                  Start typing to search a customer…
                </Typography>
              ) : filteredCustomers.length === 0 ? (
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center' }}>
                  No matching customers found.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      sx={{ 
                        p: 2, 
                        cursor: 'pointer',
                        backgroundColor: colors.background.card,
                        border: selectedCustomer?.id === customer.id ? `2px solid ${colors.primary[600]}` : `1px solid ${colors.border.primary}`,
                        boxShadow: colors.shadow.sm,
                        '&:hover': { 
                          borderColor: colors.primary[300],
                          backgroundColor: colors.background.secondary,
                          boxShadow: colors.shadow.md,
                        }
                      }}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary }}>
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {customer.phone}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.8rem' }}>
                        {customer.presentAddress || 'No address provided'}
                      </Typography>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>

          {/* Recent Orders */}
          <Card sx={{ 
            p: 2,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.sm,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>Recent Orders</Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Total: {recentOrders.length}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 2, display: 'block' }}>
              Last 10 orders of selected customer.
            </Typography>
            
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 40 }}></TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!selectedCustomer ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', color: colors.text.secondary }}>
                          No customer selected.
                        </TableCell>
                      </TableRow>
                    ) : recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', color: colors.text.secondary }}>
                          No recent orders.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentOrders.map((order, _) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Chip 
                              label={order.status.charAt(0).toUpperCase()} 
                              color={getStatusColor(order.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{(order.type || 'DELIVERY').toUpperCase()}</TableCell>
                          <TableCell align="right">{formatCurrency(order.billTotal)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>

          {/* Unpaid Orders */}
          <Card sx={{ 
            p: 2,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.sm,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ color: colors.text.primary }}>Unpaid / Outstanding</Typography>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Count: {unpaidOrders.length}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 2, display: 'block' }}>
              Pending receipts / invoices.
            </Typography>
            
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 40 }}></TableCell>
                      <TableCell>Receipt ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!selectedCustomer ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', color: colors.text.secondary }}>
                          No customer selected.
                        </TableCell>
                      </TableRow>
                    ) : unpaidOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', color: colors.text.secondary }}>
                          No unpaid receipts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      unpaidOrders.map((order, index) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Button size="small" variant="outlined" sx={{ minWidth: 30, p: 0.5 }}>
                              +
                            </Button>
                          </TableCell>
                          <TableCell>REC-{index + 1}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="right">{formatCurrency(order.billTotal)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        </Stack>

        {/* Right Side - Summary & Actions */}
        <Stack spacing={3}>
          {/* Customer Summary */}
          <Card sx={{ 
            p: 2,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.sm,
          }}>
            <Typography variant="h6" sx={{ mb: 1, color: colors.text.primary }}>Customer Summary</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 2, display: 'block' }}>
              Selected customer profile & status
            </Typography>
            
            {!selectedCustomer ? (
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                No customer selected.
              </Typography>
            ) : (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: colors.text.primary }}>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
                  {selectedCustomer.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                  {selectedCustomer.presentAddress || 'No address provided'}
                </Typography>
                <Divider sx={{ my: 2, borderColor: colors.border.primary }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: colors.text.primary }}>Outstanding Balance</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                    {formatCurrency(selectedCustomer.balance || 0)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>

          {/* Monthly Bills */}
          <Card sx={{ 
            p: 2,
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.sm,
          }}>
            <Typography variant="h6" sx={{ mb: 1, color: colors.text.primary }}>Monthly Bills</Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 2, display: 'block' }}>
              [Month] [Bill Amount] [Bill Status]
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Bill Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!selectedCustomer ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', color: colors.text.secondary }}>
                        Select a customer.
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Generate last 6 months for demo
                    Array.from({ length: 6 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - i);
                      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      
                      return (
                        <TableRow key={i}>
                          <TableCell>{monthYear}</TableCell>
                          <TableCell>{formatCurrency(0)}</TableCell>
                          <TableCell>
                            <Chip label="No Data" color="default" size="small" />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
                onClick={handleProceed}
                disabled={!selectedCustomer}
                startIcon={<span>🛒</span>}
              >
                Proceed to Catalogue
              </PrimaryButton>
              <SecondaryButton
                fullWidth
                onClick={() => navigate('/dashboard/orders')}
                startIcon={<span>←</span>}
              >
                Back to Orders
              </SecondaryButton>
            </Stack>
          </Card>
        </Stack>
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