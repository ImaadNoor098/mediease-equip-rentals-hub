
import React from 'react';

interface ProductImageProps {
  image: string;
  name: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, name }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm p-6">
      <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default ProductImage;
