
import React from 'react';
import { AddressFormData } from '@/pages/CheckoutAddress';

interface AddressDisplaySectionProps {
  shippingAddress: AddressFormData | null;
}

const AddressDisplaySection: React.FC<AddressDisplaySectionProps> = ({ shippingAddress }) => {
  if (!shippingAddress) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
      <h3 className="font-semibold text-gray-800 mb-2">Delivery Address:</h3>
      <p className="text-sm text-gray-600">{shippingAddress.fullName}</p>
      <p className="text-sm text-gray-600">
        {shippingAddress.addressLine1}, {shippingAddress.addressLine2 && `${shippingAddress.addressLine2}, `}
        {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
      </p>
      <p className="text-sm text-gray-600">Mobile: {shippingAddress.mobileNumber}</p>
    </div>
  );
};

export default AddressDisplaySection;
