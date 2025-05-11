
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, ShoppingCart, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Reset menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Cart animation when items added
  useEffect(() => {
    if (cart.totalItems > 0) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => {
        setIsCartAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cart.totalItems]);

  // Function for product to cart animation
  const animateProductToCart = (productImgSrc: string, startCoords: { x: number, y: number }) => {
    if (!cartButtonRef.current) return;
    
    const cartRect = cartButtonRef.current.getBoundingClientRect();
    const targetX = cartRect.x + cartRect.width / 2;
    const targetY = cartRect.y + cartRect.height / 2;
    
    const animatedElement = document.createElement('div');
    animatedElement.className = 'product-to-cart';
    animatedElement.style.cssText = `
      left: ${startCoords.x}px;
      top: ${startCoords.y}px;
      width: 50px;
      height: 50px;
      background-image: url(${productImgSrc});
      background-size: cover;
    `;

    document.body.appendChild(animatedElement);
    
    // Force reflow
    void animatedElement.offsetWidth;
    
    // Apply custom properties for the animation target
    animatedElement.style.setProperty('--target-x', `${targetX - startCoords.x}px`);
    animatedElement.style.setProperty('--target-y', `${targetY - startCoords.y}px`);
    animatedElement.classList.add('animate');
    
    setTimeout(() => {
      document.body.removeChild(animatedElement);
      setIsCartAnimating(true);
      setTimeout(() => setIsCartAnimating(false), 500);
    }, 700);
  };

  // Add to window to allow other components to trigger animation
  useEffect(() => {
    window.animateProductToCart = animateProductToCart;
    return () => {
      delete window.animateProductToCart;
    };
  }, []);

  return (
    <nav className="bg-background shadow fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-medieaze-600">
              Medi<span className="text-medieaze-800">Eaze</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-medieaze-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-medieaze-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-medieaze-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground hover:text-medieaze-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 mr-2 focus:border-medieaze-500 focus:ring-medieaze-500 bg-background"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="h-10 w-10 text-medieaze-600"
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Cart Icon - FIX: Using a div with ref instead of trying to apply ref to Link */}
          <div className="flex items-center">
            <div className="relative p-2" ref={cartButtonRef}>
              <Link to="/cart">
                <div className={`${isCartAnimating ? 'animate-cart-bounce' : ''} transition-all`}>
                  <ShoppingCart className="h-6 w-6 text-foreground" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-medieaze-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {cart.totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-2 p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-foreground hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center mt-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full mr-2 bg-background"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 text-medieaze-600"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Add TypeScript declaration for global window object
declare global {
  interface Window {
    animateProductToCart: (productImgSrc: string, startCoords: { x: number, y: number }) => void;
  }
}

export default Navbar;
