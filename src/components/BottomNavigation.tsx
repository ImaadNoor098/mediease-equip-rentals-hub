
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingCart, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const [lastVisitedPage, setLastVisitedPage] = useState('/');
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  // Track last visited page (excluding current home page)
  useEffect(() => {
    if (location.pathname !== '/') {
      setLastVisitedPage(location.pathname);
    }
  }, [location.pathname]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    setClickCount(prev => prev + 1);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (clickCount === 0) {
        // Single click - go to last visited page or home if already on home
        if (location.pathname === '/') {
          navigate(lastVisitedPage);
        } else {
          navigate(lastVisitedPage);
        }
      } else if (clickCount === 1) {
        // Double click - always go to home
        navigate('/');
      }
      setClickCount(0);
    }, 300);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-12 py-3">
          {/* Home Button */}
          <button
            onClick={handleHomeClick}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              isActive('/') 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Home</span>
          </button>

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
