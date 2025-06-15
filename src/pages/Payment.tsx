
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { AddressFormData } from './CheckoutAddress';
import { usePayment } from '@/hooks/usePayment';
import PaymentSummary from '@/components/payment/PaymentSummary';
import PaymentMethods from '@/components/payment/PaymentMethods';
import PaymentActions from '@/components/payment/PaymentActions';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const shippingAddress = location.state?.shippingAddress as AddressFormData | undefined;
  
  const {
    paymentMethod,
    setPaymentMethod,
    loading,
    subtotal,
    tax,
    total,
    handlePaymentProcess
  } = usePayment(shippingAddress);

  useEffect(() => {
    if (!shippingAddress && cart.items.length > 0) {
      toast({
        title: "Address Required",
        description: "Please provide a shipping address.",
        variant: "destructive"
      });
      navigate('/checkout-address');
    } else if (shippingAddress) {
      console.log("Shipping Address on Payment Page:", shippingAddress);
    }
    if (cart.items.length === 0 && !location.pathname.includes('payment-success')) {
      toast({
        title: "Your cart is empty",
        description: "Redirecting you to the cart page.",
        variant: "default"
      });
      navigate('/cart');
    }
  }, [shippingAddress, navigate, cart.items.length, location.pathname]);
  
  if (cart.items.length === 0 && !location.pathname.includes('payment-success')) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={() => {}} />
      <main className="flex-grow pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Choose Payment Method</h1>
            
            <PaymentSummary 
              subtotal={subtotal}
              tax={tax}
              total={total}
              shippingAddress={shippingAddress}
            />
            
            <PaymentMethods 
              paymentMethod={paymentMethod}
              onPaymentSelection={setPaymentMethod}
            />
            
            <PaymentActions 
              paymentMethod={paymentMethod}
              loading={loading}
              total={total}
              shippingAddress={shippingAddress}
              onPaymentProcess={handlePaymentProcess}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
