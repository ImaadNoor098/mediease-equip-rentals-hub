import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const product = getProductById(id || '');
  const [purchaseType, setPurchaseType] = useState<'rent' | 'buy'>('rent');
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="mb-6">
              <BackButton />
            </div>
            <h1 className="text-3xl font-bold text-mediease-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-mediease-600 hover:bg-mediease-700"
            >
              Browse All Products
            </Button>
          </div>
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
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm p-6">
              <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold text-mediease-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-mediease-100 text-mediease-700 text-sm font-medium rounded-full">
                  {product.category}
                </span>
                {product.available ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {/* Purchase Options */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Select Option</h3>
                <RadioGroup 
                  defaultValue="rent"
                  value={purchaseType}
                  onValueChange={(value) => setPurchaseType(value as 'rent' | 'buy')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="border border-gray-200 rounded-lg p-4 relative">
                    <RadioGroupItem 
                      value="rent" 
                      id="rent" 
                      className="absolute top-4 right-4"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="rent" className="text-lg font-medium">Rent</Label>
                      <p className="text-mediease-700 font-semibold text-xl">₹{product.rentPrice}/month</p>
                      <p className="text-gray-500 text-sm">Perfect for temporary needs</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 relative">
                    <RadioGroupItem 
                      value="buy" 
                      id="buy" 
                      className="absolute top-4 right-4"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="buy" className="text-lg font-medium">Buy</Label>
                      <p className="text-mediease-700 font-semibold text-xl">₹{product.buyPrice}</p>
                      <p className="text-gray-500 text-sm">Own it permanently</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Quantity</h3>
                <div className="flex items-center">
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <Input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 mx-2 text-center"
                  />
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart}
                disabled={!product.available}
                className="w-full bg-mediease-600 hover:bg-mediease-700 py-6 text-lg"
              >
                {product.available ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
          
          {/* Additional Information Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="details">
              <TabsList className="w-full border-b border-gray-200 mb-6">
                <TabsTrigger value="details" className="text-lg py-3">Details & Specifications</TabsTrigger>
                <TabsTrigger value="shipping" className="text-lg py-3">Shipping & Returns</TabsTrigger>
                <TabsTrigger value="care" className="text-lg py-3">Care Instructions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>High-quality medical-grade materials</li>
                      <li>Thoroughly sanitized before delivery</li>
                      <li>Meets all industry safety standards</li>
                      <li>Comes with user manual and instructions</li>
                      <li>Technical support available</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Specifications</h4>
                    <div className="divide-y divide-gray-100">
                      <div className="py-2 grid grid-cols-2">
                        <span className="text-gray-600">Category</span>
                        <span>{product.category}</span>
                      </div>
                      <div className="py-2 grid grid-cols-2">
                        <span className="text-gray-600">Warranty</span>
                        <span>1 Year (Purchase only)</span>
                      </div>
                      <div className="py-2 grid grid-cols-2">
                        <span className="text-gray-600">Condition</span>
                        <span>New/Refurbished</span>
                      </div>
                      <div className="py-2 grid grid-cols-2">
                        <span className="text-gray-600">Support</span>
                        <span>24/7 Technical Assistance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Delivery</h4>
                    <p className="text-gray-600">For most of our medical equipment, we offer delivery within 24-48 hours of order confirmation. Delivery timeframes may vary based on your location and product availability. For urgent needs, please contact our customer service.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Installation</h4>
                    <p className="text-gray-600">Our delivery team will set up and install your equipment at no additional charge. They will also demonstrate how to properly use the equipment.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Returns</h4>
                    <p className="text-gray-600">For purchased items, we offer a 15-day return policy from the date of delivery. The product must be in its original condition. For rented items, you can cancel the rental agreement within 24 hours of delivery.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="care" className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Care Instructions</h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Proper care and maintenance of medical equipment is essential for both safety and longevity. Here are some general guidelines for caring for your equipment:
                  </p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Cleaning</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Clean surfaces regularly with approved disinfectants</li>
                      <li>Follow the specific cleaning instructions provided with your equipment</li>
                      <li>Ensure the equipment is turned off and unplugged before cleaning electrical components</li>
                      <li>Allow equipment to dry completely before using again</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Maintenance</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Check all parts regularly for wear and damage</li>
                      <li>Tighten loose screws and bolts as needed</li>
                      <li>Lubricate moving parts as recommended</li>
                      <li>For rented items, contact us if maintenance is needed</li>
                      <li>For purchased items, follow the maintenance schedule in the user manual</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-600">
                    For specific care instructions related to this product, please refer to the user manual provided or contact our support team.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
