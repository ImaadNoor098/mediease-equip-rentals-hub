
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Confetti from '@/components/Confetti';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { addOrder, user, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [orderProcessed, setOrderProcessed] = useState(false);
  
  const { method, total, savings, paymentId, shippingAddress } = location.state || { 
    method: 'Cash on Delivery', 
    total: 0,
    savings: 0,
    paymentId: null,
    shippingAddress: null
  };
  
  // Process order creation immediately when component mounts
  useEffect(() => {
    if (orderProcessed) {
      console.log('PaymentSuccess: Order already processed, skipping');
      return;
    }

    console.log('PaymentSuccess: Starting order processing');
    console.log('PaymentSuccess: Cart items:', cart.items);
    console.log('PaymentSuccess: Auth status:', { isAuthenticated, hasUser: !!user });

    // Validate cart has items
    if (!cart.items || cart.items.length === 0) {
      console.error('PaymentSuccess: No cart items found, cannot create order');
      setOrderProcessed(true);
      return;
    }

    // Create order items with complete data
    const orderItems = cart.items.map((item, index) => {
      console.log(`PaymentSuccess: Processing item ${index + 1}:`, item);
      
      return {
        id: item.productId || item.id || `item_${Date.now()}_${index}`,
        name: item.name || 'Unknown Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
        purchaseType: item.purchaseType || 'buy',
        image: item.image || '',
        retailPrice: item.retailPrice || item.price || 0,
        description: item.description || '',
        category: item.category || 'Medical Equipment'
      };
    });

    // Calculate totals
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
      status: 'confirmed'
    };

    console.log('PaymentSuccess: Created order object:', newOrder);

    // Save order
    try {
      if (isAuthenticated && user) {
        console.log('PaymentSuccess: Adding order for authenticated user');
        addOrder(newOrder);
        console.log('PaymentSuccess: Order added to user context');
        
        // Force a small delay to ensure state updates
        setTimeout(() => {
          console.log('PaymentSuccess: Current user order history after addition:', user.orderHistory);
        }, 100);
      } else {
        console.log('PaymentSuccess: Saving order for guest user');
        const existingOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('guestOrders', JSON.stringify(updatedOrders));
        console.log('PaymentSuccess: Guest orders saved:', updatedOrders);
      }

      // Mark as processed and clear cart
      setOrderProcessed(true);
      clearCart();
      console.log('PaymentSuccess: Order processing completed successfully');
      
    } catch (error) {
      console.error('PaymentSuccess: Error saving order:', error);
    }
  }, [cart.items, addOrder, isAuthenticated, user, method, total, savings, paymentId, shippingAddress, orderProcessed, clearCart]);
  
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  // Calculate display values
  const displayTotal = total || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const displaySavings = savings || cart.items.reduce((sum, item) => {
    if (item.retailPrice && item.retailPrice > item.price) {
      return sum + ((item.retailPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-mediease-50 px-4">
      <Confetti />
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="mx-auto h-24 w-24 flex items-center justify-center bg-green-100 rounded-full mb-8">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-mediease-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order. Your payment via {method} has been processed successfully.</p>
        
        {!isAuthenticated && (
          <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
            <p className="text-sm font-medium text-orange-800">
              💡 Create an account to track your orders and view order history!
            </p>
          </div>
        )}
        
        {paymentId && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-800">Payment ID: {paymentId}</p>
          </div>
        )}
        
        {displaySavings > 0 && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-green-800">
              You saved ₹{displaySavings.toFixed(2)} on this order!
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <p className="text-sm text-gray-500">Order Total</p>
          <p className="text-2xl font-bold text-mediease-900">₹{displayTotal.toFixed(2)}</p>
        </div>

        {shippingAddress && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Delivery Address:</h3>
            <p className="text-sm text-gray-600">{shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">
              {shippingAddress.addressLine1}, {shippingAddress.addressLine2 && `${shippingAddress.addressLine2}, `}
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
            <p className="text-sm text-gray-600">Mobile: {shippingAddress.mobileNumber}</p>
          </div>
        )}
        
        <Button 
          onClick={() => navigate('/')}
          className="bg-mediease-600 hover:bg-mediease-700 w-full"
        >
          Continue Shopping ({countdown})
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
