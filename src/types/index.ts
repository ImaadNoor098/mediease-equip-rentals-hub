
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  rentPrice: number;
  buyPrice: number;
  available: boolean;
  featured: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  purchaseType: 'rent' | 'buy';
}
