
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PaymentActionsProps {
  paymentMethod: string;
  loading: boolean;
  total: number;
  shippingAddress?: any;
  onPaymentProcess: () => void;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  paymentMethod,
  loading,
  total,
  shippingAddress,
  onPaymentProcess
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/checkout-address')}
        className="w-full sm:w-auto border-medieaze-600 text-medieaze-600 dark:text-medieaze-400 hover:bg-medieaze-50 dark:hover:bg-medieaze-900/20"
      >
        Back to Address
      </Button>
      <Button 
        onClick={onPaymentProcess}
        disabled={!paymentMethod || loading || !shippingAddress}
        className="w-full sm:w-auto bg-medieaze-600 hover:bg-medieaze-700 min-w-[180px] py-3 text-base"
      >
        {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
