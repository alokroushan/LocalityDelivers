export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  description: string;
  isPrivate?: boolean;
  isVerified?: boolean;
}

// ChatMessage interface for merchant support conversations
export interface ChatMessage {
  sender: 'admin' | 'seller';
  text: string;
  timestamp: string;
}

export interface MerchantOnboardingRequest {
  id: string;
  userId?: string;
  businessName: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
  idProofUrl?: string;
  licenseUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  submittedAt: string;
  adminFeedback?: string;
  additionalDocsRequested?: boolean;
  // Added chatHistory to MerchantOnboardingRequest
  chatHistory?: ChatMessage[];
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
  isPrivate?: boolean;
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
  customerEmail: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  isSeller?: boolean;
  isAdmin?: boolean;
  storeId?: string;
}

export interface AppSettings {
  navTitle: string;
  navSubtitle: string;
  navIconUrl: string;
  heroHeading: string;
  heroHeadingHighlight: string;
  heroSubtext: string;
  dealsHeading: string;
  dealsSubtext: string;
  footerText: string;
}

export interface CategoryItem {
  name: string;
  icon: string;
  hasDropdown: boolean;
}

export interface Recommendation {
  title: string;
  reason: string;
  type: 'store' | 'item';
  id: string;
}

export interface HeroSlide {
  image: string;
  category: string;
  color: string;
  title?: string;
  subtitle?: string;
}