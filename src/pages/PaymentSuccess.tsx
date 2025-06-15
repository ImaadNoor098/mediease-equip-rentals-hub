
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
  const { addOrder } = useAuth();
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
    
    console.log('PaymentSuccess: Cart items:', cart.items);
    console.log('PaymentSuccess: Payment data:', { method, total, savings, paymentId, shippingAddress });
    
    // Only save the order if we have actual cart items
    if (cart.items.length > 0 && !orderSaved) {
      const order = {
        id: paymentId || `order_${Date.now()}`,
        date: new Date().toISOString(),
        total: total || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        method: method || 'Online Payment',
        items: cart.items.map(item => ({
          id: item.id || `item_${Date.now()}_${Math.random()}`,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          purchaseType: item.purchaseType || 'buy',
          image: item.image,
          retailPrice: item.retailPrice,
          description: item.description || '',
          category: item.category || 'Medical Equipment'
        })),
        shippingAddress: shippingAddress ? {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          mobileNumber: shippingAddress.mobileNumber
        } : undefined,
        savings: savings || 0,
        status: 'confirmed'
      };
      
      console.log('PaymentSuccess: Adding order to history:', order);
      addOrder(order);
      setOrderSaved(true);
      clearCart();
    } else if (cart.items.length === 0) {
      console.log('PaymentSuccess: No items in cart, not creating order');
      // If no cart items, still mark as saved to prevent re-processing
      setOrderSaved(true);
    }
  }, [addOrder, cart.items, total, method, savings, paymentId, shippingAddress, orderSaved, clearCart]);
  
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
        
        {paymentId && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-800">Payment ID: {paymentId}</p>
          </div>
        )}
        
        {savings > 0 && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-green-800">You saved ₹{savings.toFixed(2)} on this order!</p>
          </div>
        )}
        
        <div className="mb-8">
          <p className="text-sm text-gray-500">Order Total</p>
          <p className="text-2xl font-bold text-mediease-900">₹{total.toFixed(2)}</p>
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
