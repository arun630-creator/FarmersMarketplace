import React from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Trash2, AlertCircle, Loader2 } from "lucide-react";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  // Empty cart state
  if (!isLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 font-heading text-center">Your Cart</h1>
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <ShoppingCart className="h-20 w-20 mx-auto text-neutral-300" />
          </div>
          <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8 font-heading">Your Cart</h1>
        <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
        <p className="mt-4 text-neutral-600">Loading your cart...</p>
      </div>
    );
  }

  // Helper function to handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Get subtotal
  const subtotal = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  // Shipping cost logic
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  
  // Total cost
  const totalCost = subtotal + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 font-heading">Your Cart</h1>
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/">
          <span className="hover:text-primary cursor-pointer">Home</span>
        </Link>
        <span className="mx-2">›</span>
        <span>Cart</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items list */}
        <div className="lg:w-2/3">
          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>Items ({cart?.items.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-600 hover:text-red-600"
                  onClick={() => clearCart()}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cart?.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 border-b border-gray-100 last:border-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product image */}
                    <div className="sm:w-24 h-24">
                      <Link href={`/product/${item.product?.id}`}>
                        <div className="cursor-pointer">
                          <img
                            src={item.product?.image || "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a"}
                            alt={item.product?.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Product details */}
                    <div className="flex-1">
                      <Link href={`/product/${item.product?.id}`}>
                        <div className="font-medium text-lg text-neutral-900 hover:text-primary cursor-pointer">
                          {item.product?.name}
                        </div>
                      </Link>
                      
                      <div className="text-sm text-neutral-500 mb-2">
                        ${item.price.toFixed(2)} / {item.product?.unit}
                      </div>

                      {/* Product quantity controls and subtotal */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-12 h-8 border-y border-gray-300 text-center"
                          />
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product?.stock || 0)}
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                          <div className="font-bold sm:mr-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 -mr-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping button */}
              <div className="mt-6 text-center sm:text-left">
                <Link href="/shop">
                  <div className="text-primary hover:text-primary-dark font-medium cursor-pointer">
                    ← Continue Shopping
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="lg:w-1/3">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <div className="text-sm text-gray-500 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Free shipping on orders over $50</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                disabled={cart?.items.length === 0}
                asChild
              >
                <Link href={user ? "/checkout" : "/auth?redirect=/checkout"}>
                  Proceed to Checkout
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
