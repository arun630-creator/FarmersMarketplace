import { useState } from 'react';
import { CartItem as CartItemType } from '@/lib/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleDecrement = async () => {
    if (quantity > 1) {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, quantity - 1);
      setQuantity(quantity - 1);
      setIsUpdating(false);
    }
  };

  const handleIncrement = async () => {
    setIsUpdating(true);
    await onUpdateQuantity(item.id, quantity + 1);
    setQuantity(quantity + 1);
    setIsUpdating(false);
  };

  const handleBlur = async () => {
    if (quantity !== item.quantity) {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, quantity);
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    await onRemove(item.id);
  };

  if (!item.product) {
    return null;
  }

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24">
        <img
          src={item.product.imageUrl || "https://via.placeholder.com/96"}
          alt={item.product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      
      <div className="flex-grow ml-4">
        <h3 className="text-sm md:text-base font-medium text-gray-800">{item.product.name}</h3>
        <p className="text-xs md:text-sm text-gray-500">{formatCurrency(item.product.price)} / {item.product.unit}</p>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center border rounded">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleDecrement}
            disabled={quantity <= 1 || isUpdating}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            className="w-10 h-8 text-center border-0 p-0 focus-visible:ring-0"
            disabled={isUpdating}
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleIncrement}
            disabled={isUpdating}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="ml-4 md:ml-6 text-right">
        <p className="text-sm md:text-base font-medium text-gray-800">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 p-0 h-auto mt-1"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
