import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  const handleQuantityChange = async (cartItemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) return;
    
    // Find the item to check stock
    const item = cartItems.find(item => item.id === cartItemId);
    if (!item) return;
    
    if (newQuantity > item.product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        description: `Only ${item.product.stock} units available.`,
        variant: "destructive"
      });
      return;
    }
    
    setUpdatingItemId(cartItemId);
    
    try {
      await updateCartItem(cartItemId, newQuantity);
      
      toast({
        title: "Cart updated",
        description: `${item.product.name} quantity updated to ${newQuantity}.`
      });
    } catch (error) {
      toast({
        title: "Error updating cart",
        description: "Failed to update the quantity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    const item = cartItems.find(item => item.id === cartItemId);
    if (!item) return;
    
    setUpdatingItemId(cartItemId);
    
    try {
      await removeFromCart(cartItemId);
      
      toast({
        title: "Item removed",
        description: `${item.product.name} has been removed from your cart.`
      });
    } catch (error) {
      toast({
        title: "Error removing item",
        description: "Failed to remove item from the cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    
    try {
      await clearCart();
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart."
      });
    } catch (error) {
      toast({
        title: "Error clearing cart",
        description: "Failed to clear the cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Cart - Farm Fresh Market</title>
        <meta name="description" content="Review and checkout your selections from Farm Fresh Market." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-heading mb-6">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-neutral-700 mb-6">Explore our products and add some items to your cart.</p>
              <Button asChild className="bg-primary hover:bg-primary-dark text-white">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm mb-6 lg:mb-0">
                <CardContent className="p-0">
                  <div className="px-6 py-4 bg-neutral-50 rounded-t-lg hidden sm:grid sm:grid-cols-12 font-medium">
                    <div className="sm:col-span-6">Product</div>
                    <div className="sm:col-span-2 text-center">Price</div>
                    <div className="sm:col-span-2 text-center">Quantity</div>
                    <div className="sm:col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  <div>
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 border-b last:border-0">
                        <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                          {/* Product image and name */}
                          <div className="sm:col-span-6 flex">
                            <div className="w-20 h-20 rounded overflow-hidden mr-4 shrink-0">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.product.name}</h3>
                              <p className="text-sm text-neutral-500">{item.product.unit}</p>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-sm text-red-600 hover:text-red-800 flex items-center mt-2 sm:hidden"
                                disabled={updatingItemId === item.id}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="sm:col-span-2 text-center mt-4 sm:mt-0">
                            <div className="sm:hidden text-sm text-neutral-500 mb-1">Price:</div>
                            ${item.product.price.toFixed(2)}
                          </div>
                          
                          {/* Quantity */}
                          <div className="sm:col-span-2 flex justify-center mt-4 sm:mt-0">
                            <div className="sm:hidden text-sm text-neutral-500 mb-1 mr-2">Quantity:</div>
                            <div className="flex items-center border rounded-md">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1 || updatingItemId === item.id}
                                className="h-8 w-8 rounded-none"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="w-10 text-center">{item.quantity}</div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={item.quantity >= item.product.stock || updatingItemId === item.id}
                                className="h-8 w-8 rounded-none"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Subtotal */}
                          <div className="sm:col-span-2 text-right mt-4 sm:mt-0">
                            <div className="sm:hidden text-sm text-neutral-500 mb-1">Subtotal:</div>
                            <div className="font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-sm text-red-600 hover:text-red-800 flex items-center mt-2 hidden sm:inline-flex sm:justify-end"
                              disabled={updatingItemId === item.id}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between py-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleClearCart}
                    className="text-neutral-700"
                  >
                    Clear Cart
                  </Button>
                  
                  <Button asChild variant="outline" className="border-primary text-primary">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <Card className="shadow-sm sticky top-24">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 
                          ? "Free" 
                          : `$${shippingCost.toFixed(2)}`
                        }
                      </span>
                    </div>
                    
                    {subtotal < 50 && (
                      <div className="text-sm text-green-600">
                        Add ${(50 - subtotal).toFixed(2)} more to qualify for free shipping
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
