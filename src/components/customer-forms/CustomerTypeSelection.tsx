import { Box, Typography, Card, CardContent } from '@mui/material';
import { LuBuilding2, LuFactory } from 'react-icons/lu';
import { GoHome } from "react-icons/go";
import { useTheme } from '../../contexts/ThemeContext';

import type { CustomerType } from '../../types/customer';

interface CustomerTypeSelectionProps {
  onSelectType: (type: CustomerType) => void;
}

export const CustomerTypeSelection = ({ onSelectType }: CustomerTypeSelectionProps) => {
  const { colors } = useTheme();
  
  const customerTypes = [
    {
      type: 'Domestic Customer' as CustomerType,
      title: 'Domestic Customer',
      description: 'Individual households and residential customers',
      icon: <GoHome size={32} />,
      features: [
        'Home delivery service',
        'Flexible payment options',
        'Family account linking',
        'Residential pricing'
      ]
    },
    {
      type: 'Business Customer' as CustomerType,
      title: 'Business Customer',
      description: 'Small to medium businesses and offices',
      icon: <LuBuilding2 size={32} />,
      features: [
        'Office delivery service',
        'Bulk order discounts',
        'Invoice billing',
        'Business account management'
      ]
    },
    {
      type: 'Commercial Customer' as CustomerType,
      title: 'Commercial Customer',
      description: 'Large enterprises and commercial establishments',
      icon: <LuFactory size={32} />,
      features: [
        'High-volume supply',
        'Custom delivery schedules',
        'Dedicated account manager',
        'Enterprise pricing'
      ]
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 4, 
      p: 4,
      backgroundColor: colors.background.primary,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          mb: 2, 
          color: colors.text.primary 
        }}>
          Choose Customer Type
        </Typography>
        <Typography variant="body1" sx={{ 
          color: colors.text.secondary, 
          maxWidth: 600, 
          mx: 'auto' 
        }}>
          Select the type of customer account you want to create. Each type has different features and pricing options tailored to specific needs.
        </Typography>
      </Box>

      {/* Customer Type Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
        gap: 3,
        maxWidth: 1200,
        mx: 'auto',
        width: '100%'
      }}>
        {customerTypes.map((customerType) => (
          <Card
            key={customerType.type}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: `2px solid ${colors.border.primary}`,
              borderRadius: 2,
              backgroundColor: colors.background.card,
              '&:hover': {
                borderColor: colors.primary[600],
                transform: 'translateY(-4px)',
                boxShadow: colors.shadow.lg,
              },
              '&:active': {
                transform: 'translateY(-2px)',
              }
            }}
            onClick={() => onSelectType(customerType.type)}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              {/* Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: colors.primary[50],
                  color: colors.primary[600],
                  mx: 'auto',
                  mb: 3,
                }}
              >
                {customerType.icon}
              </Box>

              {/* Title */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: colors.text.primary 
                }}
              >
                {customerType.title}
              </Typography>

              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.text.secondary, 
                  mb: 3,
                  lineHeight: 1.6
                }}
              >
                {customerType.description}
              </Typography>

              {/* Features */}
              <Box sx={{ textAlign: 'left' }}>
                {customerType.features.map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 1 
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: colors.primary[600],
                        flexShrink: 0,
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colors.text.secondary,
                        fontSize: '0.875rem'
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Select Button */}
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: `1px solid ${colors.border.primary}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.primary[600],
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Select This Type →
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Help Text */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="caption" sx={{ color: colors.text.tertiary }}>
          You can change the customer type later if needed. Click on any card above to continue.
        </Typography>
      </Box>
    </Box>
  );
};