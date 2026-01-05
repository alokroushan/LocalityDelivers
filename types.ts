
export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  instructions?: string;
  sellerNote?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
}

export interface Recommendation {
  title: string;
  reason: string;
  type: 'store' | 'item';
  id: string;
}
