import { Box, Typography } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomDateInput } from '../CustomDateInput';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';
import dayjs from 'dayjs';

export const DomesticStep2PersonalInfo = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Personal Details */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Personal Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomInput
              label="Father/Husband Name"
              placeholder="Enter name"
              value={data.fatherHusbandName || ''}
              onChange={(e) => updateFormData('fatherHusbandName', e.target.value)}
            />
            <CustomInput
              label="Mother Name"
              placeholder="Enter name"
              value={data.motherName || ''}
              onChange={(e) => updateFormData('motherName', e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomDateInput
              label="Date of Birth *"
              value={data.dateOfBirth ? dayjs(data.dateOfBirth) : null}
              onChange={(date) => updateFormData('dateOfBirth', date)}
            />
            <CustomSelect
              label="Nationality"
              value={data.nationality || ''}
              onChange={(e) => updateFormData('nationality', e.target.value)}
              options={[
                { label: 'Pakistani', value: 'Pakistani' },
                { label: 'Indian', value: 'Indian' },
                { label: 'Other', value: 'Other' },
              ]}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomInput
              label="CNIC / National ID Number"
              placeholder="Enter CNIC"
              value={data.cnicNumber || ''}
              onChange={(e) => updateFormData('cnicNumber', e.target.value)}
            />
            <CustomSelect
              label="Gender"
              value={data.gender}
              onChange={(e) => updateFormData('gender', e.target.value)}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomSelect
              label="Marital Status"
              value={data.maritalStatus}
              onChange={(e) => updateFormData('maritalStatus', e.target.value)}
              options={[
                { label: 'Single', value: 'single' },
                { label: 'Married', value: 'married' },
                { label: 'Divorced', value: 'divorced' },
                { label: 'Widowed', value: 'widowed' },
              ]}
            />
            <CustomInput
              label="Alternate Contact Number"
              placeholder="Enter phone number"
              value={data.alternateContactNumber || ''}
              onChange={(e) => updateFormData('alternateContactNumber', e.target.value)}
            />
          </Box>

          <CustomSelect
            label="Preferred Contact Method"
            value={data.preferredContactMethod}
            onChange={(e) => updateFormData('preferredContactMethod', e.target.value)}
            options={[
              { label: 'WhatsApp', value: 'whatsapp' },
              { label: 'Phone Call', value: 'phone' },
              { label: 'SMS', value: 'sms' },
              { label: 'Email', value: 'email' },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};
