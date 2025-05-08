
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-mediease-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-mediease-900 leading-tight">
                Quality Healthcare Equipment at Affordable Prices
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                MediEase makes healthcare accessible by offering premium medical equipment for rent or purchase. 
                Save money while getting the care you deserve.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button className="bg-mediease-600 hover:bg-mediease-700 text-white px-8 py-2.5 text-lg">
                    Browse Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-mediease-600 text-mediease-600 hover:bg-mediease-50 px-8 py-2.5 text-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">500+</span> satisfied customers
                </p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-mediease-200 rounded-full opacity-50"></div>
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-mediease-300 rounded-full opacity-30"></div>
              <div className="relative z-10 bg-white rounded-lg shadow-xl p-4 md:p-6">
                <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <h3 className="text-xl font-bold text-mediease-700">Healthcare Equipment</h3>
                      <p className="mt-2 text-gray-600">Rent or Buy Quality Products</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="bg-mediease-50 p-3 rounded-md flex items-center justify-center">
                    <span className="text-mediease-700 text-sm font-medium">Oxygen</span>
                  </div>
                  <div className="bg-mediease-50 p-3 rounded-md flex items-center justify-center">
                    <span className="text-mediease-700 text-sm font-medium">Mobility</span>
                  </div>
                  <div className="bg-mediease-50 p-3 rounded-md flex items-center justify-center">
                    <span className="text-mediease-700 text-sm font-medium">Beds</span>
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
