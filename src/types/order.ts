
export type OrderHistoryItem = {
  id: string;
  date: string;
  total: number;
  method: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    purchaseType?: 'rent' | 'buy';
    image?: string;
    retailPrice?: number;
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
};
