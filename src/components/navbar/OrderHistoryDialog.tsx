
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { Package, Calendar, MapPin } from 'lucide-react';

const OrderHistoryDialog = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const orders = user?.orderHistory || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Order History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Order History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No orders found</p>
              <p className="text-sm">Start shopping to see your order history here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.method}</p>
                    </div>
                  </div>
                  
                  {order.shippingAddress && (
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="h-4 w-4" />
                        Delivery Address
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.fullName}<br />
                        {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}, `}
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {order.savings > 0 && (
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-sm font-medium text-green-800">
                        You saved ₹{order.savings.toFixed(2)} on this order!
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderHistoryDialog;
