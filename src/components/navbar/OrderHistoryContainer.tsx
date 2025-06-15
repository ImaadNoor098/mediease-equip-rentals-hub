
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderHistoryItem } from '@/types/order';
import OrderListView from './OrderListView';
import OrderDetailView from './OrderDetailView';

interface OrderHistoryContainerProps {
  selectedOrder: OrderHistoryItem | null;
  orders: OrderHistoryItem[];
  selectedOrders: Set<string>;
  onSelectOrder: (orderId: string) => void;
  onSelectAll: () => void;
  onShowOrderDetails: (order: OrderHistoryItem) => void;
  onDeleteOrder: (orderId: string) => void;
  onBulkDelete: () => void;
  onBackToList: () => void;
}

const OrderHistoryContainer: React.FC<OrderHistoryContainerProps> = ({
  selectedOrder,
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onShowOrderDetails,
  onDeleteOrder,
  onBulkDelete,
  onBackToList
}) => {
  return (
    <ScrollArea className="max-h-[60vh]">
      {selectedOrder ? (
        <OrderDetailView 
          order={selectedOrder}
          onBackToList={onBackToList}
        />
      ) : (
        <OrderListView
          orders={orders}
          selectedOrders={selectedOrders}
          onSelectOrder={onSelectOrder}
          onSelectAll={onSelectAll}
          onShowOrderDetails={onShowOrderDetails}
          onDeleteOrder={onDeleteOrder}
          onBulkDelete={onBulkDelete}
        />
      )}
    </ScrollArea>
  );
};

export default OrderHistoryContainer;
