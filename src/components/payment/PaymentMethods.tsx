
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard } from "lucide-react";

interface PaymentMethodsProps {
  paymentMethod: string;
  onPaymentSelection: (value: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethod,
  onPaymentSelection
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Select Payment Method</h2>
      
      <RadioGroup value={paymentMethod} onValueChange={onPaymentSelection} className="gap-4">
        <Label htmlFor="razorpay" className={`flex items-center space-x-3 border border-border rounded-lg p-4 transition cursor-pointer ${paymentMethod === 'razorpay' ? 'border-medieaze-500 ring-2 ring-medieaze-500' : 'hover:border-medieaze-300'}`}>
          <RadioGroupItem value="razorpay" id="razorpay" />
          <CreditCard className="h-5 w-5 text-medieaze-600 dark:text-medieaze-400" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Razorpay (Cards, Netbanking, Wallets)</p>
            <p className="text-sm text-muted-foreground">Securely pay using Razorpay gateway.</p>
          </div>
          <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6 payment-logo" />
        </Label>
        
        <Label htmlFor="upi" className={`flex items-center space-x-3 border border-border rounded-lg p-4 transition cursor-pointer ${paymentMethod === 'upi' ? 'border-medieaze-500 ring-2 ring-medieaze-500' : 'hover:border-medieaze-300'}`}>
          <RadioGroupItem value="upi" id="upi" />
          <CreditCard className="h-5 w-5 text-medieaze-600 dark:text-medieaze-400" />
          <div className="flex-1">
            <p className="font-medium text-foreground">UPI Payment (GPay, PhonePe, Paytm)</p>
            <p className="text-sm text-muted-foreground">Pay directly with your UPI apps.</p>
          </div>
          <div className="flex space-x-1 payment-method-logos">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6 payment-logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6 payment-logo" />
          </div>
        </Label>
        
        <Label htmlFor="cod" className={`flex items-center space-x-3 border border-border rounded-lg p-4 transition cursor-pointer ${paymentMethod === 'cod' ? 'border-medieaze-500 ring-2 ring-medieaze-500' : 'hover:border-medieaze-300'}`}>
          <RadioGroupItem value="cod" id="cod" />
          <Banknote className="h-5 w-5 text-medieaze-600 dark:text-medieaze-400" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Cash on Delivery</p>
            <p className="text-sm text-muted-foreground">Pay when your equipment is delivered.</p>
          </div>
        </Label>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethods;
