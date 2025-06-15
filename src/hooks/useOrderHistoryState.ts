
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { OrderHistoryItem } from '@/types/auth';

export const useOrderHistoryState = (isOpen: boolean) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [guestOrders, setGuestOrders] = useState<OrderHistoryItem[]>([]);

  // Force refresh orders whenever dialog opens or user changes
  const refreshOrders = () => {
    if (!isAuthenticated) {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        console.log('useOrderHistoryState: Refreshed guest orders:', storedOrders);
        setGuestOrders(storedOrders);
      } catch (error) {
        console.error('useOrderHistoryState: Error refreshing guest orders:', error);
        setGuestOrders([]);
      }
    }
  };

  // Listen for storage changes (guest orders)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'guestOrders') {
        console.log('useOrderHistoryState: Storage changed, refreshing');
        refreshOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  // Refresh when auth state changes or user order history changes
  useEffect(() => {
    console.log('useOrderHistoryState: Auth/user state changed, refreshing orders');
    console.log('useOrderHistoryState: User order history length:', user?.orderHistory?.length || 0);
    refreshOrders();
  }, [isAuthenticated, user?.orderHistory?.length, user?.id]);

  // Refresh when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log('useOrderHistoryState: Dialog opened, force refreshing');
      refreshOrders();
    }
  }, [isOpen, isAuthenticated]);

  // Get current orders - always use fresh data
  const orders = isAuthenticated ? (user?.orderHistory || []) : guestOrders;

  console.log('useOrderHistoryState: Current display state:', {
    isAuthenticated,
    isOpen,
    orderCount: orders.length,
    userOrderHistory: user?.orderHistory?.length || 0,
    guestOrdersLength: guestOrders.length,
    userId: user?.id
  });

  return {
    orders,
    selectedOrder,
    setSelectedOrder,
    selectedOrders,
    setSelectedOrders,
    guestOrders,
    setGuestOrders,
    refreshOrders
  };
};
