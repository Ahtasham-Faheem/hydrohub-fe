import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from '@mui/material';
import { MdClose, MdAdd } from 'react-icons/md';
import { theme } from '../../theme/colors';
import type { CatalogueItem } from '../../types/catalogue';

interface CatalogueFormProps {
  item?: CatalogueItem;
  categories: string[];
  collections: string[];
  onSave: (item: Omit<CatalogueItem, 'id' | 'updated'> | CatalogueItem) => void;
  onCancel: () => void;
  onAddCategory: (category: string) => void;
  onAddCollection: (collection: string) => void;
}

export const CatalogueForm: React.FC<CatalogueFormProps> = ({
  item,
  categories,
  collections,
  onSave,
  onCancel,
  onAddCategory,
  onAddCollection,
}) => {
  const [formData, setFormData] = useState<Partial<CatalogueItem>>(
    item || {
      type: 'product',
      status: 'active',
      costPrice: 0,
      sellingPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      salePrice: 0,
      markSale: false,
      stockManaged: false,
      openingStock: 0,
      stockIn: 0,
      stockOut: 0,
      currentStock: 0,
      tags: [],
      rating: 0,
      gallery: [],
      variants: [],
    }
  );

  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCollectionDialog, setNewCollectionDialog] = useState(false);
  const [newCollection, setNewCollection] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const gallery = [...(formData.gallery || [])];
        gallery.push(ev.target?.result as string);
        setFormData((prev) => ({
          ...prev,
          gallery,
          mainImage: gallery[0],
        }));
      };
      reader.readAsDataURL(file);
    });
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const gallery = (formData.gallery || []).filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      gallery,
      mainImage: gallery[0] || '',
    }));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const tags = [...(formData.tags || [])];
    if (!tags.includes(tagInput.trim())) {
      tags.push(tagInput.trim());
      setFormData((prev) => ({ ...prev, tags }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.sellingPrice || formData.sellingPrice <= 0) newErrors.sellingPrice = 'Valid selling price is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData as any);
  };

  const recalculateDiscount = (selling: number, sale: number) => {
    const discAmt = Math.max(0, Math.round((selling - sale) * 100) / 100);
    const discPct = selling ? Math.round((discAmt / selling) * 10000) / 100 : 0;
    return { discountAmount: discAmt, discountPercent: discPct };
  };

  const handleSellingPriceChange = (val: number) => {
    const sale = formData.salePrice || val;
    const { discountAmount, discountPercent } = recalculateDiscount(val, sale);
    setFormData((prev) => ({
      ...prev,
      sellingPrice: val,
      salePrice: sale,
      discountAmount,
      discountPercent,
    }));
  };

  const handleSalePriceChange = (val: number) => {
    const sell = formData.sellingPrice || 0;
    const { discountAmount, discountPercent } = recalculateDiscount(sell, val);
    setFormData((prev) => ({
      ...prev,
      salePrice: val,
      discountAmount,
      discountPercent,
    }));
  };

  const handleStockChange = () => {
    const open = Number(formData.openingStock || 0);
    const inAmt = Number(formData.stockIn || 0);
    const out = Number(formData.stockOut || 0);
    const current = Math.max(0, open + inAmt - out);
    setFormData((prev) => ({ ...prev, currentStock: current }));
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.colors.primary[100]}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {item ? 'Edit Catalogue Item' : 'Add New Catalogue Item'}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, gap: 3 }}>
          {/* Left: Image Gallery */}
          <Box sx={{ minWidth: { md: '250px' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
              Product Images
            </Typography>
            <Box
              sx={{
                border: `2px dashed ${theme.colors.primary[100]}`,
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                backgroundColor: theme.colors.primary[50],
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.colors.primary[600],
                  backgroundColor: theme.colors.primary[100],
                },
              }}
              onClick={() => galleryInputRef.current?.click()}
            >
              <MdAdd size={32} color={theme.colors.primary[600]} style={{ margin: '0 auto' }} />
              <Typography variant="caption" sx={{ display: 'block', color: theme.colors.text300, mt: 1 }}>
                Click to upload or drag images here
              </Typography>
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Box>

            {/* Gallery Preview */}
            {formData.gallery && formData.gallery.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                {formData.gallery.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: idx === 0 ? `2px solid ${theme.colors.success[600]}` : 'none',
                    }}
                  >
                    <img src={img} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                      }}
                      onClick={() => removeImage(idx)}
                    >
                      <MdClose size={14} />
                    </IconButton>
                    {idx === 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          backgroundColor: theme.colors.success[600],
                          color: 'white',
                          px: 1,
                          borderRadius: 0.5,
                          fontSize: '10px',
                        }}
                      >
                        Primary
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* Right: Form Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Item Name *"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              size="small"
              sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
            />

            <TextField
              fullWidth
              label="Sub Heading"
              value={formData.subHeading || ''}
              onChange={(e) => handleInputChange('subHeading', e.target.value)}
              variant="outlined"
              size="small"
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              size="small"
              sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
            />

            <Box>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || ''}
                  label="Category"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <MenuItem value="">Select category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size="small" variant="outlined" fullWidth onClick={() => setNewCategoryDialog(true)}>
                + Add New
              </Button>
            </Box>

            <Box>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Collection</InputLabel>
                <Select
                  value={formData.collection || ''}
                  label="Collection"
                  onChange={(e) => handleInputChange('collection', e.target.value)}
                >
                  <MenuItem value="">Select collection</MenuItem>
                  {collections.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size="small" variant="outlined" fullWidth onClick={() => setNewCollectionDialog(true)}>
                + Add New
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Country of Origin"
              value={formData.countryOrigin || ''}
              onChange={(e) => handleInputChange('countryOrigin', e.target.value)}
              placeholder="e.g., Pakistan"
              variant="outlined"
              size="small"
            />

            <TextField
              fullWidth
              label="SKU"
              value={formData.sku || ''}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              variant="outlined"
              size="small"
            />

            <TextField
              fullWidth
              label="Product ID"
              value={formData.productId || ''}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              variant="outlined"
              size="small"
            />

            <TextField
              fullWidth
              label="Barcode"
              value={formData.barcode || ''}
              onChange={(e) => handleInputChange('barcode', e.target.value)}
              variant="outlined"
              size="small"
            />

            <TextField
              fullWidth
              label="Product Link"
              value={formData.link || ''}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="Optional URL"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        {/* Pricing Section */}
        <Card sx={{ p: 2, mt: 3, backgroundColor: '#fafbfc', border: `1px solid ${theme.colors.primary[100]}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Pricing
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 0.75fr 0.75fr 0.75fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Cost Price"
              type="number"
              value={formData.costPrice || ''}
              onChange={(e) => handleInputChange('costPrice', Number(e.target.value))}
              variant="outlined"
              size="small"
              inputProps={{ step: '0.01' }}
            />

            <TextField
              fullWidth
              label="Selling Price *"
              type="number"
              value={formData.sellingPrice || ''}
              onChange={(e) => handleSellingPriceChange(Number(e.target.value))}
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
              variant="outlined"
              size="small"
              inputProps={{ step: '0.01' }}
            />

            <TextField
              fullWidth
              label="Discount %"
              type="number"
              value={formData.discountPercent || ''}
              onChange={(e) => {
                const pct = Number(e.target.value);
                const sell = formData.sellingPrice || 0;
                const discAmt = (sell * pct) / 100;
                const sale = sell - discAmt;
                handleInputChange('discountPercent', pct);
                handleInputChange('discountAmount', Math.round(discAmt * 100) / 100);
                handleInputChange('salePrice', Math.round(sale * 100) / 100);
              }}
              variant="outlined"
              size="small"
              inputProps={{ step: '0.01' }}
            />

            <TextField
              fullWidth
              label="Discount Amount"
              type="number"
              value={formData.discountAmount || ''}
              onChange={(e) => {
                const amt = Number(e.target.value);
                const sell = formData.sellingPrice || 0;
                const sale = sell - amt;
                const pct = sell ? (amt / sell) * 100 : 0;
                handleInputChange('discountAmount', amt);
                handleInputChange('discountPercent', Math.round(pct * 100) / 100);
                handleInputChange('salePrice', Math.round(sale * 100) / 100);
              }}
              variant="outlined"
              size="small"
              inputProps={{ step: '0.01' }}
            />

            <TextField
              fullWidth
              label="Sale Price"
              type="number"
              value={formData.salePrice || ''}
              onChange={(e) => handleSalePriceChange(Number(e.target.value))}
              variant="outlined"
              size="small"
              inputProps={{ step: '0.01' }}
            />

            <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 5' }, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.markSale || false}
                    onChange={(e) => handleInputChange('markSale', e.target.checked)}
                  />
                }
                label="Mark as Sale Item"
              />
            </Box>
          </Box>
        </Card>

        {/* Stock Section */}
        <Card sx={{ p: 2, mt: 3, backgroundColor: '#fafbfc', border: `1px solid ${theme.colors.primary[100]}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
            Stock Management
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.stockManaged || false}
                  onChange={(e) => handleInputChange('stockManaged', e.target.checked)}
                />
              }
              label="Manage Stock?"
            />

            {formData.stockManaged && (
              <>
                <TextField
                  fullWidth
                  label="Opening Stock"
                  type="number"
                  value={formData.openingStock || 0}
                  onChange={(e) => {
                    handleInputChange('openingStock', Number(e.target.value));
                    handleStockChange();
                  }}
                  variant="outlined"
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Stock In"
                  type="number"
                  value={formData.stockIn || 0}
                  onChange={(e) => {
                    handleInputChange('stockIn', Number(e.target.value));
                    handleStockChange();
                  }}
                  variant="outlined"
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Stock Out"
                  type="number"
                  value={formData.stockOut || 0}
                  onChange={(e) => {
                    handleInputChange('stockOut', Number(e.target.value));
                    handleStockChange();
                  }}
                  variant="outlined"
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Current Stock"
                  type="number"
                  value={formData.currentStock || 0}
                  disabled
                  variant="outlined"
                  size="small"
                />
              </>
            )}
          </Box>
        </Card>

        {/* Tags Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
            Tags
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <TextField
              size="small"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTag();
                }
              }}
              sx={{ flex: 1 }}
            />
            <Button variant="outlined" onClick={addTag}>
              Add
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {(formData.tags || []).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => removeTag(tag)}
                sx={{
                  backgroundColor: theme.colors.primary[100],
                  color: theme.colors.primary[700],
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Rating & Status */}
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
              Rating
            </Typography>
            <Box sx={{ fontSize: '24px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleInputChange('rating', star)}
                  style={{ cursor: 'pointer', marginRight: '4px' }}
                >
                  {star <= (formData.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.status === 'active'}
                onChange={(e) => handleInputChange('status', e.target.checked ? 'active' : 'inactive')}
              />
            }
            label="Active"
          />
        </Box>

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.colors.primary[100]}` }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.colors.primary[600],
              '&:hover': { backgroundColor: theme.colors.primary[700] },
            }}
            onClick={handleSave}
          >
            {item ? 'Update Item' : 'Create Item'}
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Card>

      {/* New Category Dialog */}
      <Dialog open={newCategoryDialog} onClose={() => setNewCategoryDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCategoryDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (newCategory.trim()) {
                onAddCategory(newCategory.trim());
                setNewCategory('');
                setNewCategoryDialog(false);
              }
            }}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Collection Dialog */}
      <Dialog open={newCollectionDialog} onClose={() => setNewCollectionDialog(false)}>
        <DialogTitle>Add New Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Collection Name"
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCollectionDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (newCollection.trim()) {
                onAddCollection(newCollection.trim());
                setNewCollection('');
                setNewCollectionDialog(false);
              }
            }}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// interface CatalogueFormProps {
//   item?: CatalogueItem;
//   categories: string[];
//   collections: string[];
//   onSave: (item: Omit<CatalogueItem, 'id' | 'updated'> | CatalogueItem) => void;
//   onCancel: () => void;
//   onAddCategory: (category: string) => void;
//   onAddCollection: (collection: string) => void;

