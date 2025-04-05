import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    unit: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['/api/cart'],
    refetchOnWindowFocus: true,
  });

  // Calculate total items and subtotal
  const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  
  const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
    if (item.product) {
      return sum + (item.product.price * item.quantity);
    }
    return sum;
  }, 0);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) => 
      apiRequest('POST', '/api/cart', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Product added to cart",
        description: "Your product has been added to the cart successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding product",
        description: error.message || "There was an error adding this product to your cart.",
        variant: "destructive",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => 
      apiRequest('PUT', `/api/cart/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating quantity",
        description: error.message || "There was an error updating the quantity.",
        variant: "destructive",
      });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => 
      apiRequest('DELETE', `/api/cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Product removed",
        description: "The product has been removed from your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing product",
        description: error.message || "There was an error removing this product from your cart.",
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => 
      apiRequest('DELETE', '/api/cart'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error clearing cart",
        description: error.message || "There was an error clearing your cart.",
        variant: "destructive",
      });
    },
  });

  // Wrapper functions
  const addToCart = async (productId: number, quantity: number) => {
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = async (itemId: number) => {
    await removeItemMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
