export type Category = {
  id: string;
  code?: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  created_at?: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  created_at?: string;
};

export type Product = {
  id: string;
  subcategory_id?: string;
  name: string;
  slug: string;
  article_code: string;
  product_type?: string;
  pattern?: string;
  cup_size?: string;
  length?: string;
  description?: string;
  features?: string[];
  image_url?: string;
  additional_images?: string[];
  is_featured?: boolean;
  created_at?: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  article_number: string;
  pattern?: string;
  cup_size?: string;
  length?: string;
  description?: string;
  is_available?: boolean;
  created_at?: string;
};

export type InquiryItem = {
  id?: string;
  product_id?: string;
  product_name: string;
  article_code: string;
  selected_size?: string;
  quantity: number;
  image_url?: string;
  notes?: string;
};

export type Inquiry = {
  id?: string;
  reference_no: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  country?: string;
  message?: string;
  status?: 'pending' | 'reviewed' | 'quoted' | 'closed';
  items?: InquiryItem[];
  created_at?: string;
};

export type Catalog = {
  id: string;
  title: string;
  category_name?: string;
  description?: string;
  file_size?: string;
  pdf_url: string;
  thumbnail_url?: string;
  downloads_count?: number;
  created_at?: string;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  location: string;
  booth_number?: string;
  start_date: string;
  end_date: string;
  description?: string;
  image_url?: string;
  badge_label?: string;
  is_upcoming?: boolean;
  created_at?: string;
};
