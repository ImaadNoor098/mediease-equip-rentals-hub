
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, ShoppingCart, Info } from 'lucide-react';
import { OrderHistoryItem } from '@/types/order';

interface OrderDetailViewProps {
  order: OrderHistoryItem;
  onBackToList: () => void;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBackToList }) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBackToList}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Order Details - #{order.id}</h2>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
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
              Ordered Equipment ({order.items.length} item{order.items.length !== 1 ? 's' : ''})
            </h3>
            
            {order.items.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No equipment details available for this order</p>
              </div>
            ) : (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id || index} className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                    <div className="flex gap-4">
                      {/* Equipment Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-green-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-green-100 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Equipment Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                              <Info className="h-3 w-3 inline mr-1" />
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Equipment Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          {item.purchaseType && (
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              item.purchaseType === 'rent' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}>
                              {item.purchaseType === 'rent' ? '🏠 Rental' : '🛒 Purchase'}
                            </span>
                          )}
                          {item.category && (
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                              📦 {item.category}
                            </span>
                          )}
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
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
                          
                          {item.retailPrice && item.purchaseType === 'rent' && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Market Price:</span>
                              <span className="text-sm text-gray-500 line-through">₹{item.retailPrice.toFixed(2)}</span>
                            </div>
                          )}
                          
                          <div className="h-px bg-gray-200 my-2"></div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Subtotal:</span>
                            <span className="font-bold text-lg text-green-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          {item.retailPrice && item.purchaseType === 'rent' && (
                            <div className="text-sm text-green-600 font-medium text-right bg-green-50 px-2 py-1 rounded">
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
    </div>
  );
};

export default OrderDetailView;
