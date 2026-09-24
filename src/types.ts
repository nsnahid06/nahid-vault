export type Category = 'All' | 'Outerwear' | 'Formal Wear' | 'Casual Shirts' | 'Denim & Pants' | 'Footwear' | 'Accessories';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  material: string;
  fit: string;
  care: string;
  colors: ColorVariant[];
  sizes: Size[];
  inStock: boolean;
  stockCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + color)
  product: Product;
  selectedSize: Size;
  selectedColor: ColorVariant;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export type PaymentMethod = 'credit_card' | 'cash_on_delivery' | 'mobile_banking';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  estimatedDelivery: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  image?: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: string;
}
