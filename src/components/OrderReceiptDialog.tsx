
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { OrderHistoryItem } from '@/types/auth';

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderHistoryItem;
}

const OrderReceiptDialog: React.FC<OrderReceiptDialogProps> = ({
  open,
  onOpenChange,
  order
}) => {
  const handleDownloadReceipt = () => {
    const receiptContent = generateReceiptContent(order);
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediEaze-Receipt-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintReceipt = () => {
    const receiptContent = generateReceiptHTML(order);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateReceiptContent = (order: OrderHistoryItem) => {
    const orderDate = new Date(order.date).toLocaleString('en-IN');
    
    let content = `
===============================================
              MEDIEAZE ORDER RECEIPT
===============================================

Order ID: ${order.id}
Order Date: ${orderDate}
Payment Method: ${order.method}
Status: ${order.status || 'Confirmed'}

===============================================
               CUSTOMER DETAILS
===============================================
`;

    if (order.shippingAddress) {
      content += `
Name: ${order.shippingAddress.fullName}
Mobile: ${order.shippingAddress.mobileNumber || 'N/A'}
Address: ${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '\n' : ''}City: ${order.shippingAddress.city}
State: ${order.shippingAddress.state}
Pincode: ${order.shippingAddress.pincode}
`;
    }

    content += `
===============================================
               ORDER ITEMS
===============================================
`;

    order.items.forEach((item, index) => {
      content += `
${index + 1}. ${item.name}
   Type: ${item.purchaseType === 'rent' ? 'Rental' : 'Purchase'}
   Quantity: ${item.quantity}
   Unit Price: ₹${item.price.toFixed(2)}
   Subtotal: ₹${(item.price * item.quantity).toFixed(2)}
   ${item.retailPrice && item.retailPrice > item.price ? 
     `Savings: ₹${((item.retailPrice - item.price) * item.quantity).toFixed(2)}` : ''}
`;
    });

    content += `
===============================================
               BILLING SUMMARY
===============================================

Order Total: ₹${order.total.toFixed(2)}
${order.savings > 0 ? `Total Savings: ₹${order.savings.toFixed(2)}\n` : ''}
===============================================

Thank you for choosing MediEaze!
For support, contact us at support@medieaze.com

===============================================
`;

    return content;
  };

  const generateReceiptHTML = (order: OrderHistoryItem) => {
    const orderDate = new Date(order.date).toLocaleString('en-IN');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>MediEaze Order Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .section { margin: 20px 0; }
        .item { border-bottom: 1px solid #ddd; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>MEDIEAZE ORDER RECEIPT</h1>
        <p>Order ID: ${order.id}</p>
        <p>Date: ${orderDate}</p>
    </div>
    
    <div class="section">
        <h3>Customer Details</h3>
        ${order.shippingAddress ? `
        <p><strong>Name:</strong> ${order.shippingAddress.fullName}</p>
        <p><strong>Mobile:</strong> ${order.shippingAddress.mobileNumber || 'N/A'}</p>
        <p><strong>Address:</strong> ${order.shippingAddress.addressLine1}</p>
        ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
        ` : '<p>No address information available</p>'}
    </div>
    
    <div class="section">
        <h3>Order Items</h3>
        ${order.items.map((item, index) => `
        <div class="item">
            <p><strong>${index + 1}. ${item.name}</strong></p>
            <p>Type: ${item.purchaseType === 'rent' ? 'Rental' : 'Purchase'}</p>
            <p>Quantity: ${item.quantity} | Unit Price: ₹${item.price.toFixed(2)}</p>
            <p>Subtotal: ₹${(item.price * item.quantity).toFixed(2)}</p>
            ${item.retailPrice && item.retailPrice > item.price ? 
              `<p style="color: green;">Savings: ₹${((item.retailPrice - item.price) * item.quantity).toFixed(2)}</p>` : ''}
        </div>
        `).join('')}
    </div>
    
    <div class="section total">
        <p>Payment Method: ${order.method}</p>
        <p>Order Total: ₹${order.total.toFixed(2)}</p>
        ${order.savings > 0 ? `<p style="color: green;">Total Savings: ₹${order.savings.toFixed(2)}</p>` : ''}
    </div>
    
    <div class="section" style="text-align: center; margin-top: 40px;">
        <p>Thank you for choosing MediEaze!</p>
        <p>For support, contact us at support@medieaze.com</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Order Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download your order receipt for Order #{order.id}
          </p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handleDownloadReceipt} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt (Text)
            </Button>
            
            <Button onClick={handlePrintReceipt} variant="outline" className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReceiptDialog;
