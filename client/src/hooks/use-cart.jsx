import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CartContext = createContext(null);

// Helper for local storage
const LOCAL_STORAGE_KEY = "farmfresh_cart";

export function CartProvider({ children }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [localCart, setLocalCart] = useState(() => {
    if (typeof window === "undefined") return { items: [] };
    
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { items: [] };
      }
    }
    return { items: [] };
  });

  // Fetch cart from server if user is logged in
  const { data: serverCart, isLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      if (!user) return null;
      const res = await fetch("/api/cart");
      if (!res.ok) {
        if (res.status === 404) {
          // Create a cart for the user if they don't have one
          const newCartRes = await apiRequest("POST", "/api/cart", { userId: user.id });
          return await newCartRes.json();
        }
        throw new Error("Failed to fetch cart");
      }
      return await res.json();
    },
    enabled: !!user,
  });

  // Add item to cart
  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }) => {
      if (!user) {
        // Add to local cart
        const existingItem = localCart.items.find(item => item.productId === productId);
        
        if (existingItem) {
          const updatedItems = localCart.items.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          const newCart = { ...localCart, items: updatedItems };
          setLocalCart(newCart);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
          return newCart;
        } else {
          const newItems = [...localCart.items, { productId, quantity }];
          const newCart = { ...localCart, items: newItems };
          setLocalCart(newCart);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
          return newCart;
        }
      } else {
        // Add to server cart
        if (!serverCart) throw new Error("Cart not loaded");
        
        const res = await apiRequest("POST", "/api/cart/items", {
          cartId: serverCart.id,
          productId,
          quantity,
        });
        
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item added to cart",
        description: "The item has been added to your cart",
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

  // Update cart item quantity
  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      if (!user) {
        // Update local cart
        const updatedItems = localCart.items.map(item => 
          item.id === itemId || item.productId === itemId
            ? { ...item, quantity }
            : item
        );
        const newCart = { ...localCart, items: updatedItems };
        setLocalCart(newCart);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      } else {
        // Update server cart
        const res = await apiRequest("PATCH", `/api/cart/items/${itemId}`, { quantity });
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (itemId) => {
      if (!user) {
        // Remove from local cart
        const updatedItems = localCart.items.filter(item => 
          item.id !== itemId && item.productId !== itemId
        );
        const newCart = { ...localCart, items: updatedItems };
        setLocalCart(newCart);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      } else {
        // Remove from server cart
        await apiRequest("DELETE", `/api/cart/items/${itemId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
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

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        // Clear local cart
        const newCart = { items: [] };
        setLocalCart(newCart);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      } else {
        // Clear server cart
        if (!serverCart) throw new Error("Cart not loaded");
        await apiRequest("DELETE", `/api/cart/${serverCart.id}/items`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
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

  // Merge local cart with server cart when user logs in
  useEffect(() => {
    const mergeLocalCartWithServer = async () => {
      if (user && serverCart && localCart.items.length > 0) {
        try {
          // For each item in local cart, add to server cart
          for (const item of localCart.items) {
            await addItemMutation.mutateAsync({
              productId: item.productId,
              quantity: item.quantity,
            });
          }
          
          // Clear local cart after successful merge
          setLocalCart({ items: [] });
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          
          toast({
            title: "Cart synchronized",
            description: "Your local cart has been merged with your account",
          });
        } catch (error) {
          toast({
            title: "Failed to merge carts",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };

    mergeLocalCartWithServer();
  }, [user, serverCart]);

  // Determine which cart to use
  const cart = user ? serverCart : localCart;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem: addItemMutation.mutate,
        updateItem: updateItemMutation.mutate,
        removeItem: removeItemMutation.mutate,
        clearCart: clearCartMutation.mutate,
        isAddingItem: addItemMutation.isPending,
        isUpdatingItem: updateItemMutation.isPending,
        isRemovingItem: removeItemMutation.isPending,
        isClearingCart: clearCartMutation.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}