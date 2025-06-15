
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-16 py-3">
          {/* Profile Button */}
          <Link 
            to={isAuthenticated ? "/settings" : "/login"}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActive('/settings') || isActive('/login') 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User size={24} />
            <span className="text-xs font-medium">Profile</span>
          </Link>

          {/* Cart Button */}
          <Link 
            to="/cart"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors relative ${
              isActive('/cart') 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold min-w-[20px] shadow-lg border-2 border-white">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
