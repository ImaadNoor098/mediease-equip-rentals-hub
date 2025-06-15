
import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface OrderSummarySectionProps {
  paymentId: string | null;
  method: string;
  displaySavings: number;
  displayTotal: number;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  paymentId,
  method,
  displaySavings,
  displayTotal
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
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
    </>
  );
};

export default OrderSummarySection;
