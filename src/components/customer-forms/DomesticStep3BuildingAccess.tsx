import { Box, Typography, Card, Switch, FormControlLabel } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';
import { MdLocationOn } from 'react-icons/md';

export const DomesticStep3BuildingAccess = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const buildingAccess = data.buildingAccessInfo || {};

  const handleAccessOptionChange = (option: string, checked: boolean) => {
    const currentOptions = buildingAccess.accessOptions || [];
    const updatedOptions = checked
      ? [...currentOptions, option]
      : currentOptions.filter((o) => o !== option);
    updateFormData('buildingAccessInfo.accessOptions', updatedOptions);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Google Map Location */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MdLocationOn size={20} style={{ color: 'var(--color-primary-600)' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
            Google Map Location
          </Typography>
        </Box>
        <CustomInput
          label="Location Map Link / Coordinates"
          placeholder="Paste Google Maps location link or coordinates"
          value={buildingAccess.mapLocation || ''}
          onChange={(e) => updateFormData('buildingAccessInfo.mapLocation', e.target.value)}
        />
      </Box>

      {/* Ownership Status */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Ownership Status
        </Typography>
        <CustomSelect
          label="Ownership Status *"
          value={buildingAccess.ownershipStatus || 'personal'}
          onChange={(e) => updateFormData('buildingAccessInfo.ownershipStatus', e.target.value)}
          options={[
            { label: 'Personal', value: 'personal' },
            { label: 'Rental', value: 'rental' },
            { label: 'Mortgage', value: 'mortgage' },
            { label: 'Other', value: 'other' },
          ]}
        />
      </Box>

      {/* Delivery Access Level */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Delivery Access Level
        </Typography>
        <CustomSelect
          label="Delivery Access Level *"
          value={buildingAccess.deliveryAccessLevel || 'ground'}
          onChange={(e) => updateFormData('buildingAccessInfo.deliveryAccessLevel', e.target.value)}
          options={[
            { label: 'Basement', value: 'basement' },
            { label: 'Ground Floor', value: 'ground' },
            { label: 'Upstairs', value: 'upstairs' },
          ]}
        />
      </Box>

      {/* Floor Position - Conditional based on delivery access level */}
      {buildingAccess.deliveryAccessLevel === 'upstairs' && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Floor Position
          </Typography>
          <CustomSelect
            label="Floor Position *"
            value={buildingAccess.floorPosition || ''}
            onChange={(e) => updateFormData('buildingAccessInfo.floorPosition', e.target.value)}
            options={[
              { label: '1st Floor', value: '1st' },
              { label: '2nd Floor', value: '2nd' },
              { label: '3rd Floor', value: '3rd' },
              { label: '4th Floor', value: '4th' },
              { label: 'Other', value: 'other' },
            ]}
          />
        </Box>
      )}

      {/* Basement Position - Conditional based on delivery access level */}
      {buildingAccess.deliveryAccessLevel === 'basement' && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Basement Position
          </Typography>
          <CustomSelect
            label="Basement Position *"
            value={buildingAccess.basementPosition || ''}
            onChange={(e) => updateFormData('buildingAccessInfo.basementPosition', e.target.value)}
            options={[
              { label: 'LG 1', value: 'LG1' },
              { label: 'LG 2', value: 'LG2' },
              { label: 'LG 3', value: 'LG3' },
              { label: 'LG 4', value: 'LG4' },
              { label: 'Other', value: 'other' },
            ]}
          />
        </Box>
      )}

      {/* Access Options */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Access Options *
        </Typography>
        <Card sx={{ p: 2, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={buildingAccess.accessOptions?.includes('stairs') || false}
                  onChange={(e) => handleAccessOptionChange('stairs', e.target.checked)}
                />
              }
              label="Stairs"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={buildingAccess.accessOptions?.includes('serviceLift') || false}
                  onChange={(e) => handleAccessOptionChange('serviceLift', e.target.checked)}
                />
              }
              label="Service Lift / Elevator"
            />
          </Box>
        </Card>
      </Box>

      {/* Lift Service Timings - Conditional */}
      {buildingAccess.accessOptions?.includes('serviceLift') && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Lift Service Timings
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomInput
              label="Start Time *"
              type="time"
              value={buildingAccess.liftServiceStartTime || ''}
              onChange={(e) => updateFormData('buildingAccessInfo.liftServiceStartTime', e.target.value)}
            />
            <CustomInput
              label="Close Time *"
              type="time"
              value={buildingAccess.liftServiceCloseTime || ''}
              onChange={(e) => updateFormData('buildingAccessInfo.liftServiceCloseTime', e.target.value)}
            />
          </Box>
        </Box>
      )}

      {/* Additional Notes */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Additional Access Notes
        </Typography>
        <CustomInput
          label="Special Instructions or Access Notes"
          placeholder="Enter any special access instructions (e.g., buzz apartment number, call before delivery)"
          value={buildingAccess.accessNotes || ''}
          onChange={(e) => updateFormData('buildingAccessInfo.accessNotes', e.target.value)}
          multiline
          rows={4}
        />
      </Box>
    </Box>
  );
};
