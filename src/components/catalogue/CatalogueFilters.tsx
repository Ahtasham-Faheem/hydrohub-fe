import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { theme } from '../../theme/colors';
import type { CatalogueFilterParams } from '../../types/catalogue';

interface CatalogueFiltersProps {
  onFiltersChange: (filters: CatalogueFilterParams) => void;
  categories: string[];
  itemCount: number;
}

export const CatalogueFilters: React.FC<CatalogueFiltersProps> = ({
  onFiltersChange,
  categories,
  itemCount,
}) => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'product' | 'service'>('all');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ search, type, status, category });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, type, status, category, onFiltersChange]);

  return (
    <Card
      sx={{
        p: 2.5,
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: `1px solid ${theme.colors.primary[100]}`,
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, SKU, barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
        />

        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={(e) => setType(e.target.value as any)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="service">Service</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as any)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="caption" sx={{ color: theme.colors.text300, whiteSpace: 'nowrap' }}>
          Results: <strong>{itemCount}</strong>
        </Typography>
      </Box>
    </Card>
  );
};
