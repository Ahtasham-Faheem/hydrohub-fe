import { Box, Typography, Card, CardContent } from '@mui/material';
import { LuBuilding2, LuFactory } from 'react-icons/lu';
import { GoHome } from "react-icons/go";

import type { CustomerType } from '../../types/customer';

interface CustomerTypeSelectionProps {
  onSelectType: (type: CustomerType) => void;
}

export const CustomerTypeSelection = ({ onSelectType }: CustomerTypeSelectionProps) => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
          Choose Customer Type
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 600, mx: 'auto' }}>
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
              border: '2px solid #e5e7eb',
              borderRadius: 2,
              '&:hover': {
                borderColor: 'var(--color-primary-600)',
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
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
                  bgcolor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-600)',
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
                  color: '#1f2937' 
                }}
              >
                {customerType.title}
              </Typography>

              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
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
                        bgcolor: 'var(--color-primary-600)',
                        flexShrink: 0,
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#4b5563',
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
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--color-primary-600)',
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
        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
          You can change the customer type later if needed. Click on any card above to continue.
        </Typography>
      </Box>
    </Box>
  );
};