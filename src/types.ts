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

export interface EditorialMenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  priceDisplay: string;
  price: number; // numeric price for cart/checkout
  description?: string;
  options?: string;
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
