import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CartItem } from '@/types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, addItem } = useCart();
  const productImageRef = useRef<HTMLDivElement>(null);
  
  const product = getProductById(id || '');
  const [purchaseType, setPurchaseType] = useState<'rent' | 'buy'>('rent');
  const [quantity, setQuantity] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [existingCartItemInfo, setExistingCartItemInfo] = useState<{ name: string; existingQuantity: number; purchaseType: 'rent' | 'buy', newQuantity: number } | null>(null);
  
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

  const performAddToCart = () => {
    const price = purchaseType === 'rent' ? product.rentPrice : product.buyPrice;
    
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price,
      quantity,
      purchaseType,
      description: product.description,
      category: product.category
    });

    if (window.animateProductToCart && productImageRef.current) {
      const rect = productImageRef.current.getBoundingClientRect();
      window.animateProductToCart(
        product.image, 
        { x: rect.left + rect.width/2, y: rect.top + rect.height/2 }
      );
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity} ${quantity > 1 ? 'units' : 'unit'}) has been added/updated in your cart.`,
    });
    setQuantity(1);
  };
  
  const handleAddToCartAttempt = () => {
    // No authentication check - allow adding to cart without login
    const existingItem = cart.items.find(
      (item) => item.productId === product.id && item.purchaseType === purchaseType
    );

    if (existingItem) {
      setExistingCartItemInfo({
        name: product.name,
        existingQuantity: existingItem.quantity,
        purchaseType: purchaseType,
        newQuantity: quantity
      });
      setShowConfirmDialog(true);
    } else {
      performAddToCart();
    }
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
            <div ref={productImageRef}>
              <ProductImage image={product.image} name={product.name} />
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm">
              <ProductHeader 
                name={product.name} 
                category={product.category} 
                available={product.available} 
                description={product.description} 
              />
              
              <PurchaseOptions
                rentPrice={product.rentPrice}
                buyPrice={product.buyPrice}
                purchaseType={purchaseType}
                onChange={setPurchaseType}
              />
              
              <QuantitySelector 
                quantity={quantity}
                onChange={setQuantity}
              />
              
              <Button 
                onClick={handleAddToCartAttempt}
                disabled={!product.available}
                className="w-full bg-mediease-600 hover:bg-mediease-700 dark:hover:bg-mediease-500 text-white font-bold py-6 text-lg shadow-md border-2 border-mediease-500 dark:border-mediease-400"
              >
                {product.available ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
          
          <div className="mt-12">
            <ProductDetailTabs category={product.category} />
          </div>
        </div>
      </main>
      <Footer />

      {/* Existing Item Confirmation Dialog */}
      {existingCartItemInfo && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Item Already in Cart</AlertDialogTitle>
              <AlertDialogDescription>
                You already have {existingCartItemInfo.existingQuantity} unit(s) of {existingCartItemInfo.name} ({existingCartItemInfo.purchaseType}) in your cart. 
                Do you want to add {existingCartItemInfo.newQuantity} more unit(s)?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setExistingCartItemInfo(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                performAddToCart();
                setExistingCartItemInfo(null);
              }}>
                Yes, Add More
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ProductDetail;
