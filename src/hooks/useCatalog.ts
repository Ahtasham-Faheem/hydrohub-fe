import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogService } from '../services/api';
import type { 
  CatalogueItemsResponse, 
  CreateCatalogueItemData, 
  UpdateCatalogueItemData,
  CategoriesResponse,
  CreateCategoryData,
  UpdateCategoryData,
  CollectionsResponse,
  CreateCollectionData,
  UpdateCollectionData
} from '../services/api';
import type { 
  CatalogueItem, 
  Category, 
  Collection 
} from '../types/catalogue';

// Products Hooks
export const useGetProducts = (page = 1, limit = 10, filters?: any) => {
  return useQuery<CatalogueItemsResponse>({
    queryKey: ['products', page, limit, filters],
    queryFn: () => catalogService.getProducts(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProductById = (productId: string) => {
  return useQuery<CatalogueItem>({
    queryKey: ['product', productId],
    queryFn: () => catalogService.getProductById(productId),
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData: CreateCatalogueItemData) => 
      catalogService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, productData }: { productId: string; productData: UpdateCatalogueItemData }) =>
      catalogService.updateProduct(productId, productData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => catalogService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => catalogService.toggleProductStatus(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
    },
  });
};

// Categories Hooks
export const useGetCategories = (page = 1, limit = 100) => {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories', page, limit],
    queryFn: () => catalogService.getCategories(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetCategoryById = (categoryId: string) => {
  return useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => catalogService.getCategoryById(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryData: CreateCategoryData) => 
      catalogService.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ categoryId, categoryData }: { categoryId: string; categoryData: UpdateCategoryData }) =>
      catalogService.updateCategory(categoryId, categoryData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.categoryId] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryId: string) => catalogService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Collections Hooks
export const useGetCollections = (page = 1, limit = 100) => {
  return useQuery<CollectionsResponse>({
    queryKey: ['collections', page, limit],
    queryFn: () => catalogService.getCollections(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetCollectionById = (collectionId: string) => {
  return useQuery<Collection>({
    queryKey: ['collection', collectionId],
    queryFn: () => catalogService.getCollectionById(collectionId),
    enabled: !!collectionId,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (collectionData: CreateCollectionData) => 
      catalogService.createCollection(collectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ collectionId, collectionData }: { collectionId: string; collectionData: UpdateCollectionData }) =>
      catalogService.updateCollection(collectionId, collectionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (collectionId: string) => catalogService.deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

// Bulk Operations Hooks
export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productIds, updateData }: { productIds: string[]; updateData: Partial<CatalogueItem> }) =>
      catalogService.bulkUpdateProducts(productIds, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productIds: string[]) => catalogService.bulkDeleteProducts(productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};