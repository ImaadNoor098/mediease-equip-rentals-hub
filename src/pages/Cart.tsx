import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Trash, Plus, Minus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const isMobile = useIsMobile();

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    navigate('/checkout-address'); // Changed from /payment to /checkout-address
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalSavings = () => {
    return cart.items.reduce((savings, item) => {
      const retailPrice = item.retailPrice || (item.price / 0.85); // Assume 15% discount if retailPrice not present
      return savings + (retailPrice - item.price) * item.quantity;
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const totalSavings = calculateTotalSavings();


  if (cart.items.length === 0 && !isMobile) { // Added check for !isMobile for consistent empty cart display
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
        <main className="flex-grow flex flex-col items-center justify-center pt-16 text-center px-4">
          <img src="/placeholder.svg" alt="Empty Cart" className="w-48 h-48 mb-8 text-gray-400" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-medieaze-600 hover:bg-medieaze-700">Start Shopping</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {cart.items.length === 0 && isMobile ? ( // Mobile specific empty cart
            <div className="text-center py-12">
              <img src="/placeholder.svg" alt="Empty Cart" className="w-36 h-36 mx-auto mb-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-foreground mb-3">Your Cart is Empty</h1>
              <p className="text-md text-muted-foreground mb-6">
                Add some products to get started!
              </p>
              <Link to="/products">
                <Button className="bg-medieaze-600 hover:bg-medieaze-700 w-full sm:w-auto">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Your Shopping Cart</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg shadow-sm border border-border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img 
                        src={item.image || '/placeholder.svg'} 
                        alt={item.name} 
                        className="w-full sm:w-24 h-auto sm:h-24 object-contain rounded-md border border-border"
                      />
                      <div className="flex-grow">
                        <Link to={`/product/${item.id}`} className="hover:underline">
                          <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                        </Link>
                        <p className="text-sm text-muted-foreground capitalize">{item.purchaseType}</p>
                        <p className="text-base font-medium text-medieaze-600 dark:text-medieaze-400 mt-1">
                          ₹{item.price.toFixed(2)}
                          {item.purchaseType === 'rent' && ' /month'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2 sm:mt-0">
                        <div className="flex items-center border border-border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1 bg-card rounded-lg shadow-sm border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                       <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="text-sm">Total Savings</span>
                        <span className="text-sm font-medium">₹{totalSavings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="h-px bg-border my-3"></div>
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-lg font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full bg-medieaze-600 hover:bg-medieaze-700 py-3 text-base"
                    disabled={cart.items.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  {cart.items.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        clearCart();
                        toast({ title: "Cart Cleared", description: "All items have been removed from your cart." });
                      }} 
                      className="w-full mt-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50 hover:border-destructive"
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
