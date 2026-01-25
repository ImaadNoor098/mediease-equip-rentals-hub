import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OrderHistoryItem } from '@/types/auth';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import QuickStatsCard from '@/components/profile/QuickStatsCard';
import OrderHistorySection from '@/components/profile/OrderHistorySection';

interface DatabaseOrder {
  id: string;
  order_number: string;
  items: any;
  subtotal: number;
  gst: number;
  total: number;
  savings: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  payment_method: string | null;
  status: string | null;
  created_at: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      return;
    }

    const mappedOrders: OrderHistoryItem[] = (data as DatabaseOrder[]).map(order => ({
      id: order.order_number,
      date: order.created_at,
      total: Number(order.total),
      method: order.payment_method || 'Cash on Delivery',
      items: Array.isArray(order.items) ? order.items : [],
      shippingAddress: order.shipping_address ? {
        fullName: order.customer_name || '',
        addressLine1: order.shipping_address,
        city: '',
        state: '',
        pincode: '',
        mobileNumber: order.customer_phone || ''
      } : undefined,
      savings: Number(order.savings) || 0,
      status: (order.status as 'pending' | 'confirmed' | 'shipped' | 'delivered') || 'confirmed'
    }));

    setOrders(mappedOrders);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProfileInfoCard user={user} onLogout={handleLogout} />
            <QuickStatsCard orders={orders} />
          </div>

          <OrderHistorySection orders={orders} loading={loading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
