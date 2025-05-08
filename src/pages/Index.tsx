
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import HowItWorks from '@/components/HowItWorks';

const Index = () => {
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} />
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedProducts />
        <HowItWorks />
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-mediease-900">What Our Customers Say</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Read about experiences from people who have used our services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-mediease-50 p-6 rounded-lg border border-mediease-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-mediease-200 flex items-center justify-center text-mediease-700 font-bold text-xl">
                    R
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Delhi</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Renting an oxygen concentrator for my father was so easy with MediEase. The equipment was in excellent condition and their service was prompt. Highly recommended!"
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-mediease-50 p-6 rounded-lg border border-mediease-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-mediease-200 flex items-center justify-center text-mediease-700 font-bold text-xl">
                    P
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Priya Sharma</h4>
                    <p className="text-sm text-gray-600">Mumbai</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "The hospital bed we rented for my mother was delivered quickly and was in perfect condition. The staff was helpful in explaining how to use it. Great experience!"
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-mediease-50 p-6 rounded-lg border border-mediease-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-mediease-200 flex items-center justify-center text-mediease-700 font-bold text-xl">
                    A
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Amit Patel</h4>
                    <p className="text-sm text-gray-600">Bangalore</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "I needed a wheelchair temporarily after surgery. MediEase provided a high-quality chair at a fraction of the cost of buying. Will definitely use their services again if needed."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-mediease-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Need Healthcare Equipment?</h2>
            <p className="text-mediease-100 text-lg max-w-2xl mx-auto mb-8">
              Whether you're looking to rent or buy, we have a wide range of quality medical equipment to meet your needs.
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-white text-mediease-700 px-8 py-3 rounded-md font-medium hover:bg-mediease-50 transition-colors"
            >
              Browse Our Products
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
