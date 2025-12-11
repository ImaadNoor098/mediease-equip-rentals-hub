import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { OrderHistoryItem } from '@/types/auth';

interface OrderProcessingProps {
  method: string;
  total: number;
  savings: number;
  paymentId: string | null;
  shippingAddress: any;
}

export const useOrderProcessing = ({
  method,
  total,
  savings,
  paymentId,
  shippingAddress
}: OrderProcessingProps) => {
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { addOrder, user, isAuthenticated } = useAuth();
  const [orderProcessed, setOrderProcessed] = useState(false);

  useEffect(() => {
    if (orderProcessed) {
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      navigate('/');
      return;
    }

    const orderItems = cart.items.map((item, index) => ({
      id: item.productId || item.id || `item_${Date.now()}_${index}`,
      name: item.name || 'Unknown Product',
      quantity: item.quantity || 1,
      price: item.price || 0,
      purchaseType: item.purchaseType || 'buy',
      image: item.image || '',
      retailPrice: item.retailPrice || item.price || 0,
      description: item.description || '',
      category: item.category || 'Medical Equipment'
    }));

    const calculatedTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedSavings = orderItems.reduce((sum, item) => {
      if (item.retailPrice && item.retailPrice > 0 && item.retailPrice > item.price) {
        return sum + ((item.retailPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);

    const orderDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(orderDate.getDate() + 30);

    const newOrder: OrderHistoryItem = {
      id: paymentId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: orderDate.toISOString(),
      total: total || calculatedTotal,
      method: method || 'Cash on Delivery',
      items: orderItems,
      shippingAddress: shippingAddress ? {
        fullName: shippingAddress.fullName || '',
        addressLine1: shippingAddress.addressLine1 || '',
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        pincode: shippingAddress.pincode || '',
        mobileNumber: shippingAddress.mobileNumber
      } : undefined,
      savings: savings || calculatedSavings,
      status: 'confirmed'
    };

    setOrderProcessed(true);
    
    // Save order to database if authenticated
    if (isAuthenticated && user) {
      addOrder(newOrder);
    } else {
      // Guest order - save to localStorage
      try {
        const existingOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('guestOrders', JSON.stringify(updatedOrders));
      } catch (error) {
        console.error('Error saving guest order:', error);
      }
    }

    clearCart();
    
  }, [cart.items, isAuthenticated, user?.id, paymentId, orderProcessed, method, total, savings, shippingAddress]);

  return { orderProcessed };
};
