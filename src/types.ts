export type MenuCategory = 
  | 'Entrees'
  | 'Catering'
  | 'Wings'
  | 'Empanadas & Patties'
  | 'Tacos, Burritos & Wraps'
  | 'Burgers & Hot Dogs'
  | 'Breakfast (All Day)'
  | 'Sides'
  | 'Sweet Treats'
  | 'Beverages'
  | 'Vegan';

export interface Variation {
  id: string;
  name: string;
  price: number;
}

export interface EditorialMenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  priceDisplay: string;
  price: number; // numeric price for cart/checkout
  description?: string;
  options?: string;
  variations?: Variation[];
  image?: string;
  isPopular?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: string;
}
