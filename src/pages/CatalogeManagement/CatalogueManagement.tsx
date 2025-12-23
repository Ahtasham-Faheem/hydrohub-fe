import { useState, useEffect, useMemo } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { CatalogueFilters } from "../../components/catalogue/CatalogueFilters";
import { CatalogueCard } from "../../components/catalogue/CatalogueCard";
import { CatalogueForm } from "../../components/catalogue/CatalogueForm";
import { ExportActionBar } from "../../components/catalogue/ExportActionBar";
import { CatalogueToolbar } from "../../components/catalogue/CatalogueToolbar";
import { BulkAssignModal } from "../../components/catalogue/BulkAssignModal";
import { ProductViewDialog } from "../../components/catalogue/ProductViewDialog";
import { DeleteConfirmDialog } from "../../components/catalogue/DeleteConfirmDialog";
import { DataTable, type Column } from "../../components/common/DataTable";
import { useTheme } from "../../contexts/ThemeContext";
import { useExportData } from "../../hooks/useExportData";
import type { CatalogueItem, CatalogueFilterParams } from "../../types/catalogue";
import { 
  useGetProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  useToggleProductStatus,
  useGetCategories,
  useCreateCategory,
  useGetCollections,
  useCreateCollection,
  useBulkUpdateProducts
} from "../../hooks/useCatalog";

