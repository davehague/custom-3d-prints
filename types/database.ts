export interface DBUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  created_at: Date;
  last_login: Date;
  is_admin: boolean;
}

export interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  price: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DBProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  display_order: number;
  is_primary: boolean;
  created_at: Date;
  public_url: string;
}

export interface DBProductWithImages extends DBProduct {
  images: DBProductImage[];
}

export interface DBCustomizationType {
  id: string;
  name: string;
  created_at: Date;
}

export interface DBCustomizationOption {
  id: string;
  type_id: string;
  value: string;
  created_at: Date;
}

export interface DBProductCustomization {
  product_id: string;
  customization_type_id: string;
}

// Helper type for joined product data
export interface DBProductWithDetails extends DBProduct {
  images: DBProductImage[];
  customizations: Array<{
    type: DBCustomizationType;
    options: DBCustomizationOption[];
  }>;
}

// Helper types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: DBUser;
        Insert: Omit<DBUser, "id" | "created_at" | "last_login">;
        Update: Partial<Omit<DBUser, "id">>;
      };
      products: {
        Row: DBProduct;
        Insert: Omit<DBProduct, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DBProduct, "id" | "created_at" | "updated_at">>;
      };
      product_images: {
        Row: DBProductImage;
        Insert: Omit<DBProductImage, "id" | "created_at">;
        Update: Partial<Omit<DBProductImage, "id" | "created_at">>;
      };
      customization_types: {
        Row: DBCustomizationType;
        Insert: Omit<DBCustomizationType, "id" | "created_at">;
        Update: Partial<Omit<DBCustomizationType, "id" | "created_at">>;
      };
      customization_options: {
        Row: DBCustomizationOption;
        Insert: Omit<DBCustomizationOption, "id" | "created_at">;
        Update: Partial<Omit<DBCustomizationOption, "id" | "created_at">>;
      };
      product_customizations: {
        Row: DBProductCustomization;
        Insert: DBProductCustomization;
        Update: DBProductCustomization;
      };
    };
  };
}
