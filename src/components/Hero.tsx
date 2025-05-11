
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
import Autoplay from 'embla-carousel-autoplay';
import { useIsMobile } from '@/hooks/use-mobile';

const medicalImages = [
  "/medical-equipment-1.jpg",
  "/medical-equipment-2.jpg",
  "/medical-equipment-3.jpg",
  "/medical-equipment-4.jpg"
];

const Hero: React.FC = () => {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  
  const isMobile = useIsMobile();

  return (
    <div className="relative bg-medieaze-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-medieaze-900 dark:text-white leading-tight">
                Quality Healthcare Equipment at Affordable Prices
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                MediEaze makes healthcare accessible by offering premium medical equipment for rent or purchase. 
                Save money while getting the care you deserve.
              </p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button className="bg-medieaze-600 hover:bg-medieaze-700 text-white px-6 md:px-8 py-2 md:py-2.5 text-base md:text-lg w-full sm:w-auto">
                    Browse Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-medieaze-600 text-medieaze-600 dark:text-medieaze-400 hover:bg-medieaze-50 dark:hover:bg-medieaze-900/20 px-6 md:px-8 py-2 md:py-2.5 text-base md:text-lg w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="mt-6 md:mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800 overflow-hidden">
                      <img 
                        src={`/customer-${i}.jpg`} 
                        alt={`Customer ${i}`}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">500+</span> satisfied customers
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto pt-6 md:pt-0">
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-medieaze-200 dark:bg-medieaze-800/30 rounded-full opacity-50"></div>
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-medieaze-300 dark:bg-medieaze-700/30 rounded-full opacity-30"></div>
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
                <div className={`rounded-md overflow-hidden ${isMobile ? 'h-64' : 'h-80'} flex items-center justify-center`}>
                  <Carousel 
                    className="w-full h-full" 
                    opts={{ loop: true, duration: 10 }}
                    plugins={[autoplayPlugin.current]}
                  >
                    <CarouselContent>
                      {medicalImages.map((src, index) => (
                        <CarouselItem key={index}>
                          <div className="h-full w-full p-1">
                            <div className="flex items-center justify-center p-2 h-full w-full">
                              <img 
                                src={src} 
                                alt={`Medical Equipment ${index + 1}`} 
                                className="max-h-full max-w-full object-contain rounded-md"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-white dark:bg-gray-700 dark:text-white" />
                    <CarouselNext className="right-2 bg-white dark:bg-gray-700 dark:text-white" />
                  </Carousel>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="bg-medieaze-50 dark:bg-medieaze-900/50 p-2 md:p-3 rounded-md flex items-center justify-center">
                    <span className="text-medieaze-700 dark:text-medieaze-300 text-xs md:text-sm font-medium">Oxygen</span>
                  </div>
                  <div className="bg-medieaze-50 dark:bg-medieaze-900/50 p-2 md:p-3 rounded-md flex items-center justify-center">
                    <span className="text-medieaze-700 dark:text-medieaze-300 text-xs md:text-sm font-medium">Mobility</span>
                  </div>
                  <div className="bg-medieaze-50 dark:bg-medieaze-900/50 p-2 md:p-3 rounded-md flex items-center justify-center">
                    <span className="text-medieaze-700 dark:text-medieaze-300 text-xs md:text-sm font-medium">Beds</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-medieaze-700 dark:text-medieaze-400 font-medium italic text-sm md:text-base border-t border-b border-medieaze-100 dark:border-medieaze-800/30 py-2">
                    "Your Health, Our Priority — Your Hygiene, Our Promise"
                  </p>
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
