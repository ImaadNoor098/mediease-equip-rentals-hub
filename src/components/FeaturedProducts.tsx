
import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { getFeaturedProducts } from '@/data/products';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = getFeaturedProducts();
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-mediease-900">Featured Products</h2>
            <p className="mt-2 text-gray-600">Our most popular equipment available for rent or purchase</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
