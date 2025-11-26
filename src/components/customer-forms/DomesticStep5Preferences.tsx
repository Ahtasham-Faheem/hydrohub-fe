import { Box, Typography, Card } from '@mui/material';
import { CustomSelect } from '../CustomSelect';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';

export const DomesticStep5Preferences = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const preferences = data.preferences || {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Preferred Delivery Time */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Preferred Delivery Time
        </Typography>
        <CustomSelect
          label="Delivery Time Preference *"
          value={preferences.preferredDeliveryTime || 'flexible'}
          onChange={(e) => updateFormData('preferences.preferredDeliveryTime', e.target.value)}
          options={[
            { label: 'Morning (9 AM - 12 PM)', value: 'morning' },
            { label: 'Afternoon (12 PM - 3 PM)', value: 'afternoon' },
            { label: 'Evening (3 PM - 6 PM)', value: 'evening1' },
            { label: 'Evening (6 PM - 9 PM)', value: 'evening2' },
            { label: 'Flexible / Anytime', value: 'flexible' },
          ]}
        />
      </Box>

      {/* Delivery Frequency */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Delivery Frequency
        </Typography>
        <CustomSelect
          label="How often do you need delivery? *"
          value={preferences.deliveryFrequency || 'daily'}
          onChange={(e) => updateFormData('preferences.deliveryFrequency', e.target.value)}
          options={[
            { label: 'Daily', value: 'daily' },
            { label: 'Alternate Days', value: 'alternate' },
            { label: 'Twice a Week', value: 'twiceWeek' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'On Demand (as per requirement)', value: 'onCall' },
          ]}
        />
      </Box>

      {/* Bottle Handling Preference */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Bottle Handling Preference
        </Typography>
        <CustomSelect
          label="How would you prefer bottles to be delivered? *"
          value={preferences.bottleHandlingPreference || 'doorstep'}
          onChange={(e) => updateFormData('preferences.bottleHandlingPreference', e.target.value)}
          options={[
            { label: 'Delivery at Doorstep Only', value: 'doorstep' },
            { label: 'Delivery Inside Home / Office', value: 'inside' },
            { label: 'Leave at Stairs/Lift', value: 'stairs_lift' },
            { label: 'Pickup Customer Own Bottles, Fill-up from Plant (Special Service)', value: 'pickup_refill' },
          ]}
        />
      </Box>

      {/* Preferred Billing Option */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Preferred Billing Option
        </Typography>
        <CustomSelect
          label="Billing Cycle Preference *"
          value={preferences.billingOption || 'cod'}
          onChange={(e) => updateFormData('preferences.billingOption', e.target.value)}
          options={[
            { label: 'Cash on Delivery', value: 'cod' },
            { label: 'Weekly Invoice', value: 'weekly' },
            { label: 'Fortnightly Invoice', value: 'fortnightly' },
            { label: 'Monthly Invoice', value: 'monthly' },
          ]}
        />
      </Box>

      {/* Mode of Payment */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Mode of Payment
        </Typography>
        <CustomSelect
          label="Preferred payment method *"
          value={preferences.paymentMode || 'cash'}
          onChange={(e) => updateFormData('preferences.paymentMode', e.target.value)}
          options={[
            { label: 'Cash on Delivery', value: 'cash' },
            { label: 'Online', value: 'online' },
            { label: 'Cheque', value: 'cheque' },
          ]}
        />
      </Box>

      {/* Expected Monthly Consumption */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Expected Monthly Consumption
        </Typography>
        <CustomSelect
          label="Approximate bottles per month *"
          value={preferences.monthlyConsumption || '<20'}
          onChange={(e) => updateFormData('preferences.monthlyConsumption', e.target.value)}
          options={[
            { label: 'Less than 20 bottles', value: '<20' },
            { label: '20-50 bottles', value: '20-50' },
            { label: '51-100 bottles', value: '51-100' },
            { label: '100+ bottles', value: '100+' },
          ]}
        />
      </Box>

      {/* Information Card */}
      <Card sx={{ p: 2.5, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e40af', display: 'block', mb: 1 }}>
          ℹ️ Why these preferences matter:
        </Typography>
        <Typography variant="caption" sx={{ color: '#1e3a8a', display: 'block', lineHeight: 1.6 }}>
          Your preferences help us optimize delivery schedules, ensure timely service, and tailor our offerings to match your consumption patterns. This allows us to serve you better and maintain cost efficiency.
        </Typography>
      </Card>
    </Box>
  );
};
