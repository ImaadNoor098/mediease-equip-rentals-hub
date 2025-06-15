
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OrderHistoryItem } from '@/types/order';

interface OrderHistoryHeaderProps {
  selectedOrder: OrderHistoryItem | null;
  ordersCount: number;
  isAuthenticated: boolean;
}

const OrderHistoryHeader: React.FC<OrderHistoryHeaderProps> = ({
  selectedOrder,
  ordersCount,
  isAuthenticated
}) => {
  return (
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
  );
};

export default OrderHistoryHeader;
