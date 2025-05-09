import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  
  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, Math.max(1, quantity));
  };
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before proceeding to checkout.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to payment page
    navigate('/payment');
  };
  
  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };
  
  // GST tax calculation (18%)
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-mediease-900 mb-6">Your Cart</h1>
          
          {cart.items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-mediease-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/products">
                <Button className="bg-mediease-600 hover:bg-mediease-700 px-8">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                      <div key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          {/* Product Image */}
                          <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-md flex-shrink-0 mb-4 sm:mb-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-grow sm:ml-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-mediease-900">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                  {item.purchaseType === 'rent' ? 'Rental' : 'Purchase'}
                                </p>
                                <p className="font-medium text-mediease-700">
                                  ₹{item.price}{item.purchaseType === 'rent' ? '/month' : ''}
                                </p>
                              </div>
                              
                              <div className="flex items-center mt-4 sm:mt-0">
                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-200 rounded-md">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    className="h-8 w-12 border-0 text-center"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                                
                                {/* Remove Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8"
                                  onClick={() => removeItem(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Cart Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/products')}
                    className="border-mediease-600 text-mediease-600 hover:bg-mediease-50"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => clearCart()}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-mediease-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium">₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-mediease-900">Total</span>
                      <span className="text-lg font-semibold text-mediease-900">₹{total.toFixed(2)}</span>
                    </div>
                    
                    {cart.items.some(item => item.purchaseType === 'rent') && (
                      <p className="text-sm text-gray-500 mt-2">
                        *Rental items are billed monthly. Security deposit applies.
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-mediease-600 hover:bg-mediease-700 py-6 text-lg flex items-center justify-center"
                  >
                    Proceed to Checkout <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
