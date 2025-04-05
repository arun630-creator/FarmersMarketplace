import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils";

const CartDropdown = () => {
  const { cartItems, totalItems, subtotal, removeFromCart } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="p-4">
          <h4 className="text-neutral-800 font-bold mb-3">Your Cart ({totalItems})</h4>
          {cartItems.length > 0 ? (
            <div className="space-y-3">
              {/* Cart items */}
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img 
                    src={item.product?.imageUrl || "https://via.placeholder.com/60"} 
                    alt={item.product?.name} 
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.quantity} {item.product?.unit} × {formatCurrency(item.product?.price || 0)}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency((item.product?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}

              {cartItems.length > 3 && (
                <p className="text-xs text-center text-neutral-500 italic">
                  +{cartItems.length - 3} more items in cart
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 text-center py-4">Your cart is empty</p>
          )}

          {cartItems.length > 0 && (
            <>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span>Shipping</span>
                  <span className="font-medium">calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link href="/cart" className="flex-1">
                    <Button variant="outline" className="w-full">View Cart</Button>
                  </Link>
                  <Link href="/checkout" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary-dark">Checkout</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
