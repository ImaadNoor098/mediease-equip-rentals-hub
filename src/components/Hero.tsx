
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const medicalImages = [
  "/medical-equipment-1.jpg",
  "/medical-equipment-2.jpg",
  "/medical-equipment-3.jpg",
  "/medical-equipment-4.jpg"
];

const Hero: React.FC = () => {
  return (
    <div className="relative bg-medieaze-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-medieaze-900 leading-tight">
                Quality Healthcare Equipment at Affordable Prices
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                MediEaze makes healthcare accessible by offering premium medical equipment for rent or purchase. 
                Save money while getting the care you deserve.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button className="bg-medieaze-600 hover:bg-medieaze-700 text-white px-8 py-2.5 text-lg">
                    Browse Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-medieaze-600 text-medieaze-600 hover:bg-medieaze-50 px-8 py-2.5 text-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                      <img 
                        src={`/customer-${i}.jpg`} 
                        alt={`Customer ${i}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">500+</span> satisfied customers
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-medieaze-200 rounded-full opacity-50"></div>
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-medieaze-300 rounded-full opacity-30"></div>
              <div className="relative z-10 bg-white rounded-lg shadow-xl p-4 md:p-6">
                <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
                  <Carousel className="w-full h-full" opts={{ loop: true, duration: 10 }}>
                    <CarouselContent>
                      {medicalImages.map((src, index) => (
                        <CarouselItem key={index}>
                          <div className="h-full w-full p-1">
                            <div className="flex aspect-[4/3] items-center justify-center p-2 h-full w-full">
                              <img 
                                src={src} 
                                alt={`Medical Equipment ${index + 1}`} 
                                className="h-full w-full object-cover rounded-md"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-white" />
                    <CarouselNext className="right-2 bg-white" />
                  </Carousel>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="bg-medieaze-50 p-3 rounded-md flex items-center justify-center">
                    <span className="text-medieaze-700 text-sm font-medium">Oxygen</span>
                  </div>
                  <div className="bg-medieaze-50 p-3 rounded-md flex items-center justify-center">
                    <span className="text-medieaze-700 text-sm font-medium">Mobility</span>
                  </div>
                  <div className="bg-medieaze-50 p-3 rounded-md flex items-center justify-center">
                    <span className="text-medieaze-700 text-sm font-medium">Beds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
