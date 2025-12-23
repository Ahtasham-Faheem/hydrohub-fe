export interface CatalogueVariant {
  label: string;
  sku: string;
  price: number;
}

export interface CatalogueAttribute {
  name: string;
  options: string[];
}

export interface Category {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueItem {
  id: string;
  name: string;
  subHeading?: string;
  description?: string;
  category?: string | Category;
  collection?: string | Collection;
  categoryId?: string;
  collectionId?: string;
  countryOrigin?: string;
  link?: string;
  sku?: string;
  productId?: string;
  barcode?: string;
  type: 'product' | 'service';
  costPrice: number;
  sellingPrice: number;
  discountPercent: number;
  discountAmount: number;
  salePrice: number;
  markSale: boolean;
  stockManaged: boolean;
  openingStock: number;
  emptiesTrackable?: boolean;
  stockIn?: number;
  stockOut?: number;
  currentStock?: number;
  tags: string[];
  rating: number;
  status?: 'active' | 'inactive';
  mainImage?: string;
  gallery?: string[];
  images?: string[];
  variants?: CatalogueVariant[];
  updated?: number;
}

export interface CatalogueFilterParams {
  search?: string;
  collection?: string;
  status?: 'all' | 'active' | 'inactive';
  category?: string;
}
