import { Box, Typography, Card, Button, IconButton, Collapse, Alert, CircularProgress } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { FileUploadField } from '../FileUploadField';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer, LinkedAccount } from '../../types/customer';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useGetLinkedAccounts, useCreateLinkedAccount, useUpdateLinkedAccount, useDeleteLinkedAccount } from '../../hooks/useLinkedAccounts';
import { assetsService } from '../../services/api';
import type { CreateLinkedAccountData, LinkedAccountResponse } from '../../services/api';

interface DomesticStep6LinkedAccountsProps {
  customerProfileId?: string;
}

export const DomesticStep6LinkedAccounts = ({ customerProfileId }: DomesticStep6LinkedAccountsProps) => {
  const { state, addLinkedAccount, removeLinkedAccount, updateLinkedAccount } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newAccountMode, setNewAccountMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadedAccounts, setLoadedAccounts] = useState<(LinkedAccountResponse & { localId?: string })[]>([]);
  // API hooks
  const { data: accountsData, isLoading: isLoadingAccounts } = useGetLinkedAccounts(customerProfileId);
  const createAccountMutation = useCreateLinkedAccount();
  const updateAccountMutation = useUpdateLinkedAccount();
  const deleteAccountMutation = useDeleteLinkedAccount();

  useEffect(() => {
    if (accountsData?.data) {
      setLoadedAccounts(accountsData.data);
    }
  }, [accountsData]);

  const emptyAccount: LinkedAccount = {
    title: '',
    contactNumber: '',
    visibility: 'private',
    status: 'active',
    authorizedAddress: '',
  };

  const [formAccount, setFormAccount] = useState<LinkedAccount>(emptyAccount);

  const handleAccountChange = (field: keyof LinkedAccount, value: any) => {
    setFormAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const mapToApiPayload = (account: LinkedAccount): CreateLinkedAccountData => {
    // Map visibility and status to capitalized values for API
    const visibilityMap: { [key: string]: string } = {
      'public': 'Public',
      'private': 'Private',
    };

    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive',
      'pending': 'Pending',
      'left': 'Left',
    };

    return {
      linkedAccountTitle: account.title,
      parentProfilePicture: account.photo,
      contactNo: account.contactNumber,
      accountVisibilityLevel: visibilityMap[account.visibility] || account.visibility,
      accountStatus: statusMap[account.status] || account.status,
      authorizedAddressId: account.authorizedAddressId,
    };
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const response = await assetsService.uploadFile(file);
      return response.fileUrl;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload photo';
      setApiError(errorMessage);
      return null;
    }
  };

  const handleAddNewAccount = async () => {
    if (formAccount.title && formAccount.contactNumber) {
      if (!customerProfileId) {
        setApiError('Customer profile not initialized. Please try again.');
        return;
      }

      try {
        setApiError(null);
        const apiPayload = mapToApiPayload(formAccount);
        
        await createAccountMutation.mutateAsync({
          customerProfileId,
          accountData: apiPayload,
        });

        addLinkedAccount(formAccount);
        setFormAccount(emptyAccount);
        setNewAccountMode(false);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create linked account';
        setApiError(errorMessage);
      }
    }
  };

  const handleUpdateAccount = async (index: number) => {
    if (formAccount.title && formAccount.contactNumber) {
      if (!customerProfileId) {
        setApiError('Customer profile not initialized. Please try again.');
        return;
      }

      try {
        setApiError(null);
        const accountToUpdate = loadedAccounts[index];
        
        if (accountToUpdate?.id) {
          const apiPayload = mapToApiPayload(formAccount);
          
          await updateAccountMutation.mutateAsync({
            customerProfileId,
            accountId: accountToUpdate.id,
            accountData: apiPayload,
          });
        }

        updateLinkedAccount(index, formAccount);
        setFormAccount(emptyAccount);
        setEditingIndex(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update linked account';
        setApiError(errorMessage);
      }
    }
  };

  const handleRemoveAccount = async (index: number) => {
    if (!customerProfileId) {
      setApiError('Customer profile not initialized. Please try again.');
      return;
    }

    try {
      setApiError(null);
      const accountToDelete = loadedAccounts[index];
      
      if (accountToDelete?.id) {
        await deleteAccountMutation.mutateAsync({
          customerProfileId,
          accountId: accountToDelete.id,
        });
      }

      removeLinkedAccount(index);
      if (expandedIndex === index) {
        setExpandedIndex(index > 0 ? index - 1 : null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete linked account';
      setApiError(errorMessage);
    }
  };

  const linkedAccounts = data.linkedAccounts || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Error Alert */}
      {apiError && (
        <Alert severity="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      {/* Loading State */}
      {isLoadingAccounts && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={40} />
        </Box>
      )}

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
            Add Account
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
                      label="Account Title *"
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
                    onFileChange={async (file) => {
                      if (file) {
                        const photoUrl = await handlePhotoUpload(file as File);
                        if (photoUrl) {
                          handleAccountChange('photo', photoUrl);
                        }
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
                label="Account Title *"
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
              onFileChange={async (file) => {
                if (file) {
                  const photoUrl = await handlePhotoUpload(file as File);
                  if (photoUrl) {
                    handleAccountChange('photo', photoUrl);
                  }
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
