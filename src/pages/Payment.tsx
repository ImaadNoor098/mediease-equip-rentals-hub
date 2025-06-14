import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { AddressFormData } from './CheckoutAddress';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const shippingAddress = location.state?.shippingAddress as AddressFormData | undefined;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      toast({
        title: "Payment Gateway Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive"
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const savings = cart.items.reduce((totalSavings, item) => {
    const retailPrice = item.retailPrice || (item.price / 0.85);
    return totalSavings + (retailPrice - item.price) * item.quantity;
  }, 0);
  
  const handlePaymentSelection = (value: string) => {
    setPaymentMethod(value);
  };

  const handleRazorpayPayment = () => {
    if (!razorpayLoaded) {
      toast({
        title: "Payment Gateway Loading",
        description: "Please wait for the payment gateway to load.",
        variant: "destructive"
      });
      return;
    }

    const options = {
      key: 'rzp_test_9999999999', // Replace with your Razorpay key ID
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      name: 'MediEaze',
      description: 'Medical Equipment Purchase',
      image: '/favicon.ico',
      prefill: {
        name: shippingAddress?.fullName || '',
        email: 'customer@example.com',
        contact: '9548160990'
      },
      notes: {
        address: shippingAddress ? `${shippingAddress.addressLine1}, ${shippingAddress.city}` : ''
      },
      theme: {
        color: '#3B82F6'
      },
      method: {
        upi: paymentMethod === 'upi',
        card: paymentMethod === 'razorpay',
        netbanking: paymentMethod === 'razorpay',
        wallet: paymentMethod === 'razorpay'
      },
      handler: function (response: any) {
        console.log('Payment successful:', response);
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });
        clearCart();
        navigate('/payment-success', { 
          state: { 
            method: paymentMethod === 'upi' ? 'UPI Payment' : 'Razorpay',
            total,
            savings,
            shippingAddress,
            paymentId: response.razorpay_payment_id
          } 
        });
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "destructive"
          });
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
    if (!shippingAddress) {
      toast({
        title: "Address Required",
        description: "Please provide a shipping address first.",
        variant: "destructive"
      });
      navigate('/checkout-address');
      return;
    }
    
    setLoading(true);
    
    console.log("Processing payment for:", { shippingAddress, paymentMethod, total });
    
    if (paymentMethod === 'cod') {
      setTimeout(() => {
        setLoading(false);
        clearCart();
        navigate('/payment-success', { 
          state: { 
            method: 'Cash on Delivery',
            total,
            savings,
            shippingAddress
          } 
        });
      }, 1500);
    } else if (paymentMethod === 'razorpay' || paymentMethod === 'upi') {
      handleRazorpayPayment();
      setLoading(false);
    }
  };
  
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
            
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Select Payment Method</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={handlePaymentSelection} className="gap-4">
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
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/checkout-address')}
                className="w-full sm:w-auto border-medieaze-600 text-medieaze-600 dark:text-medieaze-400 hover:bg-medieaze-50 dark:hover:bg-medieaze-900/20"
              >
                Back to Address
              </Button>
              <Button 
                onClick={handlePaymentProcess}
                disabled={!paymentMethod || loading || !shippingAddress}
                className="w-full sm:w-auto bg-medieaze-600 hover:bg-medieaze-700 min-w-[180px] py-3 text-base"
              >
                {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
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
