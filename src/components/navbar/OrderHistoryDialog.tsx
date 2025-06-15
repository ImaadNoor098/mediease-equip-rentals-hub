
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

  // Function to reload guest orders from localStorage
  const reloadGuestOrders = () => {
    try {
      const storedGuestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      console.log('OrderHistoryDialog: Reloaded guest orders:', storedGuestOrders);
      setGuestOrders(storedGuestOrders);
      return storedGuestOrders;
    } catch (error) {
      console.error('OrderHistoryDialog: Error loading guest orders:', error);
      return [];
    }
  };

  // Load orders when component mounts or auth state changes
  useEffect(() => {
    console.log('OrderHistoryDialog: Auth state changed:', { isAuthenticated, userOrderCount: user?.orderHistory?.length });
    
    if (!isAuthenticated) {
      const loadedOrders = reloadGuestOrders();
      console.log('OrderHistoryDialog: Guest orders loaded on mount:', loadedOrders);
    } else {
      console.log('OrderHistoryDialog: User authenticated, orders from context:', user?.orderHistory);
    }
  }, [isAuthenticated, user?.orderHistory]);

  // Reload guest orders when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log('OrderHistoryDialog: Dialog opened, reloading orders');
      if (!isAuthenticated) {
        const refreshedOrders = reloadGuestOrders();
        console.log('OrderHistoryDialog: Refreshed guest orders on dialog open:', refreshedOrders);
      } else {
        console.log('OrderHistoryDialog: User orders on dialog open:', user?.orderHistory);
      }
    }
  }, [isOpen, isAuthenticated]);

  // Get current orders based on authentication status
  const orders = isAuthenticated ? (user?.orderHistory || []) : guestOrders;

  console.log('OrderHistoryDialog: Current orders to display:', {
    isAuthenticated,
    orderCount: orders.length,
    orders: orders.map(order => ({
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
      // Delete from guest orders
      const updatedGuestOrders = guestOrders.filter(order => order.id !== orderId);
      setGuestOrders(updatedGuestOrders);
      localStorage.setItem('guestOrders', JSON.stringify(updatedGuestOrders));
      console.log('OrderHistoryDialog: Updated guest orders after deletion:', updatedGuestOrders);
    }
    
    // Clear selection if the deleted order was selected
    if (selectedOrders.has(orderId)) {
      const newSelected = new Set(selectedOrders);
      newSelected.delete(orderId);
      setSelectedOrders(newSelected);
    }
    // Go back to list if we're viewing this order
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
    toast({
      title: "Order Deleted",
      description: "The order has been removed from your history.",
    });
  };

  const handleBulkDelete = () => {
    console.log('OrderHistoryDialog: Bulk deleting orders:', Array.from(selectedOrders));
    const ordersToDelete = Array.from(selectedOrders);
    
    if (ordersToDelete.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to delete.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if we're viewing a deleted order before clearing selections
    const isViewingDeletedOrder = selectedOrder && selectedOrders.has(selectedOrder.id);
    
    if (isAuthenticated) {
      // Use bulk delete function for authenticated users
      bulkDeleteOrders(ordersToDelete);
    } else {
      // Delete from guest orders
      const updatedGuestOrders = guestOrders.filter(order => !ordersToDelete.includes(order.id));
      setGuestOrders(updatedGuestOrders);
      localStorage.setItem('guestOrders', JSON.stringify(updatedGuestOrders));
      console.log('OrderHistoryDialog: Updated guest orders after bulk deletion:', updatedGuestOrders);
    }
    
    // Clear selections
    setSelectedOrders(new Set());
    
    // Go back to list if we're viewing a deleted order
    if (isViewingDeletedOrder) {
      setSelectedOrder(null);
    }
    
    toast({
      title: "Orders Deleted",
      description: `${ordersToDelete.length} order${ordersToDelete.length > 1 ? 's' : ''} ha${ordersToDelete.length > 1 ? 've' : 's'} been removed from your history.`,
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
    console.log('OrderHistoryDialog: Selected orders updated:', Array.from(newSelected));
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length && orders.length > 0) {
      console.log('OrderHistoryDialog: Deselecting all orders');
      setSelectedOrders(new Set());
    } else {
      console.log('OrderHistoryDialog: Selecting all orders:', orders.map(order => order.id));
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

  // Clear selections when dialog closes
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
