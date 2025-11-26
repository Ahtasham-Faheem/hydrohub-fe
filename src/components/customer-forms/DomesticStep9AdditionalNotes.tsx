import { Box, Typography, Card, TextField } from '@mui/material';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';

export const DomesticStep9AdditionalNotes = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;

  const handleNotesChange = (value: string) => {
    updateFormData('additionalNotes', value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
          Additional Notes & Instructions
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>
          Add any special instructions or notes for the customer
        </Typography>
      </Box>

      {/* Notes Input */}
      <Card sx={{ p: 2.5, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder="Enter any special delivery instructions, building access notes, preferred delivery boy, gate pass requirements, or any other important information about this customer..."
          value={data.additionalNotes ?? ''}
          onChange={(e) => handleNotesChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: '#d1d5db',
              },
              '&:hover fieldset': {
                borderColor: '#9ca3af',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--color-primary-600)',
              },
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 1 }}>
          {data.additionalNotes?.length ?? 0} characters
        </Typography>
      </Card>

      {/* Examples Card */}
      <Card sx={{ p: 2.5, backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#92400e', display: 'block', mb: 1 }}>
          💡 Examples of information to include:
        </Typography>
        <Box sx={{ color: '#b45309', fontSize: '0.8rem', lineHeight: 1.8, ml: 1 }}>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Preferred delivery boy name
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Building entry procedures or gate code
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Specific delivery time window within the day
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Gate pass or security clearance requirements
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • No access days/times
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Delivery alternative contact person
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Any medical or emergency information
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Special billing or payment instructions
          </Typography>
        </Box>
      </Card>

      {/* Info Card */}
      <Card sx={{ p: 2.5, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e40af', display: 'block', mb: 1 }}>
          ℹ️ Why This Matters:
        </Typography>
        <Typography variant="caption" sx={{ color: '#1e3a8a', display: 'block', lineHeight: 1.6 }}>
          These notes will be visible to delivery staff and customer service representatives. Clear, detailed instructions help ensure
          smooth delivery experiences and reduce delivery issues.
        </Typography>
      </Card>
    </Box>
  );
};
