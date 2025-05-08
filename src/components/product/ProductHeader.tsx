
import React from 'react';

interface ProductHeaderProps {
  name: string;
  category: string;
  available: boolean;
  description: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  name, 
  category, 
  available, 
  description 
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-mediease-900 mb-2">{name}</h1>
      <div className="flex items-center space-x-2 mb-4">
        <span className="px-3 py-1 bg-mediease-100 text-mediease-700 text-sm font-medium rounded-full">
          {category}
        </span>
        {available ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            In Stock
          </span>
        ) : (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            Out of Stock
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
    </>
  );
};

export default ProductHeader;
