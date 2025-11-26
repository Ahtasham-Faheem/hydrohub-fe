import { Box, Typography, Card } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';

export const DomesticStep8Security = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const security = data.security || {};

  const handleSecurityChange = (field: string, value: any) => {
    updateFormData('security', {
      ...security,
      [field]: value,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
          Security & Deposit Information
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>
          Record all security deposits and bottle-related information
        </Typography>
      </Box>

      {/* Security Amount Section */}
      <Card sx={{ p: 2.5, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Security Deposit Details
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <CustomInput
            label="Total Security Amount"
            type="number"
            placeholder="0"
            value={String(security.securityAmount ?? '')}
            onChange={(e) => handleSecurityChange('securityAmount', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Security Per Bottle"
            type="number"
            placeholder="0"
            value={String(security.securityPerBottle ?? '')}
            onChange={(e) => handleSecurityChange('securityPerBottle', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Advance Payment Amount"
            type="number"
            placeholder="0"
            value={String(security.advancePayment ?? '')}
            onChange={(e) => handleSecurityChange('advancePayment', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Refund Due Amount"
            type="number"
            placeholder="0"
            value={String(security.refundDue ?? '')}
            onChange={(e) => handleSecurityChange('refundDue', e.target.value ? Number(e.target.value) : '')}
          />
        </Box>
      </Card>

      {/* Bottle Tracking Section */}
      <Card sx={{ p: 2.5, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Bottle Tracking & Inventory
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <CustomInput
            label="Number of Bottles Issued"
            type="number"
            placeholder="0"
            value={String(security.numBottlesIssued ?? '')}
            onChange={(e) => handleSecurityChange('numBottlesIssued', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Empty Bottles Without Security"
            type="number"
            placeholder="0"
            value={String(security.emptyBottlesWithoutSecurity ?? '')}
            onChange={(e) => handleSecurityChange('emptyBottlesWithoutSecurity', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Empty Bottles Received"
            type="number"
            placeholder="0"
            value={String(security.emptyBottlesReceived ?? '')}
            onChange={(e) => handleSecurityChange('emptyBottlesReceived', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Bottles in Circulation"
            type="number"
            placeholder="Auto-calculated"
            disabled
            value={String(
              (security.numBottlesIssued ?? 0) -
              ((security.emptyBottlesWithoutSecurity ?? 0) + (security.emptyBottlesReceived ?? 0))
            )}
          />
        </Box>
      </Card>

      {/* Returns & Refunds Section */}
      <Card sx={{ p: 2.5, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Returns & Refunds
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <CustomInput
            label="Bottles Returned"
            type="number"
            placeholder="0"
            value={String(security.bottlesReturned ?? '')}
            onChange={(e) => handleSecurityChange('bottlesReturned', e.target.value ? Number(e.target.value) : '')}
          />
          <CustomInput
            label="Security Refunded"
            type="number"
            placeholder="0"
            value={String(security.securityRefunded ?? '')}
            onChange={(e) => handleSecurityChange('securityRefunded', e.target.value ? Number(e.target.value) : '')}
          />
        </Box>
      </Card>

      {/* Info Card */}
      <Card sx={{ p: 2.5, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#166534', display: 'block', mb: 1 }}>
          ℹ️ Security Deposit Information:
        </Typography>
        <Typography variant="caption" sx={{ color: '#15803d', display: 'block', lineHeight: 1.6 }}>
          Record all security deposits, bottle inventory, and refund information. The system automatically calculates bottles in circulation
          (issued minus empty received). Update these values as transactions occur.
        </Typography>
      </Card>
    </Box>
  );
};
