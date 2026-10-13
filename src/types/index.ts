export interface Product {
  id: string;
  code: string;
  title: string;
  category: 'winter' | 'turkish' | 'cotton' | 'velvet' | 'offers';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  fabric: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  badge?: string;
  features: string[];
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  productCode?: string;
  likes: number;
  hasLiked?: boolean;
}

export interface CartItem {
  id: string; // unique item id based on product + size + color
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod';
}
