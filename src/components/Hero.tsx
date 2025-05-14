
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
// Removed useIsMobile as it's not currently used for layout here

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
  
  return (
    <div className="relative bg-medieaze-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content Column */}
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
              
              <div className="mt-6 md:mt-8 flex items-center gap-6">
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
            
            {/* Image Slider Column - Reverted to previous structure */}
            <div className="relative h-auto md:h-auto pt-6 md:pt-0 flex items-center justify-center lg:justify-end">
              {/* Decorative circles - optional, can be removed if not desired */}
              <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-medieaze-200 dark:bg-medieaze-800/30 rounded-full opacity-30 transform translate-x-1/4 translate-y-1/4"></div>
              <div className="absolute -top-10 -right-0 w-56 h-56 bg-medieaze-300 dark:bg-medieaze-700/30 rounded-full opacity-20  transform -translate-x-1/4 -translate-y-1/4"></div>
              
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 md:p-4 w-full max-w-sm mx-auto">
                <div className="rounded-md overflow-hidden flex items-center justify-center aspect-square">
                  <Carousel 
                    className="w-full h-full" 
                    opts={{ loop: true, duration: 10 }}
                    plugins={[autoplayPlugin.current]}
                  >
                    <CarouselContent className="h-full">
                      {medicalImages.map((src, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="h-full w-full flex items-center justify-center p-1">
                            <img 
                              src={src} 
                              alt={`Medical Equipment ${index + 1}`} 
                              className="max-h-full max-w-full object-contain rounded-md"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Using smaller buttons for a more compact look */}
                    <CarouselPrevious className="left-1 bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-white h-7 w-7" />
                    <CarouselNext className="right-1 bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-white h-7 w-7" />
                  </Carousel>
                </div>
                <div className="mt-3 md:mt-4">
                  <p className="font-medium italic text-center text-xs md:text-sm py-2 px-2 bg-gradient-to-r from-medieaze-100 via-medieaze-50 to-medieaze-100 dark:from-medieaze-900/60 dark:via-medieaze-800/60 dark:to-medieaze-900/60 rounded-md text-medieaze-800 dark:text-medieaze-200 border-l-2 border-r-2 border-medieaze-400 dark:border-medieaze-400">
                    "Your Health, Our Priority"
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
