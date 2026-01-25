import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { OrderHistoryItem } from '@/types/auth';

interface QuickStatsCardProps {
  orders: OrderHistoryItem[];
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ orders }) => {
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSavings = orders.reduce((sum, o) => sum + (o.savings || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-primary">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-primary">
              ₹{totalSpent.toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
        </div>
        {totalSavings > 0 && (
          <div className="mt-4 text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-lg font-semibold text-green-600">₹{totalSavings.toFixed(0)}</p>
            <p className="text-xs text-green-600/80">Total Savings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
