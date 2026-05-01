// Category
export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

// Product with relations
export interface Product {
  id: string;
  tenant_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  avg_rating?: number;
  review_count?: number;
}

// Product Image
export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
}

// Product Variant
export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  price: number | null;
  inventory: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Review
export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
  };
}

// API Response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ProductFilters {
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
}

export interface CategoryTreeResponse {
  categories: Category[];
}