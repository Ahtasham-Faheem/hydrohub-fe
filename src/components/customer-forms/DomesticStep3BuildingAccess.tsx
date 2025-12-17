import { Box, Typography, Card, Switch, FormControlLabel, Alert } from '@mui/material';
import { CustomInput } from '../common/CustomInput';
import { CustomSelect } from '../common/CustomSelect';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';
import { MdLocationOn } from 'react-icons/md';
import { useUpdateBuildingInfo } from '../../hooks/useUpdateBuildingInfo';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';

interface DomesticStep3BuildingAccessProps {
  customerProfileId?: string;
}

export interface DomesticStep3BuildingAccessHandle {
  submit: () => Promise<void>;
}

export const DomesticStep3BuildingAccess = forwardRef<DomesticStep3BuildingAccessHandle, DomesticStep3BuildingAccessProps>(
  ({ customerProfileId }: DomesticStep3BuildingAccessProps, ref) => {
    const { state, updateFormData, fieldErrors, setFieldErrors } = useCustomerForm();
    const data = state.data as DomesticCustomer;
    const buildingAccess = data.buildingAccessInfo || {};
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const updateBuildingInfoMutation = useUpdateBuildingInfo();
    const hasSubmittedRef = useRef(false);

    const submitBuildingInfo = async () => {
      if (!customerProfileId || isSubmitting || hasSubmittedRef.current) return;

      // Only submit if we have required fields filled
      if (!buildingAccess.ownershipStatus || !buildingAccess.deliveryAccessLevel) return;

      hasSubmittedRef.current = true;
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await updateBuildingInfoMutation.mutateAsync({
          customerProfileId,
          buildingData: {
            mapLocation: buildingAccess.mapLocation,
            ownership: buildingAccess.ownershipStatus,
            accessLevel: buildingAccess.deliveryAccessLevel,
            floorPosition: buildingAccess.floorPosition,
            basementPosition: buildingAccess.basementPosition,
            liftStartTime: buildingAccess.liftServiceStartTime,
            liftEndTime: buildingAccess.liftServiceCloseTime,
            accessNotes: buildingAccess.accessNotes,
          },
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to save building information';
        setSubmitError(errorMessage);
        hasSubmittedRef.current = false;
      } finally {
        setIsSubmitting(false);
      }
    };

    // Expose submit function via ref
    useImperativeHandle(ref, () => ({
      submit: submitBuildingInfo,
    }));

  const handleAccessOptionChange = (option: string, checked: boolean) => {
    const currentOptions = buildingAccess.accessOptions || [];
    const updatedOptions = checked
      ? [...currentOptions, option]
      : currentOptions.filter((o) => o !== option);
    updateFormData('buildingAccessInfo.accessOptions', updatedOptions);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      
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
          onChange={(e) => {
            updateFormData('buildingAccessInfo.mapLocation', e.target.value);
            // Clear error when user starts typing
            if (fieldErrors['buildingAccessInfo.mapLocation']) {
              setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.mapLocation': "" });
            }
          }}
          error={fieldErrors['buildingAccessInfo.mapLocation']}
        />
      </Box>

      {/* Ownership Status */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Ownership Status
        </Typography>
        <CustomSelect
          label="Ownership Status *"
          value={buildingAccess.ownershipStatus || ''}
          onChange={(e) => {
            updateFormData('buildingAccessInfo.ownershipStatus', e.target.value);
            // Clear error when user selects
            if (fieldErrors['buildingAccessInfo.ownershipStatus']) {
              setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.ownershipStatus': "" });
            }
          }}
          error={fieldErrors['buildingAccessInfo.ownershipStatus']}
          options={[
            { label: 'Personal', value: 'personal' },
            { label: 'Rental', value: 'rental' },
            { label: 'Mortgage', value: 'mortgage' },
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
          value={buildingAccess.deliveryAccessLevel || ''}
          onChange={(e) => {
            const newValue = e.target.value;
            updateFormData('buildingAccessInfo.deliveryAccessLevel', newValue);
            
            // Clear conditional fields when access level changes
            if (newValue !== 'upstairs') {
              updateFormData('buildingAccessInfo.floorPosition', '');
            }
            if (newValue !== 'basement') {
              updateFormData('buildingAccessInfo.basementPosition', '');
            }
            
            // Clear error when user selects
            if (fieldErrors['buildingAccessInfo.deliveryAccessLevel']) {
              setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.deliveryAccessLevel': "" });
            }
          }}
          error={fieldErrors['buildingAccessInfo.deliveryAccessLevel']}
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
            onChange={(e) => {
              updateFormData('buildingAccessInfo.floorPosition', e.target.value);
              // Clear error when user selects
              if (fieldErrors['buildingAccessInfo.floorPosition']) {
                setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.floorPosition': "" });
              }
            }}
            onClearError={() => setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.floorPosition': "" })}
            error={fieldErrors['buildingAccessInfo.floorPosition']}
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
            onChange={(e) => {
              updateFormData('buildingAccessInfo.basementPosition', e.target.value);
              // Clear error when user selects
              if (fieldErrors['buildingAccessInfo.basementPosition']) {
                setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.basementPosition': "" });
              }
            }}
            onClearError={() => setFieldErrors({ ...fieldErrors, 'buildingAccessInfo.basementPosition': "" })}
            error={fieldErrors['buildingAccessInfo.basementPosition']}
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
});

export default DomesticStep3BuildingAccess;
