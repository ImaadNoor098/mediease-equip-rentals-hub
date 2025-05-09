
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductImageProps {
  image: string;
  name: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, name }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm p-6">
      <AspectRatio ratio={1} className="bg-gray-50 rounded-md">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={(e) => {
            // If the image fails to load, replace with a placeholder
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </AspectRatio>
    </div>
  );
};

export default ProductImage;
