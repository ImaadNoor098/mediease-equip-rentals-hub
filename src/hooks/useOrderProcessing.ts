
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

    // Create order items with complete data structure matching OrderHistoryItem
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
      if (item.retailPrice && item.retailPrice > 0 && item.retailPrice > item.price) {
        return sum + ((item.retailPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);

    // Create order object with proper structure including purchase/return dates
    const orderDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(orderDate.getDate() + 30); // 30 days return period

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

    console.log('useOrderProcessing: Creating order with structure:', newOrder);

    // Mark as processed first to prevent duplicates
    setOrderProcessed(true);
    
    // Save order based on authentication status
    if (isAuthenticated && user) {
      console.log('useOrderProcessing: Saving order for authenticated user');
      addOrder(newOrder);
      console.log('useOrderProcessing: Order added to user history successfully');
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
        
        console.log('useOrderProcessing: Guest order saved successfully. Total orders:', updatedOrders.length);
      } catch (error) {
        console.error('useOrderProcessing: Error saving guest order:', error);
      }
    }

    // Clear cart after successful order save
    clearCart();
    console.log('useOrderProcessing: Order processing completed, cart cleared');
    
  }, [cart.items, isAuthenticated, user?.id, paymentId, orderProcessed, method, total, savings, shippingAddress]);

  return { orderProcessed };
};
