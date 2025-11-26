import { Box, Typography, Card, Button, IconButton, Collapse } from '@mui/material';
import { CustomInput } from '../CustomInput';
import { useCustomerForm } from '../../contexts/CustomerFormContext';
import type { DomesticCustomer, Referral } from '../../types/customer';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import dayjs from 'dayjs';

export const DomesticStep7Referral = () => {
  const { state, updateFormData } = useCustomerForm();
  const data = state.data as DomesticCustomer;
  const referrals = data.referrals || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newReferralMode, setNewReferralMode] = useState(false);
  const [formReferral, setFormReferral] = useState<Referral>({
    referrerCustomerId: '',
    remarks: '',
    createdDate: dayjs().toISOString(),
    status: 'active',
  });

  const emptyReferral: Referral = {
    referrerCustomerId: '',
    remarks: '',
    createdDate: dayjs().toISOString(),
    status: 'active',
  };

  const handleReferralChange = (field: keyof Referral, value: any) => {
    setFormReferral((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddNewReferral = () => {
    if (formReferral.referrerCustomerId) {
      const newReferrals = [...referrals, { ...formReferral, id: `ref_${Date.now()}` }];
      updateFormData('referrals', newReferrals);
      setFormReferral(emptyReferral);
      setNewReferralMode(false);
    }
  };

  const handleUpdateReferral = (index: number) => {
    if (formReferral.referrerCustomerId) {
      const updatedReferrals = [...referrals];
      updatedReferrals[index] = formReferral;
      updateFormData('referrals', updatedReferrals);
      setFormReferral(emptyReferral);
      setEditingIndex(null);
    }
  };

  const handleRemoveReferral = (index: number) => {
    const updatedReferrals = referrals.filter((_: any, i: number) => i !== index);
    updateFormData('referrals', updatedReferrals);
    if (expandedIndex === index) {
      setExpandedIndex(index > 0 ? index - 1 : null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
          Referral Information
        </Typography>
        {!newReferralMode && editingIndex === null && (
          <Button
            size="small"
            startIcon={<MdAdd />}
            onClick={() => {
              setNewReferralMode(true);
              setFormReferral(emptyReferral);
            }}
            sx={{ color: 'var(--color-primary-600)' }}
          >
            Add Reference
          </Button>
        )}
      </Box>

      {/* Existing Referrals */}
      {referrals.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {referrals.map((referral: Referral, index: number) => (
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
                  if (editingIndex === null && !newReferralMode) {
                    setExpandedIndex(expandedIndex === index ? null : index);
                  }
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Referred by: {referral.referrerCustomerId}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    Created: {dayjs(referral.createdDate).format('MMM DD, YYYY')} • Status: {referral.status}
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
                          setFormReferral(referral);
                        }}
                      >
                        <MdEdit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveReferral(index);
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
                      label="Referrer Customer ID *"
                      placeholder="Enter customer ID of the referrer"
                      value={formReferral.referrerCustomerId ?? ''}
                      onChange={(e) => handleReferralChange('referrerCustomerId', e.target.value)}
                    />
                    <CustomInput
                      label="Status"
                      value={formReferral.status ?? 'active'}
                      disabled
                    />
                  </Box>

                  <CustomInput
                    label="Comments / Remarks"
                    placeholder="Any additional notes about the referral"
                    value={formReferral.remarks ?? ''}
                    onChange={(e) => handleReferralChange('remarks', e.target.value)}
                    multiline
                    rows={3}
                  />

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (editingIndex !== null) {
                          setEditingIndex(null);
                        } else {
                          setNewReferralMode(false);
                        }
                        setFormReferral(emptyReferral);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        if (editingIndex !== null) {
                          handleUpdateReferral(editingIndex);
                        } else {
                          handleAddNewReferral();
                        }
                      }}
                    >
                      {editingIndex !== null ? 'Update Referral' : 'Save Referral'}
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Box>
      )}

      {/* New Referral Form */}
      {newReferralMode && (
        <Card sx={{ p: 2.5, backgroundColor: '#f0f9ff', border: '2px solid var(--color-primary-600)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Add New Referral
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomInput
              label="Referrer Customer ID *"
              placeholder="Enter customer ID of the referrer"
              value={formReferral.referrerCustomerId ?? ''}
              onChange={(e) => handleReferralChange('referrerCustomerId', e.target.value)}
            />

            <CustomInput
              label="Comments / Remarks"
              placeholder="Any additional notes about the referral"
              value={formReferral.remarks ?? ''}
              onChange={(e) => handleReferralChange('remarks', e.target.value)}
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setNewReferralMode(false);
                  setFormReferral(emptyReferral);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleAddNewReferral}
              >
                Save Referral
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* Info Card */}
      <Card sx={{ p: 2.5, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e40af', display: 'block', mb: 1 }}>
          ℹ️ How Referrals Work:
        </Typography>
        <Typography variant="caption" sx={{ color: '#1e3a8a', display: 'block', lineHeight: 1.6 }}>
          If this customer was referred by another existing customer, record that referral here. This helps track customer acquisition and referral rewards.
        </Typography>
      </Card>
    </Box>
  );
};
