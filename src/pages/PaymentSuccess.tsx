
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
  const [orderSaved, setOrderSaved] = useState(false);
  
  const { method, total, savings, paymentId, shippingAddress } = location.state || { 
    method: 'Online Payment', 
    total: 0,
    savings: 0,
    paymentId: null,
    shippingAddress: null
  };
  
  // Clear cart and save order on successful payment - only once
  useEffect(() => {
    if (orderSaved) return; // Prevent duplicate order saving
    
    console.log('PaymentSuccess: Authentication status:', { isAuthenticated, user: user?.email });
    console.log('PaymentSuccess: Cart items:', cart.items);
    console.log('PaymentSuccess: Payment data:', { method, total, savings, paymentId, shippingAddress });
    
    // Create order from cart items or from payment data
    let orderItems = [];
    let orderTotal = total || 0;
    let orderSavings = savings || 0;
    
    // If we have cart items, use them and calculate proper totals
    if (cart.items.length > 0) {
      console.log('PaymentSuccess: Using cart items for order');
      orderItems = cart.items.map(item => ({
        id: item.productId || item.id || `item_${Date.now()}_${Math.random()}`,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        purchaseType: item.purchaseType || 'buy',
        image: item.image || '',
        retailPrice: item.retailPrice || 0,
        description: item.description || '',
        category: item.category || 'Medical Equipment'
      }));
      
      // Calculate total from cart items
      orderTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Calculate savings from cart items
      orderSavings = cart.items.reduce((sum, item) => {
        if (item.retailPrice && item.retailPrice > item.price) {
          return sum + ((item.retailPrice - item.price) * item.quantity);
        }
        return sum;
      }, 0);
      
      console.log('PaymentSuccess: Calculated order total:', orderTotal);
      console.log('PaymentSuccess: Calculated order savings:', orderSavings);
      console.log('PaymentSuccess: Order items with full details:', orderItems);
    } else {
      console.log('PaymentSuccess: No cart items, creating order from payment data');
      // If no cart items but we have payment data, create a placeholder
      if (total > 0) {
        orderItems = [{
          id: `order_item_${Date.now()}`,
          name: 'Order Item',
          quantity: 1,
          price: total,
          purchaseType: 'buy',
          description: 'Order processed successfully',
          category: 'Medical Equipment',
          image: '',
          retailPrice: 0
        }];
      }
    }
    
    // Only create order if we have items or a total amount
    if (orderItems.length > 0 || orderTotal > 0) {
      const order = {
        id: paymentId || `order_${Date.now()}`,
        date: new Date().toISOString(),
        total: orderTotal,
        method: method || 'Online Payment',
        items: orderItems,
        shippingAddress: shippingAddress ? {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          mobileNumber: shippingAddress.mobileNumber
        } : undefined,
        savings: orderSavings,
        status: 'confirmed'
      };
      
      console.log('PaymentSuccess: Creating order with complete item details:', order);
      console.log('PaymentSuccess: Order items count:', order.items.length);
      console.log('PaymentSuccess: Each item details:', order.items);
      
      // Always try to save the order
      if (isAuthenticated && user) {
        console.log('PaymentSuccess: User is authenticated, saving order to history');
        addOrder(order);
        console.log('PaymentSuccess: Order added to user history with complete details:', order.items);
      } else {
        console.log('PaymentSuccess: User is not authenticated, saving order to localStorage');
        // Store order temporarily in localStorage for guest users
        const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        guestOrders.push(order);
        localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
        console.log('PaymentSuccess: Order saved to localStorage for guest user with complete details:', order.items);
      }
      
      setOrderSaved(true);
      
      // Clear cart only after order is saved
      if (cart.items.length > 0) {
        clearCart();
        console.log('PaymentSuccess: Cart cleared after order processing');
      }
    } else {
      console.log('PaymentSuccess: No items or total amount, not creating order');
      setOrderSaved(true);
    }
  }, [addOrder, cart.items, total, method, savings, paymentId, shippingAddress, orderSaved, clearCart, isAuthenticated, user]);
  
  // Separate effect for countdown to avoid interference
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
        
        {(savings > 0 || cart.items.some(item => item.retailPrice && item.retailPrice > item.price)) && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-green-800">
              You saved ₹{(savings || cart.items.reduce((sum, item) => {
                if (item.retailPrice && item.retailPrice > item.price) {
                  return sum + ((item.retailPrice - item.price) * item.quantity);
                }
                return sum;
              }, 0)).toFixed(2)} on this order!
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <p className="text-sm text-gray-500">Order Total</p>
          <p className="text-2xl font-bold text-mediease-900">₹{(total || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</p>
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
