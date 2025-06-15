
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { OrderHistoryItem } from '@/types/order';
import OrderListView from './OrderListView';
import OrderDetailView from './OrderDetailView';

interface OrderHistoryDialogProps {
  children?: React.ReactNode;
}

const OrderHistoryDialog: React.FC<OrderHistoryDialogProps> = ({ children }) => {
  const { user, deleteOrder, bulkDeleteOrders, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [guestOrders, setGuestOrders] = useState<OrderHistoryItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to reload guest orders from localStorage
  const reloadGuestOrders = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      console.log('OrderHistoryDialog: Loaded guest orders from localStorage:', storedOrders);
      setGuestOrders(storedOrders);
      return storedOrders;
    } catch (error) {
      console.error('OrderHistoryDialog: Error loading guest orders:', error);
      return [];
    }
  };

  // Reload orders when component mounts or dependencies change
  useEffect(() => {
    console.log('OrderHistoryDialog: Effect triggered - reloading orders');
    console.log('OrderHistoryDialog: Auth state:', { isAuthenticated, userOrderCount: user?.orderHistory?.length });
    
    if (!isAuthenticated) {
      reloadGuestOrders();
    }
  }, [isAuthenticated, user?.orderHistory, refreshTrigger]);

  // Force refresh when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log('OrderHistoryDialog: Dialog opened, forcing refresh');
      if (!isAuthenticated) {
        reloadGuestOrders();
      }
      // Force a refresh trigger
      setRefreshTrigger(prev => prev + 1);
    }
  }, [isOpen, isAuthenticated]);

  // Get current orders
  const orders = isAuthenticated ? (user?.orderHistory || []) : guestOrders;

  console.log('OrderHistoryDialog: Current orders to display:', {
    isAuthenticated,
    orderCount: orders.length,
    orders: orders.slice(0, 3).map(order => ({ // Log first 3 for brevity
      id: order.id,
      date: order.date,
      total: order.total,
      itemCount: order.items?.length || 0
    }))
  });

  const handleDeleteOrder = (orderId: string) => {
    console.log('OrderHistoryDialog: Deleting order:', orderId);
    
    if (isAuthenticated) {
      deleteOrder(orderId);
    } else {
      const updatedOrders = guestOrders.filter(order => order.id !== orderId);
      setGuestOrders(updatedOrders);
      localStorage.setItem('guestOrders', JSON.stringify(updatedOrders));
      console.log('OrderHistoryDialog: Updated guest orders after deletion:', updatedOrders);
    }
    
    // Clear selections
    if (selectedOrders.has(orderId)) {
      const newSelected = new Set(selectedOrders);
      newSelected.delete(orderId);
      setSelectedOrders(newSelected);
    }
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
    
    toast({
      title: "Order Deleted",
      description: "The order has been removed from your history.",
    });
  };

  const handleBulkDelete = () => {
    const ordersToDelete = Array.from(selectedOrders);
    console.log('OrderHistoryDialog: Bulk deleting orders:', ordersToDelete);
    
    if (ordersToDelete.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to delete.",
        variant: "destructive"
      });
      return;
    }
    
    const isViewingDeletedOrder = selectedOrder && selectedOrders.has(selectedOrder.id);
    
    if (isAuthenticated) {
      bulkDeleteOrders(ordersToDelete);
    } else {
      const updatedOrders = guestOrders.filter(order => !ordersToDelete.includes(order.id));
      setGuestOrders(updatedOrders);
      localStorage.setItem('guestOrders', JSON.stringify(updatedOrders));
      console.log('OrderHistoryDialog: Updated guest orders after bulk deletion:', updatedOrders);
    }
    
    setSelectedOrders(new Set());
    if (isViewingDeletedOrder) {
      setSelectedOrder(null);
    }
    
    toast({
      title: "Orders Deleted",
      description: `${ordersToDelete.length} order${ordersToDelete.length > 1 ? 's' : ''} deleted successfully.`,
    });
  };

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length && orders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(order => order.id)));
    }
  };

  const showOrderDetails = (order: OrderHistoryItem) => {
    console.log('OrderHistoryDialog: Showing details for order:', order.id);
    setSelectedOrder(order);
  };

  const goBackToList = () => {
    setSelectedOrder(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedOrders(new Set());
      setSelectedOrder(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            Order History ({orders.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedOrder ? `Order Details - #${selectedOrder.id}` : 'Order History'}
            {!isAuthenticated && (
              <span className="text-sm font-normal text-orange-600 ml-2">
                (Guest Orders - Create an account to save permanently)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          {selectedOrder ? (
            <OrderDetailView 
              order={selectedOrder}
              onBackToList={goBackToList}
            />
          ) : (
            <OrderListView
              orders={orders}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrder}
              onSelectAll={handleSelectAll}
              onShowOrderDetails={showOrderDetails}
              onDeleteOrder={handleDeleteOrder}
              onBulkDelete={handleBulkDelete}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderHistoryDialog;
