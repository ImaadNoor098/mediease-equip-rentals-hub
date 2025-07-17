import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, ShoppingCart, Clock, Calendar, Download } from 'lucide-react';
import { OrderHistoryItem } from '@/types/auth';
import OrderReceiptDialog from '@/components/OrderReceiptDialog';

interface OrderDetailViewProps {
  order: OrderHistoryItem;
  onBackToList: () => void;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBackToList }) => {
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(order.date);
  
  console.log('OrderDetailView: Displaying order:', order);
  console.log('OrderDetailView: Order items with full details:', order.items);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBackToList}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Order Details - #{order.id}</h2>
        </div>
        <Button 
          onClick={() => setShowReceiptDialog(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="font-medium">{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{timeStr}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{order.method}</span>
              </div>
              {order.status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="h-px bg-border my-2"></div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">₹{order.total.toFixed(2)}</span>
              </div>
              {order.savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Total Savings:</span>
                  <span className="font-medium">₹{order.savings.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </h3>
              <div className="text-sm text-blue-700">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                {order.shippingAddress.mobileNumber && (
                  <p className="mt-2">Mobile: {order.shippingAddress.mobileNumber}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Ordered Products ({order.items?.length || 0} product{(order.items?.length || 0) !== 1 ? 's' : ''})
            </h3>
            
            {!order.items || order.items.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No products found in this order</p>
              </div>
            ) : (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id || `item-${index}`} className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                    <div className="flex gap-4">
                      {/* Product Image - Enhanced Display */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 relative">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg border-2 border-green-100 shadow-sm"
                              onError={(e) => {
                                console.log(`Failed to load image for ${item.name}:`, item.image);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallbackDiv = target.nextElementSibling as HTMLElement;
                                if (fallbackDiv) {
                                  fallbackDiv.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-green-100 flex items-center justify-center absolute top-0 left-0 ${item.image ? 'hidden' : 'flex'}`}
                          >
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-bold text-base text-gray-900 line-clamp-2">{item.name}</h4>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Product Tags and Info */}
                        <div className="flex flex-wrap items-center gap-2">
                          {item.purchaseType && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.purchaseType === 'rent' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              {item.purchaseType === 'rent' ? '🏠 Rental' : '🛒 Purchase'}
                            </span>
                          )}
                          {item.category && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                              📦 {item.category}
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        
                        {/* Pricing Information */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {item.purchaseType === 'rent' ? 'Rental Price:' : 'Unit Price:'}
                            </span>
                            <span className="font-bold text-green-600">₹{item.price.toFixed(2)}</span>
                          </div>
                          
                          {item.retailPrice && item.retailPrice > 0 && item.retailPrice > item.price && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Market Price:</span>
                              <span className="text-xs text-gray-500 line-through">₹{item.retailPrice.toFixed(2)}</span>
                            </div>
                          )}
                          
                          <div className="h-px bg-gray-200 my-2"></div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Subtotal:</span>
                            <span className="font-bold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          {item.retailPrice && item.retailPrice > 0 && item.retailPrice > item.price && (
                            <div className="text-xs text-green-600 font-medium text-right bg-green-50 px-2 py-1 rounded">
                              💰 You Saved: ₹{((item.retailPrice - item.price) * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Order Total Summary */}
            <div className="mt-6 pt-4 border-t-2 border-green-200 bg-green-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-green-800 text-lg">Order Total:</span>
                <span className="font-bold text-2xl text-green-800">₹{order.total.toFixed(2)}</span>
              </div>
              {order.savings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 font-medium">Total Savings:</span>
                  <span className="font-bold text-green-700 text-lg">₹{order.savings.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OrderReceiptDialog 
        open={showReceiptDialog}
        onOpenChange={setShowReceiptDialog}
        order={order}
      />
    </div>
  );
};

export default OrderDetailView;
