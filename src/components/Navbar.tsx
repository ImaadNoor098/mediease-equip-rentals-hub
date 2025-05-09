
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
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
            <Link to="/" className="text-gray-600 hover:text-medieaze-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-medieaze-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-medieaze-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-medieaze-600 transition-colors">
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
                className="w-64 mr-2 focus:border-medieaze-500 focus:ring-medieaze-500"
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

          {/* Cart Icon */}
          <div className="flex items-center">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-medieaze-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-2 p-2 text-gray-600"
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
                className="text-gray-600 hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-medieaze-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-medieaze-600 transition-colors"
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
                  className="w-full mr-2"
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

export default Navbar;
