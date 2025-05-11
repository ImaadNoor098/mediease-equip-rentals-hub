
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleQuickAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the position for animation
    const cardElement = e.currentTarget.closest('.product-card');
    if (!cardElement) return;
    
    const rect = cardElement.getBoundingClientRect();
    const imageElement = cardElement.querySelector('img');
    if (!imageElement) return;
    
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 4;
    
    // Add item to cart
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.rentPrice,
      quantity: 1,
      purchaseType: 'rent'
    });
    
    // Animate the product to cart
    if (window.animateProductToCart) {
      window.animateProductToCart(product.image, { x: startX, y: startY });
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col product-card bg-card text-card-foreground">
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105" 
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-foreground">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-foreground">
              <span className="font-medium">Rent:</span> 
              <span className="text-mediease-700 dark:text-mediease-400"> ₹{product.rentPrice}/month</span>
            </p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Buy:</span> 
              <span className="text-mediease-700 dark:text-mediease-400"> ₹{product.buyPrice}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="default" className="flex-1 bg-mediease-600 hover:bg-mediease-700 text-white">
            View Details
          </Button>
          <Button 
            variant="secondary" 
            className="flex-none w-10 bg-secondary text-secondary-foreground"
            onClick={handleQuickAddToCart}
          >
            +
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
