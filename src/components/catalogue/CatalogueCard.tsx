import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { MdEdit, MdVisibility, MdToggleOff, MdToggleOn, MdDelete } from 'react-icons/md';
import { theme } from '../../theme/colors';
import type { CatalogueItem } from '../../types/catalogue';
import WaterInn from '../../assets/waterinn.png';

interface CatalogueCardProps {
  item: CatalogueItem;
  onView: (item: CatalogueItem) => void;
  onEdit: (item: CatalogueItem) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CatalogueCard: React.FC<CatalogueCardProps> = ({
  item,
  onView,
  onEdit,
  onToggle,
  onDelete,
}) => {
  const isActive = item.status === 'active';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Sale Ribbon */}
      {item.markSale && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: -25,
            backgroundColor: theme.colors.danger[600],
            color: 'white',
            padding: '6px 40px',
            transform: 'rotate(-12deg)',
            fontSize: '0.75rem',
            fontWeight: 700,
            zIndex: 10,
            boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
          }}
        >
          SALE
        </Box>
      )}

      {/* Image */}
      <CardMedia
        component="img"
        height="200"
        image={item.mainImage || WaterInn}
        alt={item.name}
        onError={(e: any) => {
          e.target.src =
            'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%23f5f7fa/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%23cbd5e1%22 font-family=%22Arial%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22%3ENO IMAGE%3C/text%3E%3C/svg%3E';
        }}
        sx={{ objectFit: 'cover' }}
      />

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#0f172a' }}>
          {item.name}
        </Typography>

        {item.subHeading && (
          <Typography variant="caption" sx={{ color: theme.colors.text300, display: 'block', mb: 1 }}>
            {item.subHeading}
          </Typography>
        )}

        <Typography variant="caption" sx={{ color: theme.colors.text300, display: 'block', mb: 1.5 }}>
          {item.category}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}
        >
          {Number(item.salePrice || item.sellingPrice).toLocaleString()} PKR
        </Typography>

        {/* Status & Actions */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              backgroundColor: isActive ? '#ecfdf5' : '#f1f5f9',
              color: isActive ? '#065f46' : '#475569',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          <div>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => onView(item)}>
                <MdVisibility size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(item)}>
                <MdEdit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isActive ? 'Disable' : 'Enable'}>
              <IconButton size="small" onClick={() => onToggle(item.id)}>
                {isActive ? (
                  <MdToggleOn size={16} color={theme.colors.success[600]} />
                ) : (
                  <MdToggleOff size={16} color={theme.colors.text300} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(item.id)}>
                <MdDelete size={16} color={theme.colors.danger[600]} />
              </IconButton>
            </Tooltip>
          </div>
        </Stack>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {item.tags.slice(0, 2).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
            {item.tags.length > 2 && <Chip label={`+${item.tags.length - 2}`} size="small" variant="outlined" />}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
