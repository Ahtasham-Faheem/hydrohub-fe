import { Box, Typography, Card, Button, IconButton, Collapse } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { FileUploadField } from '../FileUploadField';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer, LinkedAccount } from '../../types/customer';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';

export const DomesticStep6LinkedAccounts = () => {
  const { state, addLinkedAccount, removeLinkedAccount, updateLinkedAccount } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newAccountMode, setNewAccountMode] = useState(false);
  const [formAccount, setFormAccount] = useState<LinkedAccount>({
    title: '',
    contactNumber: '',
    visibility: 'private',
    status: 'active',
    authorizedAddress: '',
  });

  const linkedAccounts = data.linkedAccounts || [];

  const handleAccountChange = (field: keyof LinkedAccount, value: any) => {
    setFormAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const emptyAccount: LinkedAccount = {
    title: '',
    contactNumber: '',
    visibility: 'private',
    status: 'active',
    authorizedAddress: '',
  };

  const handleAddNewAccount = () => {
    if (formAccount.title && formAccount.contactNumber) {
      addLinkedAccount(formAccount);
      setFormAccount(emptyAccount);
      setNewAccountMode(false);
    }
  };

  const handleUpdateAccount = (index: number) => {
    if (formAccount.title && formAccount.contactNumber) {
      updateLinkedAccount(index, formAccount);
      setFormAccount(emptyAccount);
      setEditingIndex(null);
    }
  };

  const handleRemoveAccount = (index: number) => {
    removeLinkedAccount(index);
    if (expandedIndex === index) {
      setExpandedIndex(index > 0 ? index - 1 : null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
          Linked Accounts / Family Members
        </Typography>
        {!newAccountMode && editingIndex === null && (
          <Button
            size="small"
            startIcon={<MdAdd />}
            onClick={() => {
              setNewAccountMode(true);
              setFormAccount(emptyAccount);
            }}
            sx={{ color: 'var(--color-primary-600)' }}
          >
            Add Link Account
          </Button>
        )}
      </Box>

      {/* Existing Accounts */}
      {linkedAccounts.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {linkedAccounts.map((account, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                backgroundColor: expandedIndex === index ? '#f0f9ff' : '#f9fafb',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => {
                  if (editingIndex === null && !newAccountMode) {
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {account.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    {account.contactNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {editingIndex !== index && (
                    <>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingIndex(index);
                          setFormAccount(account);
                        }}
                      >
                        <MdEdit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAccount(index);
                        }}
                      >
                        <MdDelete size={18} style={{ color: '#ef4444' }} />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>

              <Collapse in={expandedIndex === index || editingIndex === index}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <CustomInput
                      label="Linked Account Title *"
                      placeholder="e.g., Father, Mother, Son"
                      value={formAccount.title ?? ''}
                      onChange={(e) => handleAccountChange('title', e.target.value)}
                    />
                    <CustomInput
                      label="Contact Number *"
                      placeholder="Enter contact number"
                      value={formAccount.contactNumber ?? ''}
                      onChange={(e) => handleAccountChange('contactNumber', e.target.value)}
                    />
                  </Box>

                  <FileUploadField
                    label="Profile Picture (Optional)"
                    onFileChange={(file) => {
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleAccountChange('photo', reader.result);
                        };
                        reader.readAsDataURL(file as File);
                      }
                    }}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <CustomSelect
                      label="Account Visibility *"
                      value={formAccount.visibility ?? 'private'}
                      onChange={(e) => handleAccountChange('visibility', e.target.value)}
                      options={[
                        { label: 'Public', value: 'public' },
                        { label: 'Private', value: 'private' },
                      ]}
                    />
                    <CustomSelect
                      label="Account Status *"
                      value={formAccount.status ?? 'active'}
                      onChange={(e) => handleAccountChange('status', e.target.value)}
                      options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Left', value: 'left' },
                      ]}
                    />
                  </Box>

                  <CustomInput
                    label="Authorized Address *"
                    placeholder="Address where this account is authorized to receive deliveries"
                    value={formAccount.authorizedAddress ?? ''}
                    onChange={(e) => handleAccountChange('authorizedAddress', e.target.value)}
                  />

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (editingIndex !== null) {
                          setEditingIndex(null);
                        } else {
                          setNewAccountMode(false);
                        }
                        setFormAccount(emptyAccount);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        if (editingIndex !== null) {
                          handleUpdateAccount(editingIndex);
                        } else {
                          handleAddNewAccount();
                        }
                      }}
                    >
                      {editingIndex !== null ? 'Update Account' : 'Save Account'}
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Box>
      )}

      {/* New Account Form */}
      {newAccountMode && (
        <Card sx={{ p: 2.5, backgroundColor: '#f0f9ff', border: '2px solid var(--color-primary-600)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Add New Linked Account
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <CustomInput
                label="Linked Account Title *"
                placeholder="e.g., Father, Mother, Son"
                value={formAccount.title ?? ''}
                onChange={(e) => handleAccountChange('title', e.target.value)}
              />
              <CustomInput
                label="Contact Number *"
                placeholder="Enter contact number"
                value={formAccount.contactNumber ?? ''}
                onChange={(e) => handleAccountChange('contactNumber', e.target.value)}
              />
            </Box>

            <FileUploadField
              label="Profile Picture (Optional)"
              onFileChange={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleAccountChange('photo', reader.result);
                  };
                  reader.readAsDataURL(file as File);
                }
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <CustomSelect
                label="Account Visibility *"
                value={formAccount.visibility ?? 'private'}
                onChange={(e) => handleAccountChange('visibility', e.target.value)}
                options={[
                  { label: 'Public', value: 'public' },
                  { label: 'Private', value: 'private' },
                ]}
              />
              <CustomSelect
                label="Account Status *"
                value={formAccount.status ?? 'active'}
                onChange={(e) => handleAccountChange('status', e.target.value)}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Left', value: 'left' },
                ]}
              />
            </Box>

            <CustomInput
              label="Authorized Address *"
              placeholder="Address where this account is authorized to receive deliveries"
              value={formAccount.authorizedAddress ?? ''}
              onChange={(e) => handleAccountChange('authorizedAddress', e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setNewAccountMode(false);
                  setFormAccount(emptyAccount);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleAddNewAccount}
              >
                Save Account
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* Info Card */}
      {linkedAccounts.length === 0 && !newAccountMode && (
        <Card sx={{ p: 2, backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
          <Typography variant="caption" sx={{ color: '#92400e' }}>
            Linked accounts allow family members or authorized persons to also receive deliveries on behalf of the main customer.
          </Typography>
        </Card>
      )}
    </Box>
  );
};
