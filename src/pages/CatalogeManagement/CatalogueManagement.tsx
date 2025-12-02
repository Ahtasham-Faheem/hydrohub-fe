import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MdAdd,
  MdFileDownload,
  MdPrint,
  MdViewAgenda,
  MdGridView,
  MdEdit,
  MdVisibility,
  MdMoreVert,
} from 'react-icons/md';
import { TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { theme } from '../../theme/colors';
import { CatalogueService } from '../../services/catalogueService';
import { CatalogueFilters } from '../../components/catalogue/CatalogueFilters';
import { CatalogueCard } from '../../components/catalogue/CatalogueCard';
import { CatalogueForm } from '../../components/catalogue/CatalogueForm';
import type { CatalogueItem, CatalogueFilterParams } from '../../types/catalogue';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';

export const CatalogueManagement = () => {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogueItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<CatalogueFilterParams>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuItemId, setMenuItemId] = useState<string | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<'category' | 'collection'>('category');
  const [bulkStep, setBulkStep] = useState(1); // 1: enter name, 2: select items
  const [bulkNewName, setBulkNewName] = useState('');
  const [bulkSelectedItems, setBulkSelectedItems] = useState<Set<string>>(new Set());

  // Initialize
  useEffect(() => {
    CatalogueService.seedIfEmpty();
    loadData();
  }, []);

  const loadData = () => {
    const allItems = CatalogueService.getAll();
    setItems(allItems);
    setCategories(CatalogueService.getCategories());
    setCollections(CatalogueService.getCollections());
    filterItems(allItems, currentFilters);
  };

  const filterItems = (itemsList: CatalogueItem[], filters: CatalogueFilterParams) => {
    let result = itemsList;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.sku || '').toLowerCase().includes(q) ||
          (item.barcode || '').toLowerCase().includes(q) ||
          (item.category || '').toLowerCase().includes(q)
      );
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((item) => item.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    setFilteredItems(result);
    setPage(0);
  };

  const handleFiltersChange = (filters: CatalogueFilterParams) => {
    setCurrentFilters(filters);
    filterItems(items, filters);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: CatalogueItem) => {
    setEditingItem(item);
    setShowForm(true);
    setViewDialogOpen(false);
  };

  const handleSaveItem = (data: any) => {
    setLoading(true);
    try {
      if (editingItem) {
        CatalogueService.update(editingItem.id, data);
      } else {
        CatalogueService.create(data);
      }
      loadData();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (item: CatalogueItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setLoading(true);
    try {
      CatalogueService.toggleStatus(id);
      loadData();
    } finally {
      setLoading(false);
    }
    setMenuAnchor(null);
  };

  const handleDeleteItem = () => {
    if (deleteItemId) {
      setLoading(true);
      try {
        CatalogueService.delete(deleteItemId);
        loadData();
      } finally {
        setLoading(false);
      }
    }
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const handleAddCategory = (category: string) => {
    CatalogueService.addCategory(category);
    setCategories(CatalogueService.getCategories());
  };

  const handleAddCollection = (collection: string) => {
    CatalogueService.addCollection(collection);
    setCollections(CatalogueService.getCollections());
  };

  const openBulkCreateFlow = (mode: 'category' | 'collection') => {
    setBulkMode(mode);
    setBulkStep(1);
    setBulkNewName('');
    setBulkSelectedItems(new Set());
    setBulkModalOpen(true);
  };

  const handleBulkNext = () => {
    if (!bulkNewName.trim()) {
      alert('Please enter a name');
      return;
    }
    if (bulkMode === 'category') {
      if (!categories.includes(bulkNewName)) {
        setCategories([bulkNewName, ...categories]);
      }
    } else {
      if (!collections.includes(bulkNewName)) {
        setCollections([bulkNewName, ...collections]);
      }
    }
    setBulkStep(2);
  };

  const handleBulkBack = () => {
    setBulkStep(1);
    setBulkSelectedItems(new Set());
  };

  const handleToggleBulkItem = (itemId: string) => {
    const newSelected = new Set(bulkSelectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setBulkSelectedItems(newSelected);
  };

  const handleBulkSelectAll = () => {
    setBulkSelectedItems(new Set(items.map(item => item.id)));
  };

  const handleBulkClearAll = () => {
    setBulkSelectedItems(new Set());
  };

  const handleBulkApply = () => {
    if (bulkSelectedItems.size === 0) {
      alert('Please select at least one item');
      return;
    }
    
    setLoading(true);
    try {
      bulkSelectedItems.forEach(itemId => {
        const updateData = bulkMode === 'category' 
          ? { category: bulkNewName }
          : { collection: bulkNewName };
        CatalogueService.update(itemId, updateData);
      });
      loadData();
      setBulkModalOpen(false);
      setBulkStep(1);
      setBulkNewName('');
      setBulkSelectedItems(new Set());
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const json = JSON.stringify(filteredItems, null, 2);
    downloadFile('catalogue.json', json, 'application/json');
  };

  const exportToCSV = () => {
    if (!filteredItems.length) return;
    const headers = ['Name', 'Category', 'SKU', 'Selling Price', 'Sale Price', 'Stock', 'Status'];
    const rows = filteredItems.map((item) => [
      item.name,
      item.category || '',
      item.sku || '',
      item.sellingPrice,
      item.salePrice,
      item.currentStock,
      item.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    downloadFile('catalogue.csv', csv, 'text/csv');
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const paginatedItems = filteredItems.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
          Catalogue Management
        </Typography>
        <Typography variant="body2" sx={{ color: theme.colors.text300 }}>
          Manage your products and services inventory
        </Typography>
      </Box>

      {/* Top Actions */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <PrimaryButton
          startIcon={<MdAdd />}
          onClick={handleAddItem}
          sx={{
            backgroundColor: theme.colors.primary[600],
            '&:hover': { backgroundColor: theme.colors.primary[700] },
          }}
        >
          Add Item
        </PrimaryButton>

        <Stack direction="row" spacing={1}>
          <SecondaryButton
            size="small"
            onClick={() => openBulkCreateFlow('category')}
          >
            + Category
          </SecondaryButton>
          <SecondaryButton
            size="small"
            onClick={() => openBulkCreateFlow('collection')}
          >
            + Collection
          </SecondaryButton>
        </Stack>

        <Stack direction="row" spacing={1}>
          <SecondaryButton
            size="small"
            startIcon={<MdFileDownload />}
            onClick={exportToJSON}
          >
            JSON
          </SecondaryButton>
          <SecondaryButton
            size="small"
            startIcon={<MdFileDownload />}
            onClick={exportToCSV}
          >
            CSV
          </SecondaryButton>
          <SecondaryButton size="small" startIcon={<MdPrint />}>
            Print
          </SecondaryButton>
        </Stack>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newValue) => {
            if (newValue) setViewMode(newValue);
          }}
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <MdGridView size={20} />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <MdViewAgenda size={20} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Filters */}
      <CatalogueFilters
        onFiltersChange={handleFiltersChange}
        categories={categories}
        itemCount={filteredItems.length}
      />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show Form or Content */}
      {showForm ? (
        <CatalogueForm
          item={editingItem || undefined}
          categories={categories}
          collections={collections}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onAddCategory={handleAddCategory}
          onAddCollection={handleAddCollection}
        />
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
              {paginatedItems.map((item) => (
                <Box key={item.id}>
                  <CatalogueCard
                    item={item}
                    onView={handleViewItem}
                    onEdit={handleEditItem}
                    onToggle={handleToggleStatus}
                    onDelete={(id) => {
                      setDeleteItemId(id);
                      setDeleteConfirmOpen(true);
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: theme.colors.primary[50] }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        {item.mainImage && (
                          <img
                            src={item.mainImage}
                            alt={item.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        {Number(item.salePrice || item.sellingPrice).toLocaleString()} PKR
                      </TableCell>
                      <TableCell>{item.currentStock || '-'}</TableCell>
                      <TableCell>
                        <span
                          style={{
                            backgroundColor: item.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                            color: item.status === 'active' ? '#065f46' : '#475569',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setMenuAnchor(e.currentTarget);
                            setMenuItemId(item.id);
                          }}
                        >
                          <MdMoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{ borderTop: `1px solid ${theme.colors.primary[100]}`, mt: 2 }}
            />
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && !loading && (
            <Alert severity="info" sx={{ mt: 3 }}>
              No items found. Try adjusting your filters or add a new item to get started.
            </Alert>
          )}
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          const item = items.find(i => i.id === menuItemId);
          if (item) handleViewItem(item);
          setMenuAnchor(null);
        }}>
          <MdVisibility style={{ marginRight: 8 }} /> View
        </MenuItem>
        <MenuItem onClick={() => {
          const item = items.find(i => i.id === menuItemId);
          if (item) handleEditItem(item);
          setMenuAnchor(null);
        }}>
          <MdEdit style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuItemId) handleToggleStatus(menuItemId);
          setMenuAnchor(null);
        }}>
          Toggle Status
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteItemId(menuItemId);
          setDeleteConfirmOpen(true);
          setMenuAnchor(null);
        }} sx={{ color: theme.colors.danger[600] }}>
          Delete
        </MenuItem>
      </Menu>

      {/* View Dialog */}
      {selectedItem && (
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{selectedItem.name}</DialogTitle>
          <DialogContent dividers>
            {selectedItem.mainImage && (
              <Box
                component="img"
                src={selectedItem.mainImage}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Category:</strong> {selectedItem.category}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>SKU:</strong> {selectedItem.sku}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Price:</strong> {Number(selectedItem.salePrice || selectedItem.sellingPrice).toLocaleString()} PKR
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Stock:</strong> {selectedItem.currentStock}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Description:</strong> {selectedItem.description}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => handleEditItem(selectedItem)} variant="contained">
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteItem} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Assign Modal - Step 1: Enter Name */}
      <Dialog
        open={bulkModalOpen && bulkStep === 1}
        onClose={() => setBulkModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {bulkMode === 'category' ? 'Create New Category' : 'Create New Collection'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter a new {bulkMode} name and proceed to assign it to existing items.
          </Typography>
          <TextField
            fullWidth
            label={bulkMode === 'category' ? 'Category Name' : 'Collection Name'}
            value={bulkNewName}
            onChange={(e) => setBulkNewName(e.target.value)}
            placeholder={bulkMode === 'category' ? 'e.g., Alkaline Water' : 'e.g., Premium Pack'}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkModalOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkNext} variant="contained">
            Next
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Assign Modal - Step 2: Select Items */}
      <Dialog
        open={bulkModalOpen && bulkStep === 2}
        onClose={() => setBulkModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Items to Assign {bulkMode === 'category' ? 'Category' : 'Collection'}: {bulkNewName}
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button size="small" variant="outlined" onClick={handleBulkSelectAll}>
              Select All
            </Button>
            <Button size="small" variant="outlined" onClick={handleBulkClearAll}>
              Clear All
            </Button>
            <Typography variant="body2" sx={{ ml: 'auto' }}>
              {bulkSelectedItems.size} selected
            </Typography>
          </Stack>

          <FormGroup>
            {items.map((item) => (
              <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={bulkSelectedItems.has(item.id)}
                    onChange={() => handleToggleBulkItem(item.id)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.colors.text300 }}>
                      SKU: {item.sku} • {item.category}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkBack}>Back</Button>
          <Button onClick={() => setBulkModalOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkApply} variant="contained" disabled={bulkSelectedItems.size === 0}>
            Assign to {bulkSelectedItems.size} Item{bulkSelectedItems.size !== 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
