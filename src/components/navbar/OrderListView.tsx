
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Calendar, Trash2, Clock } from 'lucide-react';
import { OrderHistoryItem } from '@/types/order';

interface OrderListViewProps {
  orders: OrderHistoryItem[];
  selectedOrders: Set<string>;
  onSelectOrder: (orderId: string) => void;
  onSelectAll: () => void;
  onShowOrderDetails: (order: OrderHistoryItem) => void;
  onDeleteOrder: (orderId: string) => void;
  onBulkDelete: () => void;
}

const OrderListView: React.FC<OrderListViewProps> = ({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onShowOrderDetails,
  onDeleteOrder,
  onBulkDelete
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No orders found</p>
        <p className="text-sm">Start shopping to see your order history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
        <Button variant="outline" size="sm" onClick={onSelectAll}>
          {selectedOrders.size === orders.length ? 'Deselect All' : 'Select All'}
        </Button>
        {selectedOrders.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Selected ({selectedOrders.size})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Orders</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedOrders.size} selected orders from your history? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onBulkDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Orders
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const { dateStr, timeStr } = formatDateTime(order.date);
              return (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onShowOrderDetails(order)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => onSelectOrder(order.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{timeStr}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.method}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this order from your history? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderListView;
