import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import { MdClose, MdAdd } from 'react-icons/md';
import type { CatalogueItem } from '../../types/catalogue';
import type { Category, Collection } from '../../types/catalogue';
import { CustomInput } from '../common/CustomInput';
import { CustomSelect } from '../common/CustomSelect';
import { useTheme } from '../../contexts/ThemeContext';
import { assetsService } from '../../services/api';

interface CatalogueFormProps {
  item?: CatalogueItem;
  categories: Category[];
  collections: Collection[];
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
  const { colors } = useTheme();
  const [formData, setFormData] = useState<Partial<CatalogueItem>>(
    item || {
      type: 'product',
      costPrice: 0,
      sellingPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      salePrice: 0,
      markSale: false,
      stockManaged: false,
      openingStock: 0,
      emptiesTrackable: false,
      tags: [],
      rating: 0,
      images: [],
    }
  );

  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCollectionDialog, setNewCollectionDialog] = useState(false);
  const [newCollection, setNewCollection] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        // Ensure numeric fields are properly converted
        costPrice: Number(item.costPrice) || 0,
        sellingPrice: Number(item.sellingPrice) || 0,
        discountPercent: Number(item.discountPercent) || 0,
        discountAmount: Number(item.discountAmount) || 0,
        salePrice: Number(item.salePrice) || 0,
        openingStock: Number(item.openingStock) || 0,
        rating: Number(item.rating) || 0,
        // Ensure boolean fields are properly converted
        markSale: Boolean(item.markSale),
        stockManaged: Boolean(item.stockManaged),
        emptiesTrackable: Boolean(item.emptiesTrackable),
        // Ensure arrays are properly initialized
        tags: Array.isArray(item.tags) ? item.tags : [],
        images: Array.isArray(item.images) ? item.images : [],
      });
    }
  }, [item]);

  // Helper function to get image URL from asset ID or base64
  const getImageUrl = (imageData: string | undefined): string => {
    if (!imageData || typeof imageData !== 'string') return '';
    // If it's already a base64 string or full URL, return as is
    if (imageData.startsWith('data:') || imageData.startsWith('http')) {
      return imageData;
    }
    // If it's an asset ID, construct the URL
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    return `${API_BASE_URL}/assets/${imageData}`;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        if (!file.type.startsWith('image/')) return null;
        
        try {
          const uploadResponse = await assetsService.uploadFile(file);
          return uploadResponse.id; // Return the asset ID
        } catch (error) {
          console.error('Error uploading image:', error);
          return null;
        }
      });

      const uploadedAssetIds = await Promise.all(uploadPromises);
      const validAssetIds = uploadedAssetIds.filter((id): id is string => id !== null);
      
      if (validAssetIds.length > 0) {
        const currentImages = formData.images || [];
        setFormData((prev) => ({
          ...prev,
          images: [...currentImages, ...validAssetIds],
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const images = formData.images || [];
    const assetIdToDelete = images[index];
    
    // Remove from local state first
    const updatedImages = images.filter((_: string, i: number) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));

    // Delete from server if it's an asset ID (not a base64 string)
    if (assetIdToDelete && !assetIdToDelete.startsWith('data:')) {
      try {
        await assetsService.deleteAsset(assetIdToDelete);
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
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
    if (!formData.type) newErrors.type = 'Product type is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    // Prepare payload according to API structure with proper type conversion
    const payload = {
      name: formData.name || '',
      subHeading: formData.subHeading || '',
      description: formData.description || '',
      type: formData.type || 'product',
      categoryId: formData.categoryId || undefined,
      collectionId: formData.collectionId || undefined,
      costPrice: Number(formData.costPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      discountPercent: Number(formData.discountPercent) || 0,
      discountAmount: Number(formData.discountAmount) || 0,
      salePrice: Number(formData.salePrice) || 0,
      markSale: Boolean(formData.markSale),
      stockManaged: Boolean(formData.stockManaged),
      openingStock: Number(formData.openingStock) || 0,
      emptiesTrackable: Boolean(formData.emptiesTrackable),
      sku: formData.sku || '',
      productId: formData.productId || '',
      barcode: formData.barcode || '',
      countryOrigin: formData.countryOrigin || '',
      link: formData.link || '',
      // Convert images array to string array (asset IDs only)
      images: (formData.images || []).map((img: any) => {
        if (typeof img === 'string') {
          return img; // Already a string (asset ID)
        } else if (img && typeof img === 'object' && img.id) {
          return img.id; // Extract asset ID from object
        }
        return ''; // Fallback for invalid entries
      }).filter(Boolean), // Remove empty strings
      tags: formData.tags || [],
      rating: Number(formData.rating) || 0,
    };
    
    onSave(payload as any);
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

  return (
    <Box sx={{ backgroundColor: colors.background.primary }}>
      <Card sx={{ 
        p: 3, 
        mb: 3, 
        boxShadow: colors.shadow.md,
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.primary}`,
      }}>
        <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${colors.border.primary}` }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text.primary }}>
            {item ? 'Edit Catalogue Item' : 'Add New Catalogue Item'}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, gap: 3 }}>
          {/* Left: Image Gallery */}
          <Box sx={{ minWidth: { md: '250px' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: colors.text.primary }}>
              Product Images
            </Typography>
            <Box
              sx={{
                border: `2px dashed ${colors.border.primary}`,
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                backgroundColor: colors.background.secondary,
                cursor: uploadingImages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: uploadingImages ? 0.6 : 1,
                '&:hover': !uploadingImages ? {
                  borderColor: colors.primary[600],
                  backgroundColor: colors.primary[50] || colors.background.tertiary,
                } : {},
              }}
              onClick={() => !uploadingImages && galleryInputRef.current?.click()}
            >
              {uploadingImages ? (
                <>
                  <CircularProgress size={32} sx={{ color: colors.primary[600] }} />
                  <Typography variant="caption" sx={{ display: 'block', color: colors.text.tertiary, mt: 1 }}>
                    Uploading images...
                  </Typography>
                </>
              ) : (
                <>
                  <MdAdd size={32} color={colors.primary[600]} style={{ margin: '0 auto' }} />
                  <Typography variant="caption" sx={{ display: 'block', color: colors.text.tertiary, mt: 1 }}>
                    Click to upload or drag images here
                  </Typography>
                </>
              )}
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={uploadingImages}
              />
            </Box>

            {/* Gallery Preview */}
            {formData.images && formData.images.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                {formData.images.map((img: any, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: idx === 0 ? `2px solid ${colors.status.success}` : `1px solid ${colors.border.primary}`,
                    }}
                  >
                    <img src={getImageUrl(typeof img === 'string' ? img : '')} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                          backgroundColor: colors.status.success,
                          color: colors.text.inverse,
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
            <CustomInput
              fullWidth
              label="Item Name *"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              size="small"
              sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
            />

            <CustomInput
              fullWidth
              label="Sub Heading"
              value={formData.subHeading || ''}
              onChange={(e) => handleInputChange('subHeading', e.target.value)}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
              size="small"
              sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
            />

            <Box>
              <CustomSelect
                fullWidth
                size="small"
                label="Category"
                value={formData.categoryId || ''}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                options={[
                  { label: "Select category", value: "" },
                  ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
                ]}
              />
              <Button 
                size="small" 
                variant="outlined" 
                fullWidth 
                onClick={() => setNewCategoryDialog(true)}
                sx={{
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  '&:hover': {
                    borderColor: colors.primary[600],
                    backgroundColor: colors.background.secondary,
                  },
                }}
              >
                + Add New
              </Button>
            </Box>

            <Box>
              <CustomSelect
                fullWidth
                size="small"
                label="Collection"
                value={formData.collectionId || ''}
                onChange={(e) => handleInputChange('collectionId', e.target.value)}
                options={[
                  { label: "Select collection", value: "" },
                  ...collections.map((col) => ({ label: col.name, value: col.id })),
                ]}
              />
              <Button 
                size="small" 
                variant="outlined" 
                fullWidth 
                onClick={() => setNewCollectionDialog(true)}
                sx={{
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                  '&:hover': {
                    borderColor: colors.primary[600],
                    backgroundColor: colors.background.secondary,
                  },
                }}
              >
                + Add New
              </Button>
            </Box>

            <CustomInput
              fullWidth
              label="Country of Origin"
              value={formData.countryOrigin || ''}
              onChange={(e) => handleInputChange('countryOrigin', e.target.value)}
              placeholder="e.g., Pakistan"
              size="small"
            />

            <CustomInput
              fullWidth
              label="SKU"
              value={formData.sku || ''}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Product ID"
              value={formData.productId || ''}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Barcode"
              value={formData.barcode || ''}
              onChange={(e) => handleInputChange('barcode', e.target.value)}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Product Link"
              value={formData.link || ''}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="Optional URL"
              size="small"
            />
          </Box>
        </Box>

        {/* Pricing Section */}
        <Card sx={{ 
          p: 2, 
          mt: 3, 
          backgroundColor: colors.background.secondary, 
          border: `1px solid ${colors.border.primary}`,
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}>
            Pricing
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 0.75fr 0.75fr 0.75fr' }, gap: 2 }}>
            <CustomInput
              fullWidth
              label="Cost Price"
              type="number"
              value={String(formData.costPrice || '')}
              onChange={(e) => handleInputChange('costPrice', Number(e.target.value))}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Selling Price *"
              type="number"
              value={String(formData.sellingPrice || '')}
              onChange={(e) => handleSellingPriceChange(Number(e.target.value))}
              error={errors.sellingPrice}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Discount %"
              type="number"
              value={String(formData.discountPercent || '')}
              onChange={(e) => {
                const pct = Number(e.target.value);
                const sell = formData.sellingPrice || 0;
                const discAmt = (sell * pct) / 100;
                const sale = sell - discAmt;
                handleInputChange('discountPercent', pct);
                handleInputChange('discountAmount', Math.round(discAmt * 100) / 100);
                handleInputChange('salePrice', Math.round(sale * 100) / 100);
              }}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Discount Amount"
              type="number"
              value={String(formData.discountAmount || '')}
              onChange={(e) => {
                const amt = Number(e.target.value);
                const sell = formData.sellingPrice || 0;
                const sale = sell - amt;
                const pct = sell ? (amt / sell) * 100 : 0;
                handleInputChange('discountAmount', amt);
                handleInputChange('discountPercent', Math.round(pct * 100) / 100);
                handleInputChange('salePrice', Math.round(sale * 100) / 100);
              }}
              size="small"
            />

            <CustomInput
              fullWidth
              label="Sale Price"
              type="number"
              value={String(formData.salePrice || '')}
              onChange={(e) => handleSalePriceChange(Number(e.target.value))}
              size="small"
            />

            <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 5' }, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.markSale || false}
                    onChange={(e) => handleInputChange('markSale', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: colors.primary[600],
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: colors.primary[600],
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: colors.text.primary }}>Mark as Sale Item</Typography>}
              />
            </Box>
          </Box>
        </Card>

        {/* Stock Section */}
        <Card sx={{ 
          p: 2, 
          mt: 3, 
          backgroundColor: colors.background.secondary, 
          border: `1px solid ${colors.border.primary}`,
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: colors.text.primary }}>
            Stock Management
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.stockManaged || false}
                  onChange={(e) => handleInputChange('stockManaged', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: colors.primary[600],
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: colors.primary[600],
                    },
                  }}
                />
              }
              label={<Typography sx={{ color: colors.text.primary }}>Manage Stock?</Typography>}
            />

            {formData.stockManaged && (
              <>
                <CustomInput
                  fullWidth
                  label="Opening Stock"
                  type="number"
                  value={String(formData.openingStock || 0)}
                  onChange={(e) => handleInputChange('openingStock', Number(e.target.value))}
                  size="small"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.emptiesTrackable || false}
                      onChange={(e) => handleInputChange('emptiesTrackable', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: colors.primary[600],
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: colors.primary[600],
                        },
                      }}
                    />
                  }
                  label={<Typography sx={{ color: colors.text.primary }}>Track Empties</Typography>}
                />
              </>
            )}
          </Box>
        </Card>

        {/* Tags Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: colors.text.primary }}>
            Tags
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <CustomInput
              size="small"
              label="Add Tag"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button 
              variant="outlined" 
              onClick={addTag}
              sx={{
                color: colors.text.primary,
                borderColor: colors.border.primary,
                '&:hover': {
                  borderColor: colors.primary[600],
                  backgroundColor: colors.background.secondary,
                },
              }}
            >
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
                  backgroundColor: colors.primary[100] || colors.background.tertiary,
                  color: colors.primary[700] || colors.text.primary,
                  '& .MuiChip-deleteIcon': {
                    color: colors.primary[700] || colors.text.primary,
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Rating & Status */}
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: colors.text.primary }}>
              Rating
            </Typography>
            <Box sx={{ fontSize: '24px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleInputChange('rating', star)}
                  style={{ 
                    cursor: 'pointer', 
                    marginRight: '4px',
                    color: star <= (formData.rating || 0) ? colors.status.warning : colors.text.tertiary,
                  }}
                >
                  {star <= (formData.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.border.primary}` }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.primary[600],
              '&:hover': { backgroundColor: colors.primary[700] },
            }}
            onClick={handleSave}
          >
            {item ? 'Update Item' : 'Create Item'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            sx={{
              color: colors.text.secondary,
              borderColor: colors.border.primary,
              '&:hover': {
                borderColor: colors.text.secondary,
                backgroundColor: colors.background.secondary,
              },
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Card>

      {/* New Category Dialog */}
      <Dialog 
        open={newCategoryDialog} 
        onClose={() => setNewCategoryDialog(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.lg,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>Add New Category</DialogTitle>
        <DialogContent>
          <CustomInput
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.secondary }}>
          <Button 
            onClick={() => setNewCategoryDialog(false)}
            sx={{ color: colors.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (newCategory.trim()) {
                onAddCategory(newCategory.trim());
                setNewCategory('');
                setNewCategoryDialog(false);
              }
            }}
            variant="contained"
            sx={{
              backgroundColor: colors.primary[600],
              '&:hover': {
                backgroundColor: colors.primary[700],
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Collection Dialog */}
      <Dialog 
        open={newCollectionDialog} 
        onClose={() => setNewCollectionDialog(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.primary}`,
              boxShadow: colors.shadow.lg,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: colors.text.primary }}>Add New Collection</DialogTitle>
        <DialogContent>
          <CustomInput
            fullWidth
            label="Collection Name"
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.background.secondary }}>
          <Button 
            onClick={() => setNewCollectionDialog(false)}
            sx={{ color: colors.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (newCollection.trim()) {
                onAddCollection(newCollection.trim());
                setNewCollection('');
                setNewCollectionDialog(false);
              }
            }}
            variant="contained"
            sx={{
              backgroundColor: colors.primary[600],
              '&:hover': {
                backgroundColor: colors.primary[700],
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

