import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
} from '@mui/material';
import { 
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { staffService } from '../../services/api';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { CustomSelect } from '../../components/common/CustomSelect';
import { CustomInput } from '../../components/common/CustomInput';

interface Order {
  id: string;
  status: 'new' | 'assigned' | 'shipped' | 'completed';
  customer: {
    name: string;
    phone: string;
    address: string;
    id?: string;
  };
  items: Array<{
    name: string;
    qty: number;
    price: number;
  }>;
  billTotal: number;
  previousBalance: number;
  requirements?: string[];
  assignedTo?: {
    id: string;
    name: string;
  };
  assignNote?: string;
  createdAt: number;
  assignedAt?: number;
  shippedAt?: number;
  completedAt?: number;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const ORDER_STATUSES = [
  { key: 'new', label: 'New', color: 'primary' },
  { key: 'assigned', label: 'Assigned', color: 'info' },
  { key: 'shipped', label: 'Shipped', color: 'warning' },
  { key: 'completed', label: 'Completed', color: 'success' },
] as const;

const DELIVERY_REQUIREMENTS = [
  'Deliver to ground floor',
  'Leave at kitchen',
  'Pickup empties only',
  'Replace bottle at dispenser',
  'Call before delivery',
  'Ring doorbell twice',
];

export const OrderManagement = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [shippedModalOpen, setShippedModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  // const [invoiceModalOpen, setInvoiceModalOpen] = useState(false); // TODO: Implement invoice modal
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);
  
  // Form states
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [assignNote, setAssignNote] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [customRequirements, setCustomRequirements] = useState<string[]>([]);
  
  // Shipped order states
  const [shippedItems, setShippedItems] = useState<Array<{name: string; qty: number; price: number}>>([]);
  const [bottleOrdered, setBottleOrdered] = useState(0);
  const [bottleReceived, setBottleReceived] = useState(0);
  const [isCollectable, setIsCollectable] = useState(false);
  const [shipRemarks, setShipRemarks] = useState('');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online' | 'Credit'>('COD');
  const [receivedAmount, setReceivedAmount] = useState(0);
  
  // Toast
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadOrders();
    loadStaff();
  }, []);

  const loadOrders = () => {
    // Load from localStorage for now - in production this would be an API call
    const savedOrders = localStorage.getItem('hydrohub_orders_v1');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders(getDemoOrders());
      }
    } else {
      setOrders(getDemoOrders());
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

  const getDemoOrders = (): Order[] => [
    {
      id: "ORD-1001",
      status: "new",
      customer: { name: "Walk-In Customer", phone: "", address: "123 Main St" },
      items: [{ name: "19L Mineral Water", qty: 4, price: 300 }],
      billTotal: 1200,
      previousBalance: 0,
      createdAt: Date.now() - 3600000,
    },
    {
      id: "ORD-1002", 
      status: "assigned",
      customer: { name: "Ali Raza", phone: "0300-1234567", address: "456 Oak Ave" },
      items: [{ name: "19L Mineral Water", qty: 2, price: 300 }],
      billTotal: 600,
      previousBalance: 200,
      assignedTo: { id: "S1", name: "Raza Ahmed" },
      requirements: ["Deliver to ground floor"],
      assignNote: "",
      createdAt: Date.now() - 7200000,
      assignedAt: Date.now() - 3600000,
    },
    {
      id: "ORD-1003",
      status: "shipped", 
      customer: { name: "Bilal Ahmad", phone: "0301-9876543", address: "789 Pine St" },
      items: [{ name: "19L Mineral Water", qty: 3, price: 300 }],
      billTotal: 900,
      previousBalance: 300,
      createdAt: Date.now() - 10800000,
      shippedAt: Date.now() - 1800000,
    }
  ];

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('hydrohub_orders_v1', JSON.stringify(updatedOrders));
  };

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} PKR`;
  };

  const getStatusColor = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.key === status);
    return statusConfig?.color || 'default';
  };

  // Order Actions
  const handleAssignOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSelectedStaffId('');
    setSelectedRequirements([]);
    setAssignNote('');
    setAssignModalOpen(true);
  };

  const confirmAssignOrder = () => {
    const selectedStaff = staff.find(s => s.id === selectedStaffId);
    if (!selectedStaff) {
      showToast('Please select a staff member', 'error');
      return;
    }

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrderId) {
        return {
          ...order,
          status: 'assigned' as const,
          assignedTo: {
            id: selectedStaff.id,
            name: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
          },
          requirements: selectedRequirements,
          assignNote,
          assignedAt: Date.now(),
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    setAssignModalOpen(false);
    showToast(`Order assigned to ${selectedStaff.firstName} ${selectedStaff.lastName}`);
  };

  const handleMarkShipped = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'shipped' as const,
          shippedAt: Date.now(),
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    showToast('Order marked as shipped');
  };

  const handleUpdateShipped = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setSelectedOrderId(orderId);
    setShippedItems([...order.items]);
    setBottleOrdered(order.items.reduce((sum, item) => sum + item.qty, 0));
    setBottleReceived(0);
    setIsCollectable(false);
    setShipRemarks('');
    setShippedModalOpen(true);
  };

  const handleCompleteOrder = () => {
    setPaymentModalOpen(true);
    setShippedModalOpen(false);
  };

  const confirmCompleteOrder = () => {
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrderId) {
        return {
          ...order,
          status: 'completed' as const,
          completedAt: Date.now(),
          items: shippedItems,
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    setPaymentModalOpen(false);
    showToast('Order completed successfully');
  };

  const handleViewInvoice = (orderId: string) => {
    setSelectedOrderId(orderId);
    // setInvoiceModalOpen(true); // TODO: Implement invoice modal
    console.log('View invoice for order:', orderId);
  };

  const addNewRequirement = () => {
    if (newRequirement.trim()) {
      setCustomRequirements([...customRequirements, newRequirement.trim()]);
      setNewRequirement('');
      setRequirementModalOpen(false);
    }
  };

  const renderOrderCard = (order: Order) => {
    const isExpanded = expandedOrders.has(order.id);
    const grandTotal = order.billTotal + order.previousBalance;

    return (
      <Card key={order.id} sx={{ 
        mb: 2, 
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.primary}`,
        boxShadow: colors.shadow.sm,
        '&:hover': {
          boxShadow: colors.shadow.md,
        }
      }}>
        <Box sx={{ p: 2 }}>
          {/* Order Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: colors.text.primary }}>
                Order #{order.id}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary }}>
                {order.customer.name}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                CID: {order.customer.id || '-'} • {order.customer.phone || '-'}
              </Typography>
            </Box>
            <Chip 
              label={ORDER_STATUSES.find(s => s.key === order.status)?.label}
              color={getStatusColor(order.status) as any}
              variant="filled"
            />
          </Box>

          {/* Address */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              📍 {order.customer.address || '—'}
            </Typography>
          </Box>

          {/* Order Summary */}
          <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: colors.text.primary }}>
              <strong>Bill:</strong> {formatCurrency(order.billTotal)}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.primary }}>
              <strong>Prev Bal:</strong> {formatCurrency(order.previousBalance)}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.primary }}>
              <strong>Total:</strong> {formatCurrency(grandTotal)}
            </Typography>
          </Box>

          {/* Expand Button */}
          <Button
            variant="text"
            onClick={() => toggleOrderExpansion(order.id)}
            sx={{ color: colors.primary[600], p: 0, mb: 2 }}
          >
            View Details {isExpanded ? '▲' : '▼'}
          </Button>

          {/* Expanded Details */}
          {isExpanded && (
            <Box sx={{ borderTop: `1px dashed ${colors.border.secondary}`, pt: 2 }}>
              {/* Items Table */}
              <TableContainer sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: colors.text.primary }}>Sr</TableCell>
                      <TableCell sx={{ color: colors.text.primary }}>Item</TableCell>
                      <TableCell align="center" sx={{ color: colors.text.primary }}>Qty</TableCell>
                      <TableCell align="right" sx={{ color: colors.text.primary }}>Price</TableCell>
                      <TableCell align="right" sx={{ color: colors.text.primary }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: colors.text.primary }}>{index + 1}</TableCell>
                        <TableCell sx={{ color: colors.text.primary }}>{item.name}</TableCell>
                        <TableCell align="center" sx={{ color: colors.text.primary }}>{item.qty}</TableCell>
                        <TableCell align="right" sx={{ color: colors.text.primary }}>{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right" sx={{ color: colors.text.primary }}>{formatCurrency(item.qty * item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Requirements */}
              {order.requirements && order.requirements.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colors.text.primary }}>
                    Requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {order.requirements.map((req, index) => (
                      <Chip key={index} label={req} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {order.status === 'new' && (
                  <PrimaryButton
                    size="small"
                    onClick={() => handleAssignOrder(order.id)}
                    startIcon={<AssignmentIcon />}
                  >
                    Assign Order
                  </PrimaryButton>
                )}
                
                {order.status === 'assigned' && (
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleMarkShipped(order.id)}
                    startIcon={<ShippingIcon />}
                  >
                    Mark as Shipped
                  </Button>
                )}
                
                {order.status === 'shipped' && (
                  <PrimaryButton
                    size="small"
                    onClick={() => handleUpdateShipped(order.id)}
                    startIcon={<CheckCircleIcon />}
                  >
                    Update Delivery
                  </PrimaryButton>
                )}
                
                {order.status === 'completed' && (
                  <SecondaryButton
                    size="small"
                    onClick={() => handleViewInvoice(order.id)}
                    startIcon={<ReceiptIcon />}
                  >
                    View Invoice
                  </SecondaryButton>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  const currentStatusKey = ORDER_STATUSES[activeTab]?.key || 'new';
  const currentOrders = getOrdersByStatus(currentStatusKey);

  return (
    <Box sx={{ 
      backgroundColor: colors.background.primary, 
      minHeight: '100vh',
      p: 3 
    }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1 }}>
            Orders Management
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Manage all orders smartly
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <SecondaryButton
            size="small"
            onClick={() => window.location.href = '/#/dashboard/orders/delivery-step-1'}
          >
            + New Order
          </SecondaryButton>
          <SecondaryButton
            size="small"
            onClick={() => window.location.href = '/#/dashboard/overview'}
          >
            ← Dashboard
          </SecondaryButton>
        </Box>
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

      {/* Status Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: colors.border.primary, 
        mb: 3,
        backgroundColor: colors.background.card,
        borderRadius: '8px 8px 0 0',
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: colors.text.secondary,
              '&.Mui-selected': {
                color: colors.primary[600],
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary[600],
            },
          }}
        >
          {ORDER_STATUSES.map((status, _) => (
            <Tab 
              key={status.key}
              label={`${status.label} (${getOrdersByStatus(status.key).length})`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Orders List */}
      <Box>
        {currentOrders.length === 0 ? (
          <Card sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            boxShadow: colors.shadow.sm,
          }}>
            <Typography variant="body1" sx={{ color: colors.text.secondary }}>
              No {currentStatusKey} orders found.
            </Typography>
          </Card>
        ) : (
          currentOrders.map(renderOrderCard)
        )}
      </Box>

      {/* Assign Order Modal */}
      <Dialog 
        open={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.background.modal,
            border: `1px solid ${colors.border.primary}`,
          }
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>Assign Order to Staff</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Staff Selection */}
            <CustomSelect
              label="Select Delivery Staff"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              options={staff.map((member) => ({
                value: member.id,
                label: `${member.firstName} ${member.lastName}`
              }))}
            />

            {/* Requirements */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                Delivery Requirements
              </Typography>
              <Stack spacing={1}>
                {[...DELIVERY_REQUIREMENTS, ...customRequirements].map((req) => (
                  <FormControlLabel
                    key={req}
                    control={
                      <Checkbox
                        checked={selectedRequirements.includes(req)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRequirements([...selectedRequirements, req]);
                          } else {
                            setSelectedRequirements(selectedRequirements.filter(r => r !== req));
                          }
                        }}
                        sx={{
                          color: colors.text.secondary,
                          '&.Mui-checked': {
                            color: colors.primary[600],
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: colors.text.primary }}>{req}</Typography>}
                  />
                ))}
              </Stack>
              <SecondaryButton
                size="small"
                onClick={() => setRequirementModalOpen(true)}
                sx={{ mt: 1 }}
              >
                + Add New Requirement
              </SecondaryButton>
            </Box>

            {/* Operator Note */}
            <CustomInput
              label="Operator Note"
              multiline
              rows={3}
              value={assignNote}
              onChange={(e) => setAssignNote(e.target.value)}
              placeholder="Example: Deliver to ground floor, customer prefers quick drop-off..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.modal }}>
          <SecondaryButton onClick={() => setAssignModalOpen(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={confirmAssignOrder}>
            Assign
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Add Requirement Modal */}
      <Dialog 
        open={requirementModalOpen} 
        onClose={() => setRequirementModalOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: colors.background.modal,
            border: `1px solid ${colors.border.primary}`,
          }
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>New Requirement</DialogTitle>
        <DialogContent>
          <CustomInput
            label="Requirement Title"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="e.g. Drop bottles at kitchen, Pick empties only"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.modal }}>
          <SecondaryButton onClick={() => setRequirementModalOpen(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={addNewRequirement}>
            Save
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Shipped Order Update Modal */}
      <Dialog 
        open={shippedModalOpen} 
        onClose={() => setShippedModalOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.background.modal,
            border: `1px solid ${colors.border.primary}`,
          }
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>Update Shipped Order</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Delivered Items */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Delivered Items</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: colors.text.primary }}>Item</TableCell>
                      <TableCell sx={{ color: colors.text.primary }}>Qty</TableCell>
                      <TableCell sx={{ color: colors.text.primary }}>Price</TableCell>
                      <TableCell sx={{ color: colors.text.primary }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shippedItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: colors.text.primary }}>{item.name}</TableCell>
                        <TableCell sx={{ color: colors.text.primary }}>{item.qty}</TableCell>
                        <TableCell sx={{ color: colors.text.primary }}>{formatCurrency(item.price)}</TableCell>
                        <TableCell sx={{ color: colors.text.primary }}>{formatCurrency(item.qty * item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Bottle Return Summary */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>Bottle Return Summary</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <TextField
                  label="Ordered Bottles"
                  value={bottleOrdered}
                  InputProps={{ readOnly: true }}
                  sx={{
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
                <TextField
                  label="Received Empty Bottles"
                  type="number"
                  value={bottleReceived}
                  onChange={(e) => setBottleReceived(Number(e.target.value))}
                  sx={{
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
                <TextField
                  label="Balance (Unreturned)"
                  value={Math.max(0, bottleOrdered - bottleReceived)}
                  InputProps={{ readOnly: true }}
                  sx={{
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
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCollectable}
                    onChange={(e) => setIsCollectable(e.target.checked)}
                    sx={{
                      color: colors.text.secondary,
                      '&.Mui-checked': {
                        color: colors.primary[600],
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: colors.text.primary }}>Mark as Collectable Bottles</Typography>}
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Remarks */}
            <TextField
              label="Remarks"
              multiline
              rows={3}
              value={shipRemarks}
              onChange={(e) => setShipRemarks(e.target.value)}
              fullWidth
              sx={{
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.modal }}>
          <SecondaryButton onClick={() => setShippedModalOpen(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleCompleteOrder}>
            Mark Complete
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: colors.background.modal,
            border: `1px solid ${colors.border.primary}`,
          }
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>Finalize Payment</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: colors.text.primary }}>
                Payment Method
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['COD', 'Online', 'Credit'] as const).map((method) => (
                  <Chip
                    key={method}
                    label={method === 'COD' ? '💵 Cash' : method === 'Online' ? '🌐 Online' : '📄 Credit'}
                    onClick={() => setPaymentMethod(method)}
                    color={paymentMethod === method ? 'primary' : 'default'}
                    variant={paymentMethod === method ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: paymentMethod === method ? colors.primary[700] : colors.background.secondary,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              label="Received Amount"
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(Number(e.target.value))}
              fullWidth
              sx={{
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.modal }}>
          <SecondaryButton onClick={() => setPaymentModalOpen(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={confirmCompleteOrder}>
            Complete Order
          </PrimaryButton>
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