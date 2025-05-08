
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PurchaseOptionsProps {
  rentPrice: number;
  buyPrice: number;
  purchaseType: 'rent' | 'buy';
  onChange: (value: 'rent' | 'buy') => void;
}

const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({ 
  rentPrice, 
  buyPrice, 
  purchaseType, 
  onChange 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Select Option</h3>
      <RadioGroup 
        defaultValue="rent"
        value={purchaseType}
        onValueChange={(value) => onChange(value as 'rent' | 'buy')}
        className="grid grid-cols-2 gap-4"
      >
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <RadioGroupItem 
            value="rent" 
            id="rent" 
            className="absolute top-4 right-4"
          />
          <div className="space-y-2">
            <Label htmlFor="rent" className="text-lg font-medium">Rent</Label>
            <p className="text-mediease-700 font-semibold text-xl">₹{rentPrice}/month</p>
            <p className="text-gray-500 text-sm">Perfect for temporary needs</p>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <RadioGroupItem 
            value="buy" 
            id="buy" 
            className="absolute top-4 right-4"
          />
          <div className="space-y-2">
            <Label htmlFor="buy" className="text-lg font-medium">Buy</Label>
            <p className="text-mediease-700 font-semibold text-xl">₹{buyPrice}</p>
            <p className="text-gray-500 text-sm">Own it permanently</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PurchaseOptions;
