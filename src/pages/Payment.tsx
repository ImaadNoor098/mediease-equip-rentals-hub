
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Cash, CreditCard, Check } from "lucide-react";
import { toast } from '@/hooks/use-toast';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
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
        // In a real implementation, you would use the Razorpay SDK
        const options = {
          key: "rzp_test_YOUR_KEY_HERE", // This would be your actual Razorpay key
          amount: total * 100, // Amount in paise
          currency: "INR",
          name: "MediEase",
          description: "Payment for medical equipment",
          handler: function() {
            setLoading(false);
            navigate('/payment-success', { 
              state: { 
                method: paymentMethod === 'razorpay' ? 'Razorpay' : 'Online Payment',
                total,
                savings
              } 
            });
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#3399cc"
          }
        };
        
        // Mock Razorpay checkout
        // In reality, you'd load the Razorpay script and call new Razorpay(options).open()
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
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-mediease-900 mb-6">Choose Payment Method</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6 mb-6">
              <h2 className="text-xl font-semibold text-mediease-900 mb-4">Order Summary</h2>
              
              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-mediease-900">Total</span>
                  <span className="text-lg font-semibold text-mediease-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6 mb-6">
              <h2 className="text-xl font-semibold text-mediease-900 mb-4">Payment Methods</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={handlePaymentSelection} className="gap-4">
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4 transition hover:border-mediease-500">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-mediease-600" />
                        <div>
                          <p className="font-medium">Razorpay (Recommended)</p>
                          <p className="text-sm text-gray-500">Fast and secure payment gateway</p>
                        </div>
                      </div>
                      <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6" />
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4 transition hover:border-mediease-500">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-mediease-600" />
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-500">Pay with GPay, PhonePe, Paytm</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6" />
                      </div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4 transition hover:border-mediease-500">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Cash className="h-5 w-5 text-mediease-600" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when your equipment is delivered</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/cart')}
                className="border-mediease-600 text-mediease-600 hover:bg-mediease-50"
              >
                Back to Cart
              </Button>
              <Button 
                onClick={handlePaymentProcess}
                disabled={!paymentMethod || loading}
                className="bg-mediease-600 hover:bg-mediease-700 min-w-[180px]"
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
