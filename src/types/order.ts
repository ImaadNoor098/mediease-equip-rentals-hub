
export type OrderHistoryItem = {
  id: string;
  date: string;
  total: number;
  method: string;
  items: Array<{
    id?: string;
    name: string;
    quantity: number;
    price: number;
    purchaseType?: 'rent' | 'buy';
    image?: string;
    retailPrice?: number;
    description?: string;
    category?: string;
  }>;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    mobileNumber?: string;
  };
  savings: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered';
};
