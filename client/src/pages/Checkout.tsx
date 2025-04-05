import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShoppingBag, ArrowRight, CreditCard, Landmark, Ban } from "lucide-react";

// Define schema for checkout form
const checkoutSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash_on_delivery"])
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  // Setup form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
      paymentMethod: "credit_card"
    }
  });

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate("/login?redirect=checkout");
    return null;
  }

  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create order objects for API
      const orderData = {
        customerId: user.id,
        status: "pending",
        total,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        paymentMethod: values.paymentMethod
      };
      
      // Submit order
      await apiRequest("POST", "/api/orders", orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      
      // Show success toast
      toast({
        title: "Order placed successfully",
        description: "Thank you for your order! You will receive a confirmation email shortly."
      });
      
      // Redirect to order confirmation page (can be implemented later)
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Farm Fresh Market</title>
        <meta name="description" content="Complete your purchase from Farm Fresh Market." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-heading mb-6">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm mb-6 lg:mb-0">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="City" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="ZIP Code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors">
                                  <RadioGroupItem value="credit_card" id="credit_card" />
                                  <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                                    Credit Card
                                  </Label>
                                </div>
                                
                                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors">
                                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                  <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                                    <Landmark className="mr-2 h-5 w-5 text-primary" />
                                    Bank Transfer
                                  </Label>
                                </div>
                                
                                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors">
                                  <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                                  <Label htmlFor="cash_on_delivery" className="flex items-center cursor-pointer">
                                    <Ban className="mr-2 h-5 w-5 text-primary" />
                                    Cash on Delivery
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4 lg:hidden">
                      <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Place Order"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <Card className="shadow-sm sticky top-24">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="max-h-80 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center py-3 border-b last:border-0">
                      <div className="w-16 h-16 rounded overflow-hidden mr-3 shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium truncate">{item.product.name}</h3>
                        <div className="text-sm text-neutral-500">
                          {item.quantity} x ${item.product.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-medium ml-3">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
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
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="hidden lg:block">
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full bg-primary hover:bg-primary-dark text-white"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
