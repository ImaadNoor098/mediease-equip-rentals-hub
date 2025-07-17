
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AddressFormData } from './CheckoutAddress';
import { useOrderProcessing } from '@/hooks/useOrderProcessing';
import PaymentSuccessContent from '@/components/payment/PaymentSuccessContent';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  
  const { method, total, savings, paymentId, shippingAddress } = location.state || { 
    method: 'Cash on Delivery', 
    total: 0,
    savings: 0,
    paymentId: null,
    shippingAddress: null
  };
  
  // Process order creation using the custom hook
  const { orderProcessed } = useOrderProcessing({
    method,
    total,
    savings,
    paymentId,
    shippingAddress
  });
  
  return (
    <PaymentSuccessContent 
      method={method}
      total={total}
      savings={savings}
      paymentId={paymentId}
      shippingAddress={shippingAddress as AddressFormData | null}
      orderProcessed={orderProcessed}
    />
  );
};

export default PaymentSuccess;
