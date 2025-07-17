
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
    const returnDate = new Date(order.date);
    returnDate.setDate(returnDate.getDate() + 30);
    
    let content = `
===============================================
              MEDIEAZE ORDER RECEIPT
===============================================

Order ID: ${order.id}
Order Date: ${orderDate}
Payment Method: ${order.method}
Status: ${order.status || 'Confirmed'}
Return/Exchange Valid Till: ${returnDate.toLocaleDateString('en-IN')}

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
      const rentReturnDate = new Date(order.date);
      rentReturnDate.setDate(rentReturnDate.getDate() + 30);
      
      content += `
${index + 1}. ${item.name}
   Category: ${item.category || 'Medical Equipment'}
   Mode: ${item.purchaseType === 'rent' ? 'RENTAL' : 'PURCHASE'}
   Quantity: ${item.quantity}
   Unit Price: ₹${item.price.toFixed(2)}
   ${item.purchaseType === 'rent' ? `Rental Return Date: ${rentReturnDate.toLocaleDateString('en-IN')}` : ''}
   Subtotal: ₹${(item.price * item.quantity).toFixed(2)}
   ${item.retailPrice && item.retailPrice > item.price ? 
     `MRP: ₹${item.retailPrice.toFixed(2)} | Savings: ₹${((item.retailPrice - item.price) * item.quantity).toFixed(2)}` : ''}
`;
    });

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = subtotal * 0.18;

    content += `
===============================================
               BILLING SUMMARY
===============================================

Subtotal: ₹${subtotal.toFixed(2)}
GST (18%): ₹${gst.toFixed(2)}
Order Total: ₹${order.total.toFixed(2)}
${order.savings > 0 ? `Total Savings: ₹${order.savings.toFixed(2)}\n` : ''}
===============================================

TERMS & CONDITIONS:
- Rental items must be returned within 30 days
- Products are covered under manufacturer warranty
- For support, contact: support@medieaze.com

Thank you for choosing MediEaze!

===============================================
`;

    return content;
  };

  const generateReceiptHTML = (order: OrderHistoryItem) => {
    const orderDate = new Date(order.date).toLocaleString('en-IN');
    const returnDate = new Date(order.date);
    returnDate.setDate(returnDate.getDate() + 30);
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = subtotal * 0.18;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>MediEaze Order Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin: 20px 0; }
        .item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .item-header { display: flex; align-items: center; margin-bottom: 10px; }
        .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px; }
        .item-details { flex: 1; }
        .mode-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 5px 0; }
        .rent { background-color: #e3f2fd; color: #1976d2; }
        .buy { background-color: #f3e5f5; color: #7b1fa2; }
        .total { font-weight: bold; font-size: 18px; background-color: #f5f5f5; padding: 15px; border-radius: 8px; }
        .customer-info { background-color: #f8f9fa; padding: 15px; border-radius: 8px; }
        .billing-summary { background-color: #e8f5e8; padding: 15px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>MEDIEAZE ORDER RECEIPT</h1>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${orderDate}</p>
        <p><strong>Status:</strong> ${order.status || 'Confirmed'}</p>
        <p><strong>Return/Exchange Valid Till:</strong> ${returnDate.toLocaleDateString('en-IN')}</p>
    </div>
    
    <div class="section customer-info">
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
        <h3>Order Items (${order.items.length} item${order.items.length !== 1 ? 's' : ''})</h3>
        ${order.items.map((item, index) => {
          const rentReturnDate = new Date(order.date);
          rentReturnDate.setDate(rentReturnDate.getDate() + 30);
          
          return `
        <div class="item">
            <div class="item-header">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image" />` : 
                  '<div class="item-image" style="background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>'}
                <div class="item-details">
                    <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">${item.description || 'Medical Equipment'}</p>
                    <span class="mode-badge ${item.purchaseType === 'rent' ? 'rent' : 'buy'}">
                        ${item.purchaseType === 'rent' ? '🏠 RENTAL' : '🛒 PURCHASE'}
                    </span>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                <div><strong>Category:</strong> ${item.category || 'Medical Equipment'}</div>
                <div><strong>Quantity:</strong> ${item.quantity}</div>
                <div><strong>Unit Price:</strong> ₹${item.price.toFixed(2)}</div>
                <div><strong>Subtotal:</strong> ₹${(item.price * item.quantity).toFixed(2)}</div>
                ${item.purchaseType === 'rent' ? `<div><strong>Return Date:</strong> ${rentReturnDate.toLocaleDateString('en-IN')}</div>` : ''}
                ${item.retailPrice && item.retailPrice > item.price ? 
                  `<div style="color: green;"><strong>You Saved:</strong> ₹${((item.retailPrice - item.price) * item.quantity).toFixed(2)}</div>` : ''}
            </div>
        </div>
        `}).join('')}
    </div>
    
    <div class="section billing-summary">
        <h3>Billing Summary</h3>
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>GST (18%):</span>
            <span>₹${gst.toFixed(2)}</span>
        </div>
        <hr style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
            <span>Total Amount:</span>
            <span>₹${order.total.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Payment Method:</span>
            <span>${order.method}</span>
        </div>
        ${order.savings > 0 ? `
        <div style="display: flex; justify-content: space-between; color: green; font-weight: bold;">
            <span>Total Savings:</span>
            <span>₹${order.savings.toFixed(2)}</span>
        </div>` : ''}
    </div>
    
    <div class="section" style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; font-size: 12px; color: #666;">
        <h4>Terms & Conditions</h4>
        <p>• Rental items must be returned within 30 days from order date</p>
        <p>• Products are covered under manufacturer warranty</p>
        <p>• For support contact: support@medieaze.com</p>
        <br>
        <p><strong>Thank you for choosing MediEaze!</strong></p>
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
            Download or print your order receipt for Order #{order.id}
          </p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handleDownloadReceipt} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt (Text)
            </Button>
            
            <Button onClick={handlePrintReceipt} variant="outline" className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Print Detailed Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReceiptDialog;
