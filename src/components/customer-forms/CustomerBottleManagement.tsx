import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { CustomInput } from "../common/CustomInput";
import { useCustomerForm } from "../../contexts/CustomerFormContext";
import { useTheme } from "../../contexts/ThemeContext";

export const CustomerBottleManagement = () => {
  const { state, updateFormData, fieldErrors } = useCustomerForm();
  const { colors } = useTheme();
  const data = state.data as any;
  const security = data?.security || {};

  // Auto-calculate security amount when numberOfBottles or securityPerBottle changes
  useEffect(() => {
    const numberOfBottles = parseFloat(security.numberOfBottles) || 0;
    const securityPerBottle = parseFloat(security.securityPerBottle) || 0;
    const calculatedSecurityAmount = numberOfBottles * securityPerBottle;
    
    if (calculatedSecurityAmount !== (parseFloat(security.securityAmount) || 0)) {
      updateFormData('security.securityAmount', calculatedSecurityAmount);
    }
  }, [security.numberOfBottles, security.securityPerBottle, security.securityAmount, updateFormData]);

  const handleInputChange = (field: string, value: string) => {
    // Convert to number for numeric fields, keep as string for display
    const numericValue = value === '' ? null : parseFloat(value);
    updateFormData(`security.${field}`, numericValue);
  };

  const formatNumber = (value: any) => {
    if (value === null || value === undefined || value === '') return '';
    return value.toString();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Required Information */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}
        >
          Required Information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Number of Bottles"
              type="number"
              value={formatNumber(security.numberOfBottles)}
              onChange={(e) => handleInputChange('numberOfBottles', e.target.value)}
              error={fieldErrors['security.numberOfBottles']}
              placeholder="Enter number of bottles"
              required
            />
            <CustomInput
              label="Security Per Bottle (PKR)"
              type="number"
              value={formatNumber(security.securityPerBottle)}
              onChange={(e) => handleInputChange('securityPerBottle', e.target.value)}
              error={fieldErrors['security.securityPerBottle']}
              placeholder="Enter security amount per bottle"
              required
            />
          </Box>
        </Box>
      </Box>

      {/* Security & Payment Details */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}
        >
          Security & Payment Details
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <CustomInput
                label="Total Security Amount (PKR)"
                type="number"
                value={formatNumber(security.securityAmount)}
                onChange={(e) => handleInputChange('securityAmount', e.target.value)}
                error={fieldErrors['security.securityAmount']}
                placeholder="Auto-calculated or enter manually"
                disabled={!!(security.numberOfBottles && security.securityPerBottle)}
              />
              {security.numberOfBottles && security.securityPerBottle && (
                <Typography 
                  variant="caption" 
                  sx={{ color: colors.text.secondary, mt: 0.5, display: 'block' }}
                >
                  Auto-calculated: {security.numberOfBottles} × {security.securityPerBottle} = {security.securityAmount || 0} PKR
                </Typography>
              )}
            </Box>
            <CustomInput
              label="Advance Payment (PKR)"
              type="number"
              value={formatNumber(security.advancePayment)}
              onChange={(e) => handleInputChange('advancePayment', e.target.value)}
              error={fieldErrors['security.advancePayment']}
              placeholder="Enter advance payment amount"
            />
          </Box>
        </Box>
      </Box>

      {/* Bottle Return Management */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}
        >
          Bottle Return Management
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Empty Bottles Without Security"
              type="number"
              value={formatNumber(security.emptyWithoutSecurity)}
              onChange={(e) => handleInputChange('emptyWithoutSecurity', e.target.value)}
              error={fieldErrors['security.emptyWithoutSecurity']}
              placeholder="Enter number of empty bottles"
            />
            <CustomInput
              label="Empty Received Without Security"
              type="number"
              value={formatNumber(security.emptyReceivedWithoutSecurity)}
              onChange={(e) => handleInputChange('emptyReceivedWithoutSecurity', e.target.value)}
              error={fieldErrors['security.emptyReceivedWithoutSecurity']}
              placeholder="Enter number received"
            />
          </Box>
          
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CustomInput
              label="Bottles Return"
              type="number"
              value={formatNumber(security.bottlesReturn)}
              onChange={(e) => handleInputChange('bottlesReturn', e.target.value)}
              error={fieldErrors['security.bottlesReturn']}
              placeholder="Enter bottles returned"
            />
            <CustomInput
              label="Refund Bottles Security (PKR)"
              type="number"
              value={formatNumber(security.refundBottlesSecurity)}
              onChange={(e) => handleInputChange('refundBottlesSecurity', e.target.value)}
              error={fieldErrors['security.refundBottlesSecurity']}
              placeholder="Enter refund amount"
            />
          </Box>
        </Box>
      </Box>

      {/* Summary */}
      {(security.numberOfBottles || security.securityAmount || security.advancePayment) && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}
          >
            Summary
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 2,
              p: 2,
              backgroundColor: colors.background.secondary,
              borderRadius: 1,
              border: `1px solid ${colors.border.primary}`,
            }}
          >
            {security.numberOfBottles && (
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Total Bottles: <strong>{security.numberOfBottles}</strong>
              </Typography>
            )}
            {security.securityAmount && (
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Security Amount: <strong>PKR {security.securityAmount}</strong>
              </Typography>
            )}
            {security.advancePayment && (
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Advance Payment: <strong>PKR {security.advancePayment}</strong>
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};