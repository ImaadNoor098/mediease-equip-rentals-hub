
export type SavedAddress = {
  id: string;
  fullName: string;
  mobileNumber: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  type: 'home' | 'work' | 'hostel' | 'college' | 'friend';
  isDefault?: boolean;
};

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

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orderHistory?: OrderHistoryItem[];
  savedAddresses?: SavedAddress[];
};

export type RegisterData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addOrder: (order: OrderHistoryItem) => void;
  deleteOrder: (orderId: string) => void;
  bulkDeleteOrders: (orderIds: string[]) => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  updateUserPassword: (newPassword: string) => Promise<void>;
  validateCurrentPassword: (password: string) => Promise<boolean>;
};