export const CatalogueManagement = () => {
  const { colors } = useTheme();
  const { exportToJSON, exportToCSV } = useExportData();
  
  // Type guard for category objects
  const isCategoryObject = (category: any): category is { name: string } => {
    return typeof category === 'object' && category !== null && 'name' in category;
  };

  // Type guard for collection objects
  const isCollectionObject = (collection: any): collection is { name: string } => {
    return typeof collection === 'object' && collection !== null && 'name' in collection;
  };
  
  // State
  const [filteredItems, setFilteredItems] = useState<CatalogueItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<CatalogueFilterParams>({});
  const [page, setPage] = useState(0);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<"category" | "collection">("category");
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkNewName, setBulkNewName] = useState("");
  const [bulkSelectedItems, setBulkSelectedItems] = useState<Set<string>>(new Set());
  const [bulkCreatedItemId, setBulkCreatedItemId] = useState("");

  // API Hooks
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useGetProducts(page + 1, 10, currentFilters);
  const { data: categoriesData } = useGetCategories();
  const { data: collectionsData } = useGetCollections();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const toggleStatusMutation = useToggleProductStatus();
  const createCategoryMutation = useCreateCategory();
  const createCollectionMutation = useCreateCollection();
  const bulkUpdateMutation = useBulkUpdateProducts();

  const items = productsData?.data || [];
  const totalItems = productsData?.total || 0;
  const categories = categoriesData?.data || [];
  const collections = collectionsData?.data || [];
  const isLoading = productsLoading || createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending;

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

  // Define columns for DataTable
  const columns: Column[] = [
    {
      key: 'images',
      label: 'Image',
      sortable: false,
      render: (images: string[], item: CatalogueItem) => {
        const firstImage = images && Array.isArray(images) && images.length > 0 ? images[0] : undefined;
        const imageUrl = firstImage ? getImageUrl(firstImage) : getImageUrl(item.mainImage);
        return imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Box
            sx={{
              width: 50,
              height: 50,
              backgroundColor: colors.background.tertiary,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: colors.text.tertiary }}>
              No Image
            </Typography>
          </Box>
        );
      }
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (name: string) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
          {name}
        </Typography>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (category: any) => {
        // Handle both string and object category values
        if (isCategoryObject(category)) {
          return category.name;
        }
        return category || 'N/A';
      }
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      key: 'sellingPrice',
      label: 'Price',
      sortable: true,
      render: (sellingPrice: number, item: CatalogueItem) => (
        <Typography sx={{ textAlign: "left", color: colors.text.primary }}>
          {Number(item.salePrice || sellingPrice).toLocaleString()} PKR
        </Typography>
      )
    },
    {
      key: 'currentStock',
      label: 'Stock',
      sortable: true,
      render: (stock: number) => stock || "-"
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status: string) => (
        <span
          style={{
            backgroundColor: status === "active" ? colors.status.successLight : colors.background.tertiary,
            color: status === "active" ? colors.status.success : colors.text.secondary,
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            border: `1px solid ${status === "active" ? colors.status.success : colors.border.primary}`,
          }}
        >
          {status}
        </span>
      )
    }
  ];

  // Filter items based on current filters
  const filteredAndPaginatedItems = useMemo(() => {
    let result = items;

    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      result = result.filter(
        (item) => {
          const categoryName = isCategoryObject(item.category) ? item.category.name : (item.category || '');
          const collectionName = isCollectionObject(item.collection) ? item.collection.name : (item.collection || '');
          return (
            item.name.toLowerCase().includes(q) ||
            (item.sku || "").toLowerCase().includes(q) ||
            (item.barcode || "").toLowerCase().includes(q) ||
            categoryName.toLowerCase().includes(q) ||
            collectionName.toLowerCase().includes(q)
          );
        }
      );
    }

    if (currentFilters.collection) {
      result = result.filter((item) => {
        // Compare by collection ID, not name
        if (isCollectionObject(item.collection)) {
          return item.collection.id === currentFilters.collection;
        }
        return item.collectionId === currentFilters.collection;
      });
    }

    if (currentFilters.status && currentFilters.status !== "all") {
      result = result.filter((item) => item.status === currentFilters.status);
    }

    if (currentFilters.category) {
      result = result.filter((item) => {
        // Compare by category ID, not name
        if (isCategoryObject(item.category)) {
          return item.category.id === currentFilters.category;
        }
        return item.categoryId === currentFilters.category;
      });
    }

    return result;
  }, [items, currentFilters]);

  // Update filtered items when data changes
  useEffect(() => {
    setFilteredItems(filteredAndPaginatedItems);
  }, [filteredAndPaginatedItems]);

  const handleFiltersChange = (filters: CatalogueFilterParams) => {
    setCurrentFilters(filters);
    setPage(0); // Reset to first page when filters change
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

  const handleSaveItem = async (data: any) => {
    try {
      if (editingItem) {
        await updateProductMutation.mutateAsync({
          productId: editingItem.id,
          productData: data,
        });
      } else {
        await createProductMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditingItem(null);
      refetchProducts();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleViewItem = (item: CatalogueItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
      refetchProducts();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (deleteItemId) {
      try {
        await deleteProductMutation.mutateAsync(deleteItemId);
        refetchProducts();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const handleAddCategory = async (category: string) => {
    try {
      await createCategoryMutation.mutateAsync({
        name: category,
        isActive: true,
      });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddCollection = async (collection: string) => {
    try {
      await createCollectionMutation.mutateAsync({
        name: collection,
        isActive: true,
      });
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const openBulkCreateFlow = (mode: "category" | "collection") => {
    setBulkMode(mode);
    setBulkStep(1);
    setBulkNewName("");
    setBulkSelectedItems(new Set());
    setBulkCreatedItemId("");
    setBulkModalOpen(true);
  };

  const handleBulkNext = async () => {
    if (!bulkNewName.trim()) {
      alert("Please enter a name");
      return;
    }
    
    try {
      let createdItem;
      if (bulkMode === "category") {
        createdItem = await createCategoryMutation.mutateAsync({
          name: bulkNewName,
          isActive: true,
        });
      } else {
        createdItem = await createCollectionMutation.mutateAsync({
          name: bulkNewName,
          isActive: true,
        });
      }
      
      // Store the created item ID for later use
      setBulkCreatedItemId(createdItem.id);
      setBulkStep(2);
    } catch (error) {
      console.error("Error creating category/collection:", error);
    }
  };

  const handleBulkApply = async () => {
    if (bulkSelectedItems.size === 0) {
      alert("Please select at least one item");
      return;
    }

    try {
      const updateData: Partial<CatalogueItem> = bulkMode === "category"
        ? { categoryId: bulkCreatedItemId }
        : { collectionId: bulkCreatedItemId };
      
      await bulkUpdateMutation.mutateAsync({
        productIds: Array.from(bulkSelectedItems),
        updateData,
      });
      
      refetchProducts();
      setBulkModalOpen(false);
      setBulkStep(1);
      setBulkNewName("");
      setBulkSelectedItems(new Set());
      setBulkCreatedItemId("");
    } catch (error) {
      console.error("Error applying bulk update:", error);
    }
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
    setBulkSelectedItems(new Set(items.map((item) => item.id)));
  };

  const handleBulkClearAll = () => {
    setBulkSelectedItems(new Set());
  };

  const paginatedItems = filteredItems.slice(
    page * 10,
    (page + 1) * 10
  );

  return (
    <Box 
      sx={{ 
        pb: 3,
        backgroundColor: colors.background.primary,
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {/* Export Action Bar */}
      <ExportActionBar
        onExportCSV={() => exportToCSV(filteredItems)}
        onExportJSON={() => exportToJSON(filteredItems)}
      />

      {/* Toolbar */}
      <CatalogueToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddItem={handleAddItem}
        onAddCategory={() => openBulkCreateFlow("category")}
        onAddCollection={() => openBulkCreateFlow("collection")}
      />

      {/* Filters */}
      <CatalogueFilters
        onFiltersChange={handleFiltersChange}
        categories={categories}
        collections={collections}
        itemCount={filteredItems.length}
      />

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: colors.primary[600] }} />
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
          {viewMode === "grid" && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 2,
                mb: 4,
              }}
            >
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
          {viewMode === "list" && (
            <DataTable
              columns={columns}
              data={paginatedItems}
              isLoading={isLoading}
              currentPage={page}
              setCurrentPage={setPage}
              totalPages={Math.ceil(totalItems / 10)}
              keyField="id"
              showActions={true}
              onView={handleViewItem}
              onEdit={handleEditItem}
              onDelete={(item) => {
                setDeleteItemId(item.id);
                setDeleteConfirmOpen(true);
              }}
            />
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && !isLoading && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                backgroundColor: colors.status.infoLight,
                color: colors.text.primary,
                border: `1px solid ${colors.status.info}`,
              }}
            >
              No items found. Try adjusting your filters or add a new item to
              get started.
            </Alert>
          )}
        </>
      )}

      {/* Product View Dialog */}
      <ProductViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        item={selectedItem}
        onEdit={handleEditItem}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteItem}
      />

      {/* Bulk Assign Modal */}
      <BulkAssignModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        mode={bulkMode}
        step={bulkStep}
        newName={bulkNewName}
        onNameChange={setBulkNewName}
        selectedItems={bulkSelectedItems}
        onToggleItem={handleToggleBulkItem}
        onSelectAll={handleBulkSelectAll}
        onClearAll={handleBulkClearAll}
        items={items}
        onNext={handleBulkNext}
        onBack={handleBulkBack}
        onApply={handleBulkApply}
      />
    </Box>
  );
};