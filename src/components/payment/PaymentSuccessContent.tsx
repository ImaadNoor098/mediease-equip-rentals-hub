
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { AddressFormData } from '@/pages/CheckoutAddress';
import Confetti from '@/components/Confetti';
import OrderSummarySection from './OrderSummarySection';
import AddressDisplaySection from './AddressDisplaySection';
import OrderReceiptDialog from '@/components/OrderReceiptDialog';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { OrderHistoryItem } from '@/types/auth';

interface PaymentSuccessContentProps {
  method: string;
  total: number;
  savings: number;
  paymentId: string | null;
  shippingAddress: AddressFormData | null;
  orderProcessed?: boolean;
}

const PaymentSuccessContent: React.FC<PaymentSuccessContentProps> = ({
  method,
  total,
  savings,
  paymentId,
  shippingAddress,
  orderProcessed = false
}) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const countdown = useCountdownTimer();
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  // Show receipt dialog automatically after order is processed
  useEffect(() => {
    if (orderProcessed) {
      setShowReceiptDialog(true);
    }
  }, [orderProcessed]);

  // Calculate display values
  const displayTotal = total || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const displaySavings = savings || cart.items.reduce((sum, item) => {
    if (item.retailPrice && item.retailPrice > item.price) {
      return sum + ((item.retailPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  // Create order object for receipt with all required details
  const orderForReceipt: OrderHistoryItem = {
    id: paymentId || `order_${Date.now()}`,
    date: new Date().toISOString(),
    total: displayTotal,
    method: method,
    items: cart.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      purchaseType: item.purchaseType,
      image: item.image,
      retailPrice: item.retailPrice,
      description: item.description,
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
    savings: displaySavings,
    status: 'confirmed'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mediease-50 px-4">
      <Confetti />
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="mx-auto h-24 w-24 flex items-center justify-center bg-green-100 rounded-full mb-8">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-mediease-900 mb-3">Payment Successful!</h1>
        
        <OrderSummarySection 
          paymentId={paymentId}
          method={method}
          displaySavings={displaySavings}
          displayTotal={displayTotal}
        />

        <AddressDisplaySection shippingAddress={shippingAddress} />
        
        <div className="flex flex-col gap-3 mb-6">
          <Button 
            onClick={() => setShowReceiptDialog(true)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Order Receipt
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="bg-mediease-600 hover:bg-mediease-700 w-full"
          >
            Continue Shopping ({countdown})
          </Button>
        </div>
      </div>

      <OrderReceiptDialog 
        open={showReceiptDialog}
        onOpenChange={setShowReceiptDialog}
        order={orderForReceipt}
      />
    </div>
  );
};

export default PaymentSuccessContent;
