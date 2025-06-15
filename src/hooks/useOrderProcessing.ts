
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

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
    // Prevent multiple order creation
    if (orderProcessed) {
      console.log('useOrderProcessing: Order already processed, skipping');
      return;
    }

    // Validate cart has items
    if (!cart.items || cart.items.length === 0) {
      console.error('useOrderProcessing: No cart items found, redirecting to home');
      navigate('/');
      return;
    }

    console.log('useOrderProcessing: Processing order with cart:', cart.items);
    console.log('useOrderProcessing: User context:', { isAuthenticated, userId: user?.id });

    // Create order items with complete data
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

    // Calculate totals if not provided
    const calculatedTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedSavings = orderItems.reduce((sum, item) => {
      if (item.retailPrice && item.retailPrice > item.price) {
        return sum + ((item.retailPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);

    // Create order object
    const newOrder = {
      id: paymentId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      total: total || calculatedTotal,
      method: method || 'Cash on Delivery',
      items: orderItems,
      shippingAddress: shippingAddress,
      savings: savings || calculatedSavings,
      status: 'confirmed' as const
    };

    console.log('useOrderProcessing: Creating order:', newOrder);

    // Mark as processed immediately to prevent duplicates
    setOrderProcessed(true);
    
    // Save order based on authentication status
    if (isAuthenticated && user) {
      console.log('useOrderProcessing: Saving order for authenticated user');
      addOrder(newOrder);
    } else {
      console.log('useOrderProcessing: Saving order for guest user');
      try {
        const existingOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('guestOrders', JSON.stringify(updatedOrders));
        
        // Trigger storage event for cross-tab communication
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'guestOrders',
          newValue: JSON.stringify(updatedOrders),
          oldValue: JSON.stringify(existingOrders)
        }));
        
        console.log('useOrderProcessing: Guest order saved successfully');
      } catch (error) {
        console.error('useOrderProcessing: Error saving guest order:', error);
      }
    }

    // Clear cart after successful order save
    clearCart();
    console.log('useOrderProcessing: Order processing completed');
    
  }, []); // Empty dependency array to run only once

  return { orderProcessed };
};
