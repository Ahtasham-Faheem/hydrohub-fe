import { Box, Typography, Button } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { PrimaryButton } from '../PrimaryButton';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer } from '../../types/customer';
import { useState } from 'react';

export const DomesticStep1BasicProfile = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfileImage(result);
      updateFormData('profilePhoto', result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageReset = () => {
    setProfileImage(null);
    updateFormData('profilePhoto', '');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Auto-Generated Fields */}
      {/* <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Auto-Generated Fields
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <CustomInput
            label="Customer ID"
            placeholder="Auto-generated"
            value={data.customerId || ''}
            onChange={() => {}}
            disabled
          />
          <CustomInput
            label="Creation Date"
            placeholder="Auto-generated"
            value={data.creationDate?.split('T')[0] || ''}
            onChange={() => {}}
            disabled
          />
        </Box>
      </Box> */}

      {/* Profile Photo */}
      <Box sx={{ display: 'flex', justifyContent: 'start' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: '5%',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography color="textSecondary">Profile Photo</Typography>
            )}
          </Box>

          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-photo-upload"
            type="file"
            onChange={handleImageUpload}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PrimaryButton
                onClick={() => document.getElementById('profile-photo-upload')?.click()}
              >
                Upload Photo
              </PrimaryButton>
              {profileImage && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleImageReset}
                >
                  Reset
                </Button>
              )}
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Allowed JPG, GIF or PNG. Max size 800KB.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Basic Information */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Basic Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomSelect
              label="Title"
              value={data.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              options={[
                { label: 'Mr', value: 'Mr' },
                { label: 'Mrs', value: 'Mrs' },
                { label: 'Ms', value: 'Ms' },
                { label: 'Miss', value: 'Miss' },
                { label: 'Mx', value: 'Mx' },
              ]}
            />
            <CustomInput
              label="First Name *"
              placeholder="Enter first name"
              value={data.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomInput
              label="Last Name *"
              placeholder="Enter last name"
              value={data.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
            />
            <CustomInput
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={data.email}
              onChange={(e) => updateFormData('email', e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <CustomInput
              label="Mobile Number (WhatsApp) *"
              placeholder="Enter mobile number"
              value={data.mobileNumber}
              onChange={(e) => updateFormData('mobileNumber', e.target.value)}
            />
            <CustomInput
              label="Username *"
              placeholder="Enter username"
              value={data.username}
              onChange={(e) => updateFormData('username', e.target.value)}
            />
          </Box>

          <CustomInput
            label="Password *"
            placeholder="Enter password"
            type="password"
            value={data.password}
            onChange={(e) => updateFormData('password', e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
};
