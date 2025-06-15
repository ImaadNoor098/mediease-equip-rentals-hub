
import React from 'react';
import { AddressFormData } from '@/pages/CheckoutAddress';

interface PaymentSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress?: AddressFormData;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  tax,
  total,
  shippingAddress
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
      
      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-border my-2"></div>
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-foreground">Total Amount</span>
          <span className="text-lg font-semibold text-foreground">₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      {shippingAddress && (
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-md font-semibold text-foreground mb-2">Shipping to:</h3>
          <p className="text-sm text-muted-foreground">{shippingAddress.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {shippingAddress.addressLine1}, {shippingAddress.addressLine2 && `${shippingAddress.addressLine2}, `}
            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
          </p>
          <p className="text-sm text-muted-foreground">Mobile: {shippingAddress.mobileNumber}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
