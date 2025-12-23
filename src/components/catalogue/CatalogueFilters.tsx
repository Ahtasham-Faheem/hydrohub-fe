import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
} from '@mui/material';
import type { CatalogueFilterParams } from '../../types/catalogue';
import type { Category, Collection } from '../../types/catalogue';
import { CustomInput } from '../common/CustomInput';
import { CustomSelect } from '../common/CustomSelect';
import { useTheme } from '../../contexts/ThemeContext';

interface CatalogueFiltersProps {
  onFiltersChange: (filters: CatalogueFilterParams) => void;
  categories: Category[];
  collections: Collection[];
  itemCount: number;
}

export const CatalogueFilters: React.FC<CatalogueFiltersProps> = ({
  onFiltersChange,
  categories,
  collections,
  itemCount,
}) => {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [collection, setCollection] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ search, collection, status, category });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, collection, status, category, onFiltersChange]);

  return (
    <Card
      sx={{
        p: 2.5,
        mb: 3,
        boxShadow: colors.shadow.md,
        border: `1px solid ${colors.border.primary}`,
        backgroundColor: colors.background.card,
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
        <CustomInput
          fullWidth
          size="small"
          label="Search"
          placeholder="Search by name, SKU, barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CustomSelect
          fullWidth
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />

          <CustomSelect
            fullWidth
            size="small"
            label="Collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            options={[
              { label: "All Collections", value: "" },
              ...collections.map((col) => ({ label: col.name, value: col.id })),
            ]}
          />

        <CustomSelect
          fullWidth
          size="small"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { label: "All Categories", value: "" },
            ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
          ]}
        />

        <Typography variant="caption" sx={{ color: colors.text.tertiary, whiteSpace: 'nowrap' }}>
          Results: <strong>{itemCount}</strong>
        </Typography>
      </Box>
    </Card>
  );
};
