
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';

const ProductNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-6">
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold text-medieaze-900 mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
      <Button 
        onClick={() => navigate('/products')}
        className="bg-medieaze-600 hover:bg-medieaze-700"
      >
        Browse All Products
      </Button>
    </div>
  );
};

export default ProductNotFound;
