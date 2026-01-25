import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  User,
  Printer,
  CheckCircle,
  Truck,
  PackageCheck
} from 'lucide-react';
import { format } from 'date-fns';
import OrderReceiptDialog from '@/components/OrderReceiptDialog';
import { OrderHistoryItem } from '@/types/auth';

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

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<DatabaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [isAuthenticated, orderId, user]);

  const fetchOrder = async () => {
    if (!user || !orderId) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('order_number', orderId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
      return;
    }

    setOrder(data as DatabaseOrder);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'confirmed':
      case 'completed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <PackageCheck className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const mapToOrderHistoryItem = (dbOrder: DatabaseOrder): OrderHistoryItem => ({
    id: dbOrder.order_number,
    date: dbOrder.created_at,
    total: Number(dbOrder.total),
    method: dbOrder.payment_method || 'Cash on Delivery',
    items: Array.isArray(dbOrder.items) ? dbOrder.items : [],
    shippingAddress: dbOrder.shipping_address ? {
      fullName: dbOrder.customer_name || '',
      addressLine1: dbOrder.shipping_address,
      city: '',
      state: '',
      pincode: '',
      mobileNumber: dbOrder.customer_phone || ''
    } : undefined,
    savings: Number(dbOrder.savings) || 0,
    status: (dbOrder.status as 'pending' | 'confirmed' | 'shipped' | 'delivered') || 'confirmed'
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-muted-foreground">Loading order details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                <p className="text-muted-foreground">
                  We couldn't find this order. It may have been deleted or doesn't exist.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const orderDate = new Date(order.created_at);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Order Details
              </h1>
              <p className="text-muted-foreground mt-1">
                Order ID: <span className="font-mono font-medium text-foreground">{order.order_number}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(order.status || 'pending')} flex items-center gap-1.5 px-3 py-1.5`}>
                {getStatusIcon(order.status || 'pending')}
                {(order.status || 'Pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowReceipt(true)}>
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{format(orderDate, 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{format(orderDate, 'hh:mm a')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Ordered */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5" />
                    Items Ordered ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                      {item.image && (
                        <div className="w-20 h-20 flex-shrink-0 bg-background rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-foreground">{item.name}</h4>
                            {item.category && (
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </span>
                              {item.purchaseType && (
                                <Badge variant="outline" className="text-xs">
                                  {item.purchaseType === 'rent' ? 'Rented' : 'Purchased'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.retailPrice && item.retailPrice > item.price && (
                              <p className="text-xs text-muted-foreground line-through">
                                ₹{(item.retailPrice * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary & Info */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{Number(order.gst).toFixed(2)}</span>
                  </div>
                  {Number(order.savings) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Savings</span>
                      <span>-₹{Number(order.savings).toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{Number(order.total).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Payment Method:</span>
                  </div>
                  <p className="font-medium">{order.payment_method || 'Cash on Delivery'}</p>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.customer_name && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">{order.customer_name}</p>
                      </div>
                    </div>
                  )}
                  {order.customer_email && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{order.customer_email}</p>
                      </div>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{order.customer_phone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shipping_address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{order.shipping_address}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {order && (
        <OrderReceiptDialog
          open={showReceipt}
          onOpenChange={setShowReceipt}
          order={mapToOrderHistoryItem(order)}
        />
      )}
    </div>
  );
};

export default OrderDetail;
