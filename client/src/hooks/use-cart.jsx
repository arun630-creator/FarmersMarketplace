import { createContext, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { toast } = useToast();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch cart");
        }
        
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const res = await apiRequest("POST", "/api/cart/items", { productId, quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const res = await apiRequest("PUT", `/api/cart/items/${itemId}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId) => {
      await apiRequest("DELETE", `/api/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to clear cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function addToCart(productId, quantity) {
    addToCartMutation.mutate({ productId, quantity });
  }

  function updateQuantity(itemId, quantity) {
    updateQuantityMutation.mutate({ itemId, quantity });
  }

  function removeItem(itemId) {
    removeItemMutation.mutate(itemId);
  }

  function clearCart() {
    clearCartMutation.mutate();
  }

  return (
    <CartContext.Provider value={{
      cart: cart ?? null,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}