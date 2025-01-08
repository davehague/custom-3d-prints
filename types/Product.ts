export interface Customization {
  type: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  customizations: Array<{
    type: string;
    options: string[];
  }>;
  selectedOptions?: Record<string, string>;
}
