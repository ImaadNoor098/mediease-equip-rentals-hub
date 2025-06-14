
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartButton: React.FC = () => {
  const { cart } = useCart();
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const prevTotalItems = useRef(cart.totalItems);
  
  // Handle cart animation when items are added or quantity increases
  useEffect(() => {
    if (cart.totalItems > prevTotalItems.current) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => {
        setIsCartAnimating(false);
      }, 500);
      
      prevTotalItems.current = cart.totalItems;
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = cart.totalItems;
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
    <div className="relative p-2" ref={cartButtonRef}>
      <Link to="/cart">
        <div className={`${isCartAnimating ? 'animate-cart-bounce' : ''} transition-all relative`}>
          <ShoppingCart className="h-6 w-6 text-foreground" />
          {cart.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold min-w-[20px] shadow-lg border-2 border-white">
              {cart.totalItems > 99 ? '99+' : cart.totalItems}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

// Add TypeScript declaration for global window object
declare global {
  interface Window {
    animateProductToCart: (productImgSrc: string, startCoords: { x: number, y: number }) => void;
  }
}

export default CartButton;
