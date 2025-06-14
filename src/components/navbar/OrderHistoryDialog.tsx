
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { OrderHistoryItem } from '@/types/order';
import OrderListView from './OrderListView';
import OrderDetailView from './OrderDetailView';

const OrderHistoryDialog = () => {
  const { user, deleteOrder, bulkDeleteOrders } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const orders = user?.orderHistory || [];

  console.log('OrderHistoryDialog: User:', user);
  console.log('OrderHistoryDialog: Orders:', orders);

  const handleDeleteOrder = (orderId: string) => {
    console.log('Deleting single order:', orderId);
    deleteOrder(orderId);
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
    console.log('Bulk deleting selected orders:', Array.from(selectedOrders));
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
    
    // Use bulk delete function
    bulkDeleteOrders(ordersToDelete);
    
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
    console.log('Selected orders updated:', Array.from(newSelected));
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length && orders.length > 0) {
      console.log('Deselecting all orders');
      setSelectedOrders(new Set());
    } else {
      console.log('Selecting all orders:', orders.map(order => order.id));
      setSelectedOrders(new Set(orders.map(order => order.id)));
    }
  };

  const showOrderDetails = (order: OrderHistoryItem) => {
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
        <Button variant="outline" size="sm">
          Order History ({orders.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedOrder ? `Order Details - #${selectedOrder.id}` : 'Order History'}
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
