import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, FileText, ChevronRight, Calendar, CreditCard } from 'lucide-react';
import { OrderHistoryItem } from '@/types/auth';
import { format } from 'date-fns';

interface OrderHistorySectionProps {
  orders: OrderHistoryItem[];
  loading: boolean;
}

const OrderHistorySection: React.FC<OrderHistorySectionProps> = ({ orders, loading }) => {
  const navigate = useNavigate();

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

  const handleViewOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <Button className="mt-4" onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleViewOrder(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.id);
                        }}
                        className="font-mono text-sm font-semibold text-primary hover:underline"
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </button>
                      <Badge className={`${getStatusColor(order.status || 'pending')} text-xs`}>
                        {(order.status || 'Pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(order.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        {order.method}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        {order.items.length > 0 && (
                          <span className="ml-1">
                            • {order.items.slice(0, 2).map(i => i.name).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">₹{order.total.toFixed(2)}</p>
                      {order.savings > 0 && (
                        <p className="text-xs text-green-600">Saved ₹{order.savings.toFixed(2)}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistorySection;
