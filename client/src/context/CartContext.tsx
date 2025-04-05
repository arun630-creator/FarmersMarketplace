import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product } from "@shared/schema";

interface ExtendedCartItem extends CartItem {
  product: Product;
}

interface CartContextType {
  cartItems: ExtendedCartItem[];
  addToCart: (item: { productId: number; quantity: number }) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch cart items when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        // Clear cart if user is not logged in
        setCartItems([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/cart", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          console.error("Failed to fetch cart items:", response.statusText);
          toast({
            title: "Error",
            description: "Failed to load your cart. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if user is logged in
    if (user) {
      fetchCartItems();
    }
  }, [user, toast]);

  const addToCart = async (item: { productId: number; quantity: number }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/cart", item);
      const newItem = await response.json();
      
      // Check if item is already in cart, if so update it instead of adding
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );
      
      if (existingItemIndex >= 0) {
        // Replace existing item with updated one
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = newItem;
        setCartItems(updatedItems);
      } else {
        // Add new item to cart
        setCartItems([...cartItems, newItem]);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      const updatedItem = await response.json();
      
      // Update the item in the cart
      setCartItems(
        cartItems.map((item) => (item.id === itemId ? updatedItem : item))
      );
      return updatedItem;
    } catch (error) {
      console.error("Failed to update cart item:", error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      
      // Remove the item from the cart
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // This would normally call an API endpoint, but for demo purposes
      // we'll just clear the local state
      // await apiRequest("DELETE", "/api/cart");
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
