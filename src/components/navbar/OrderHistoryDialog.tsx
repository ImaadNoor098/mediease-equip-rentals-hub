
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { OrderHistoryItem } from '@/types/auth';
import { useOrderHistoryState } from '@/hooks/useOrderHistoryState';
import { useOrderOperations } from '@/hooks/useOrderOperations';
import OrderHistoryHeader from './OrderHistoryHeader';
import OrderHistoryContainer from './OrderHistoryContainer';

interface OrderHistoryDialogProps {
  children?: React.ReactNode;
}

const OrderHistoryDialog: React.FC<OrderHistoryDialogProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    selectedOrders,
    setSelectedOrders,
    guestOrders,
    setGuestOrders,
    refreshOrders
  } = useOrderHistoryState(isOpen);

  const {
    handleDeleteOrder,
    handleBulkDelete,
    handleSelectOrder,
    handleSelectAll
  } = useOrderOperations({
    selectedOrders,
    setSelectedOrders,
    selectedOrder,
    setSelectedOrder,
    guestOrders,
    setGuestOrders,
    orders
  });

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
    } else {
      // Force refresh when opening
      refreshOrders();
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
        <OrderHistoryHeader 
          selectedOrder={selectedOrder}
          ordersCount={orders.length}
          isAuthenticated={isAuthenticated}
        />
        
        <OrderHistoryContainer
          selectedOrder={selectedOrder}
          orders={orders}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onShowOrderDetails={showOrderDetails}
          onDeleteOrder={handleDeleteOrder}
          onBulkDelete={handleBulkDelete}
          onBackToList={goBackToList}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderHistoryDialog;
