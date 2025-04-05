import React from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";

export default function CartPage() {
  const { cart, removeItem, updateItem, clearCart, isLoading } = useCart();
  
  // Fetch product details for cart items
  const { data: cartWithProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/cart/products", cart?.items?.map(item => item.productId)],
    queryFn: async () => {
      if (!cart || !cart.items || cart.items.length === 0) return { ...cart, items: [] };
      
      // Get product details for each cart item
      const productsPromises = cart.items.map(item => 
        fetch(`/api/products/${item.productId}`)
          .then(res => res.json())
          .then(product => ({ ...item, product }))
      );
      
      const itemsWithProducts = await Promise.all(productsPromises);
      return { ...cart, items: itemsWithProducts };
    },
    enabled: !!cart && cart.items && cart.items.length > 0,
  });
  
  // Calculate total price
  const totalPrice = cartWithProducts?.items?.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;
  
  if (isLoading || isLoadingProducts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <Link href="/shop">
            <a className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Continue Shopping
            </a>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Price</th>
                  <th className="py-3 px-4 font-medium text-gray-600 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {cartWithProducts?.items?.map((item) => (
                  <tr key={item.id || item.productId} className="border-b border-gray-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                          {item.product?.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.product?.farmer?.name || "Local Farmer"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateItem({ 
                            itemId: item.id || item.productId, 
                            quantity: Math.max(1, item.quantity - 1) 
                          })}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-3 w-10 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateItem({ 
                            itemId: item.id || item.productId, 
                            quantity: item.quantity + 1 
                          })}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => removeItem(item.id || item.productId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button 
              onClick={() => clearCart()}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear Cart
            </button>
            
            <Link href="/shop">
              <a className="text-sm text-green-600 hover:text-green-700">
                Continue Shopping
              </a>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-gray-800 font-medium">Estimated Total</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Link href="/checkout">
              <a className="w-full block text-center bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors">
                Proceed to Checkout
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}