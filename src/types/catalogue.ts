export interface CatalogueVariant {
  label: string;
  sku: string;
  price: number;
}

export interface CatalogueAttribute {
  name: string;
  options: string[];
}

export interface CatalogueItem {
  id: string;
  name: string;
  subHeading?: string;
  description?: string;
  category?: string;
  collection?: string;
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
  stockIn: number;
  stockOut: number;
  currentStock: number;
  tags: string[];
  rating: number;
  status: 'active' | 'inactive';
  mainImage: string;
  gallery: string[];
  variants: CatalogueVariant[];
  updated: number;
}

export interface CatalogueFilterParams {
  search?: string;
  type?: 'all' | 'product' | 'service';
  status?: 'all' | 'active' | 'inactive';
  category?: string;
}
