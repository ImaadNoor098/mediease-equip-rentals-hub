
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  className?: string;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ className = '', onItemClick }) => {
  return (
    <div className={`flex ${className}`}>
      <Link
        to="/"
        className="text-foreground hover:text-medieaze-600 transition-colors px-4"
        onClick={onItemClick}
      >
        Home
      </Link>
      <Link
        to="/products"
        className="text-foreground hover:text-medieaze-600 transition-colors px-4"
        onClick={onItemClick}
      >
        Products
      </Link>
      <Link
        to="/about"
        className="text-foreground hover:text-medieaze-600 transition-colors px-4"
        onClick={onItemClick}
      >
        About Us
      </Link>
      <Link
        to="/contact"
        className="text-foreground hover:text-medieaze-600 transition-colors px-4"
        onClick={onItemClick}
      >
        Contact
      </Link>
    </div>
  );
};

export default Navigation;
