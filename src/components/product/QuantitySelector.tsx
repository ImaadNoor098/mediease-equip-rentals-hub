
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Quantity</h3>
      <div className="flex items-center">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="h-10 w-10"
        >
          -
        </Button>
        <Input 
          type="number" 
          min="1"
          value={quantity}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 mx-2 text-center"
        />
        <Button 
          variant="outline"
          size="icon"
          onClick={() => onChange(quantity + 1)}
          className="h-10 w-10"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
