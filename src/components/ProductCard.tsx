
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform hover:scale-105" 
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Rent:</span> 
            <span className="text-mediease-700"> ₹{product.rentPrice}/month</span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Buy:</span> 
            <span className="text-mediease-700"> ₹{product.buyPrice}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${product.id}`} className="w-full">
          <Button variant="default" className="w-full bg-mediease-600 hover:bg-mediease-700">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
