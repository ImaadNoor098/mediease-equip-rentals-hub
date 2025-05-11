
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import ProductNotFound from '@/components/ProductNotFound';
import ProductImage from '@/components/product/ProductImage';
import ProductHeader from '@/components/product/ProductHeader';
import PurchaseOptions from '@/components/product/PurchaseOptions';
import QuantitySelector from '@/components/product/QuantitySelector';
import ProductDetailTabs from '@/components/product/ProductDetailTabs';
import { toast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const productImageRef = useRef<HTMLDivElement>(null);
  
  const product = getProductById(id || '');
  const [purchaseType, setPurchaseType] = useState<'rent' | 'buy'>('rent');
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
        <main className="flex-grow pt-24 pb-16">
          <ProductNotFound />
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    const price = purchaseType === 'rent' ? product.rentPrice : product.buyPrice;
    
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price,
      quantity,
      purchaseType
    });

    // Start animation
    if (window.animateProductToCart && productImageRef.current) {
      const rect = productImageRef.current.getBoundingClientRect();
      window.animateProductToCart(
        product.image, 
        { x: rect.left + rect.width/2, y: rect.top + rect.height/2 }
      );
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <BackButton />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div ref={productImageRef}>
              <ProductImage image={product.image} name={product.name} />
            </div>
            
            {/* Product Details */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <ProductHeader 
                name={product.name} 
                category={product.category} 
                available={product.available} 
                description={product.description} 
              />
              
              {/* Purchase Options */}
              <PurchaseOptions
                rentPrice={product.rentPrice}
                buyPrice={product.buyPrice}
                purchaseType={purchaseType}
                onChange={setPurchaseType}
              />
              
              {/* Quantity Selector */}
              <QuantitySelector 
                quantity={quantity}
                onChange={setQuantity}
              />
              
              {/* Add to Cart Button - With higher contrast and visibility */}
              <Button 
                ref={addToCartButtonRef}
                onClick={handleAddToCart}
                disabled={!product.available}
                className="w-full bg-medieaze-600 hover:bg-medieaze-700 dark:hover:bg-medieaze-500 py-6 text-lg text-white shadow-md"
              >
                {product.available ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
          
          {/* Additional Information Tabs */}
          <div className="mt-12">
            <ProductDetailTabs category={product.category} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
