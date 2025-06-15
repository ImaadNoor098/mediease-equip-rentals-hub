
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductDetailTabsProps {
  category?: string;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ category = "Medical Equipment" }) => {
  const isMobile = useIsMobile();

  const tabsData = [
    {
      value: "details",
      label: "Details & Specifications",
      content: (
        <div>
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
                  <span>{category}</span>
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
        </div>
      )
    },
    {
      value: "shipping",
      label: "Shipping & Returns",
      content: (
        <div>
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
        </div>
      )
    },
    {
      value: "care",
      label: "Care Instructions",
      content: (
        <div>
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
        </div>
      )
    }
  ];

  if (isMobile) {
    return (
      <div className="mt-12">
        <Carousel className="w-full max-w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Product Information</h2>
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {tabsData.map((tab) => (
              <CarouselItem key={tab.value}>
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                  {tab.content}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <Tabs defaultValue="details">
        <TabsList className="w-full border-b border-gray-200 mb-6">
          <TabsTrigger value="details" className="text-lg py-3">Details & Specifications</TabsTrigger>
          <TabsTrigger value="shipping" className="text-lg py-3">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="care" className="text-lg py-3">Care Instructions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          {tabsData[0].content}
        </TabsContent>
        
        <TabsContent value="shipping" className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          {tabsData[1].content}
        </TabsContent>
        
        <TabsContent value="care" className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          {tabsData[2].content}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailTabs;
