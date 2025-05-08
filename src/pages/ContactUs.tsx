
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a server
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
      duration: 5000
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
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
          
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-mediease-900 mb-6">Contact Us</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-semibold text-mediease-800 mb-6">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-mediease-100 p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-mediease-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Address</h3>
                        <p className="text-gray-600 mt-1">
                          42 MediEase Tower, Healthcare Avenue<br />
                          Medical District, Mumbai 400001<br />
                          Maharashtra, India
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-mediease-100 p-3 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-mediease-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600 mt-1">
                          Customer Support: +91 98765 43210<br />
                          Technical Assistance: +91 98765 43211
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-mediease-100 p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-mediease-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-1">
                          General Inquiries: info@mediease.com<br />
                          Support: support@mediease.com<br />
                          Rentals: rentals@mediease.com
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-mediease-100 p-3 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-mediease-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Business Hours</h3>
                        <p className="text-gray-600 mt-1">
                          Monday - Friday: 9:00 AM - 8:00 PM<br />
                          Saturday: 9:00 AM - 5:00 PM<br />
                          Sunday: 10:00 AM - 2:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-semibold text-mediease-800 mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-mediease-600 hover:bg-mediease-700"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-mediease-800 mb-6">Visit Our Location</h2>
              <div className="aspect-video w-full bg-gray-200 rounded-lg">
                {/* In a real implementation, this would be an actual map */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-600">Map loading... (Google Maps would be integrated here)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
