
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { OrderHistoryItem } from '@/types/order';

interface UseOrderOperationsProps {
  selectedOrders: Set<string>;
  setSelectedOrders: (orders: Set<string>) => void;
  selectedOrder: OrderHistoryItem | null;
  setSelectedOrder: (order: OrderHistoryItem | null) => void;
  guestOrders: OrderHistoryItem[];
  setGuestOrders: (orders: OrderHistoryItem[]) => void;
  orders: OrderHistoryItem[];
}

export const useOrderOperations = ({
  selectedOrders,
  setSelectedOrders,
  selectedOrder,
  setSelectedOrder,
  guestOrders,
  setGuestOrders,
  orders
}: UseOrderOperationsProps) => {
  const { deleteOrder, bulkDeleteOrders, isAuthenticated } = useAuth();

  const handleDeleteOrder = (orderId: string) => {
    console.log('useOrderOperations: Deleting order:', orderId);
    
    if (isAuthenticated) {
      deleteOrder(orderId);
    } else {
      const updatedOrders = guestOrders.filter(order => order.id !== orderId);
      setGuestOrders(updatedOrders);
      localStorage.setItem('guestOrders', JSON.stringify(updatedOrders));
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
    console.log('useOrderOperations: Bulk deleting orders:', ordersToDelete);
    
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

  return {
    handleDeleteOrder,
    handleBulkDelete,
    handleSelectOrder,
    handleSelectAll
  };
};
