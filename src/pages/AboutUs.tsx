
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <BackButton />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-mediease-900 mb-6">About MediEase</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-mediease-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                At MediEase, we believe that quality healthcare equipment should be accessible to everyone. Our mission is to provide affordable solutions for medical equipment needs through our innovative rent and purchase options.
              </p>
              <p className="text-gray-700 mb-4">
                We understand that medical equipment can be expensive, and many patients only need certain equipment temporarily. That's why we've created a platform that gives you the flexibility to rent high-quality medical equipment for as long as you need it, or purchase it outright if that's your preference.
              </p>
              
              <div className="my-8">
                <img 
                  src="https://images.unsplash.com/photo-1631815588090-d4bfec5b9876?q=80&w=2072&auto=format&fit=crop" 
                  alt="MediEase Team" 
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>
              
              <h2 className="text-2xl font-semibold text-mediease-800 mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                MediEase was founded in 2018 by a team of healthcare professionals who saw the need for more affordable medical equipment options. Our founder, Dr. Rajesh Kumar, was inspired to start the company after witnessing many patients struggle to afford the equipment they needed for recovery at home.
              </p>
              <p className="text-gray-700 mb-4">
                What began as a small operation with just a few items has grown into a comprehensive platform offering a wide range of medical equipment for rent and purchase. We take pride in maintaining our equipment to the highest standards and ensuring that every item is thoroughly sanitized and in perfect working condition before it reaches you.
              </p>
              
              <h2 className="text-2xl font-semibold text-mediease-800 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <div className="bg-mediease-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-mediease-900 mb-2">Quality</h3>
                  <p className="text-gray-700">We never compromise on the quality of our equipment. All items are maintained to the highest standards.</p>
                </div>
                <div className="bg-mediease-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-mediease-900 mb-2">Accessibility</h3>
                  <p className="text-gray-700">We believe everyone deserves access to the medical equipment they need, regardless of budget constraints.</p>
                </div>
                <div className="bg-mediease-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-mediease-900 mb-2">Support</h3>
                  <p className="text-gray-700">Our team is always available to help you find the right equipment and provide technical assistance.</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-mediease-800 mb-4">Our Team</h2>
              <p className="text-gray-700 mb-8">
                MediEase is powered by a team of healthcare professionals, engineers, and customer service experts who are passionate about making healthcare equipment more accessible. Our team includes certified medical equipment specialists who can help you find the right equipment for your needs.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
