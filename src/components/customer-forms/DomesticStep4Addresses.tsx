import { Box, Typography, Card, Button, Switch, FormControlLabel, Collapse, IconButton } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer, Address } from '../../types/customer';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';

export const DomesticStep4Addresses = () => {
  const { state, updateFormData, addAddress, removeAddress, updateAddress } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const [expandedAddressIndex, setExpandedAddressIndex] = useState<number | null>(0);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [newAddressMode, setNewAddressMode] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(data.sameAsBillingAddress !== false);

  const emptyAddress: Address = {
    title: '',
    houseNumber: '',
    street: '',
    block: '',
    sector: '',
    society: '',
    landmark: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
  };

  const [formAddress, setFormAddress] = useState<Address>(emptyAddress);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddNewAddress = () => {
    if (formAddress.city && formAddress.country) {
      // Build concatenated address
      const parts = [
        formAddress.houseNumber,
        formAddress.street,
        formAddress.block,
        formAddress.sector,
        formAddress.society,
        formAddress.landmark,
        formAddress.city,
        formAddress.province,
        formAddress.country,
        formAddress.postalCode,
      ].filter(Boolean);

      const concatenated = parts.join(', ');

      const newAddress: Address = {
        ...formAddress,
        concatenatedAddress: concatenated,
      };

      addAddress('delivery', newAddress);
      setFormAddress(emptyAddress);
      setNewAddressMode(false);
    }
  };

  const handleUpdateAddress = (index: number) => {
    if (formAddress.city && formAddress.country) {
      const parts = [
        formAddress.houseNumber,
        formAddress.street,
        formAddress.block,
        formAddress.sector,
        formAddress.society,
        formAddress.landmark,
        formAddress.city,
        formAddress.province,
        formAddress.country,
        formAddress.postalCode,
      ].filter(Boolean);

      const concatenated = parts.join(', ');

      const updatedAddress: Address = {
        ...formAddress,
        concatenatedAddress: concatenated,
      };

      updateAddress('delivery', index, updatedAddress);
      setFormAddress(emptyAddress);
      setEditingAddressIndex(null);
    }
  };

  const handleRemoveAddress = (index: number) => {
    removeAddress('delivery', index);
    if (expandedAddressIndex === index) {
      setExpandedAddressIndex(index > 0 ? index - 1 : null);
    }
  };

  const deliveryAddresses = data.deliveryAddresses || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Delivery Addresses Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
            Delivery Address
          </Typography>
          {!newAddressMode && editingAddressIndex === null && (
            <Button
              size="small"
              startIcon={<MdAdd />}
              onClick={() => {
                setNewAddressMode(true);
                setFormAddress(emptyAddress);
              }}
              sx={{ color: 'var(--color-primary-600)' }}
            >
              Add More Address
            </Button>
          )}
        </Box>

        {/* Existing Addresses */}
        {deliveryAddresses.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {deliveryAddresses.map((address, index) => (
              <Card
                key={index}
                sx={{
                  p: 2,
                  backgroundColor: expandedAddressIndex === index ? '#f0f9ff' : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: expandedAddressIndex === index ? 2 : 0,
                  }}
                  onClick={() => {
                    if (editingAddressIndex === null && !newAddressMode) {
                      setExpandedAddressIndex(expandedAddressIndex === index ? null : index);
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {address.title || `Address ${index + 1}`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {address.concatenatedAddress?.substring(0, 60)}...
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {editingAddressIndex !== index && (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddressIndex(index);
                            setFormAddress(address);
                          }}
                        >
                          <MdEdit size={18} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAddress(index);
                          }}
                        >
                          <MdDelete size={18} style={{ color: '#ef4444' }} />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>

                <Collapse in={expandedAddressIndex === index || editingAddressIndex === index}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <CustomInput
                        label="Address Title *"
                        placeholder="e.g., My Office, My Home"
                        value={formAddress.title ?? ''}
                        onChange={(e) => handleAddressChange('title', e.target.value)}
                      />
                      <CustomInput
                        label="House / Flat / Building Number *"
                        placeholder="e.g., 123"
                        value={formAddress.houseNumber ?? ''}
                        onChange={(e) => handleAddressChange('houseNumber', e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <CustomInput
                        label="Street: Name or Number *"
                        placeholder="e.g., Main Street"
                        value={formAddress.street ?? ''}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                      />
                      <CustomInput
                        label="Block: Name or Number"
                        placeholder="e.g., Block A"
                        value={formAddress.block ?? ''}
                        onChange={(e) => handleAddressChange('block', e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <CustomInput
                        label="Sector / Phase: Name or Number"
                        placeholder="e.g., Sector 5"
                        value={formAddress.sector ?? ''}
                        onChange={(e) => handleAddressChange('sector', e.target.value)}
                      />
                      <CustomInput
                        label="Society / Town / Community *"
                        placeholder="e.g., Defense Housing Authority"
                        value={formAddress.society ?? ''}
                        onChange={(e) => handleAddressChange('society', e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <CustomInput
                        label="Any Nearby Landmarks"
                        placeholder="e.g., Near Park, Close to Market"
                        value={formAddress.landmark ?? ''}
                        onChange={(e) => handleAddressChange('landmark', e.target.value)}
                      />
                      <CustomInput
                        label="City *"
                        placeholder="e.g., Karachi"
                        value={formAddress.city ?? ''}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <CustomInput
                        label="Province / State *"
                        placeholder="e.g., Sindh"
                        value={formAddress.province ?? ''}
                        onChange={(e) => handleAddressChange('province', e.target.value)}
                      />
                      <CustomInput
                        label="Country *"
                        placeholder="e.g., Pakistan"
                        value={formAddress.country ?? ''}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                      />
                    </Box>

                    <CustomInput
                      label="Postal / ZIP Code"
                      placeholder="e.g., 75500"
                      value={formAddress.postalCode ?? ''}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    />

                    <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#991b1b' }}>
                        Concatenated Address:
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#7f1d1d', mt: 0.5 }}>
                        {[
                          formAddress.houseNumber,
                          formAddress.street,
                          formAddress.block,
                          formAddress.sector,
                          formAddress.society,
                          formAddress.landmark,
                          formAddress.city,
                          formAddress.province,
                          formAddress.country,
                          formAddress.postalCode,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          if (editingAddressIndex !== null) {
                            setEditingAddressIndex(null);
                          } else {
                            setNewAddressMode(false);
                          }
                          setFormAddress(emptyAddress);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          if (editingAddressIndex !== null) {
                            handleUpdateAddress(editingAddressIndex);
                          } else {
                            handleAddNewAddress();
                          }
                        }}
                      >
                        {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Card>
            ))}
          </Box>
        )}

        {/* New Address Form */}
        {newAddressMode && (
          <Card sx={{ p: 2, backgroundColor: '#f0f9ff', border: '2px solid var(--color-primary-600)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
              Add New Delivery Address
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <CustomInput
                  label="Address Title *"
                  placeholder="e.g., My Office, My Home"
                  value={formAddress.title ?? ''}
                  onChange={(e) => handleAddressChange('title', e.target.value)}
                />
                <CustomInput
                  label="House / Flat / Building Number *"
                  placeholder="e.g., 123"
                  value={formAddress.houseNumber ?? ''}
                  onChange={(e) => handleAddressChange('houseNumber', e.target.value)}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <CustomInput
                  label="Street: Name or Number *"
                  placeholder="e.g., Main Street"
                  value={formAddress.street ?? ''}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                />
                <CustomInput
                  label="Block: Name or Number"
                  placeholder="e.g., Block A"
                  value={formAddress.block ?? ''}
                  onChange={(e) => handleAddressChange('block', e.target.value)}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <CustomInput
                  label="Sector / Phase: Name or Number"
                  placeholder="e.g., Sector 5"
                  value={formAddress.sector ?? ''}
                  onChange={(e) => handleAddressChange('sector', e.target.value)}
                />
                <CustomInput
                  label="Society / Town / Community *"
                  placeholder="e.g., Defense Housing Authority"
                  value={formAddress.society ?? ''}
                  onChange={(e) => handleAddressChange('society', e.target.value)}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <CustomInput
                  label="Any Nearby Landmarks"
                  placeholder="e.g., Near Park, Close to Market"
                  value={formAddress.landmark ?? ''}
                  onChange={(e) => handleAddressChange('landmark', e.target.value)}
                />
                <CustomInput
                  label="City *"
                  placeholder="e.g., Karachi"
                  value={formAddress.city ?? ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <CustomInput
                  label="Province / State *"
                  placeholder="e.g., Sindh"
                  value={formAddress.province ?? ''}
                  onChange={(e) => handleAddressChange('province', e.target.value)}
                />
                <CustomInput
                  label="Country *"
                  placeholder="e.g., Pakistan"
                  value={formAddress.country ?? ''}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                />
              </Box>

              <CustomInput
                label="Postal / ZIP Code"
                placeholder="e.g., 75500"
                value={formAddress.postalCode ?? ''}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
              />

              <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#991b1b' }}>
                  Concatenated Address:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#7f1d1d', mt: 0.5 }}>
                  {[
                    formAddress.houseNumber,
                    formAddress.street,
                    formAddress.block,
                    formAddress.sector,
                    formAddress.society,
                    formAddress.landmark,
                    formAddress.city,
                    formAddress.province,
                    formAddress.country,
                    formAddress.postalCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setNewAddressMode(false);
                    setFormAddress(emptyAddress);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddNewAddress}
                >
                  Save Address
                </Button>
              </Box>
            </Box>
          </Card>
        )}
      </Box>

      {/* Billing Address Option */}
      {deliveryAddresses.length > 0 && (
        <Box>
          <Card sx={{ p: 2, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={sameAsBilling}
                  onChange={(e) => {
                    setSameAsBilling(e.target.checked);
                    updateFormData('sameAsBillingAddress', e.target.checked);
                  }}
                />
              }
              label="Billing Address is the same as Delivery Address"
            />
          </Card>
        </Box>
      )}

      {/* Note */}
      {deliveryAddresses.length === 0 && (
        <Box sx={{ p: 2, backgroundColor: '#fef3c7', borderRadius: 1, border: '1px solid #fde68a' }}>
          <Typography variant="caption" sx={{ color: '#92400e' }}>
            Please add at least one delivery address to continue.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
