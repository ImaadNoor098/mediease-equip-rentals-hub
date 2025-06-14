
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem } from '@/types';
import { toast } from '@/hooks/use-toast';

type CartState = {
  items: CartItem[];
  totalItems: number;
};

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalItems: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId && item.purchaseType === action.payload.purchaseType
      );
      
      let newItems;
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalItems };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalItems };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter((item) => item.id !== id);
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        return { items: newItems, totalItems };
      }
      
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalItems };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

type CartContextType = {
  cart: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (item: Omit<CartItem, 'id'>) => {
    // Generate unique ID for each cart item
    const id = `${item.productId}-${item.purchaseType}-${Date.now()}`;
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id } });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
