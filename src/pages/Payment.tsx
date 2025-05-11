
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  // Calculate totals
  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const savings = cart.items.reduce((total, item) => {
    if (item.purchaseType === 'rent') {
      // Assume buying would cost 10x the monthly rent
      return total + ((item.price * 10) - (item.price * item.quantity));
    }
    // For purchased items, assume 15% discount from retail
    return total + ((item.price / 0.85) - item.price) * item.quantity;
  }, 0);
  
  const handlePaymentSelection = (value: string) => {
    setPaymentMethod(value);
  };
  
  const handlePaymentProcess = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    if (paymentMethod === 'cod') {
      // Simulate processing for Cash on Delivery
      setTimeout(() => {
        setLoading(false);
        navigate('/payment-success', { 
          state: { 
            method: 'Cash on Delivery',
            total,
            savings
          } 
        });
      }, 1500);
    } else {
      // Handle online payment (Razorpay)
      try {
        // Simulating Razorpay integration
        toast({
          title: "Redirecting to Razorpay",
          description: "In a real implementation, you would be redirected to the Razorpay payment page."
        });
        
        // Simulate successful payment
        setTimeout(() => {
          setLoading(false);
          navigate('/payment-success', { 
            state: { 
              method: paymentMethod === 'razorpay' ? 'Razorpay' : 'Online Payment',
              total,
              savings
            } 
          });
        }, 2000);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Payment Failed",
          description: "There was a problem processing your payment. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={() => {}} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Choose Payment Method</h1>
            
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden p-4 md:p-6 mb-6">
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
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-lg font-semibold text-foreground">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden p-4 md:p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Payment Methods</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={handlePaymentSelection} className="gap-4">
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 transition hover:border-medieaze-500">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-medieaze-600 dark:text-medieaze-400" />
                        <div>
                          <p className="font-medium text-foreground">Razorpay (Recommended)</p>
                          <p className="text-sm text-muted-foreground">Fast and secure payment gateway</p>
                        </div>
                      </div>
                      <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6 payment-logo" />
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 transition hover:border-medieaze-500">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-medieaze-600 dark:text-medieaze-400" />
                        <div>
                          <p className="font-medium text-foreground">UPI Payment</p>
                          <p className="text-sm text-muted-foreground">Pay with GPay, PhonePe, Paytm</p>
                        </div>
                      </div>
                      <div className="flex space-x-1 payment-method-logos">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6 payment-logo" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6 payment-logo" />
                      </div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 transition hover:border-medieaze-500">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Banknote className="h-5 w-5 text-medieaze-600 dark:text-medieaze-400" />
                      <div>
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when your equipment is delivered</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/cart')}
                className="border-medieaze-600 text-medieaze-600 dark:text-medieaze-400 hover:bg-medieaze-50 dark:hover:bg-medieaze-900/20"
              >
                Back to Cart
              </Button>
              <Button 
                onClick={handlePaymentProcess}
                disabled={!paymentMethod || loading}
                className="bg-medieaze-600 hover:bg-medieaze-700 min-w-[180px]"
              >
                {loading ? "Processing..." : "Make Payment"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
