import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Order, OrderItem, Product } from "@shared/schema";
import { Link } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronUp, Package, User as UserIcon, FileText, Tractor } from "lucide-react";

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Order with items
type OrderWithItems = Order & {
  items: (OrderItem & { product?: Product })[];
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  });

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", `/api/users/${user?.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle profile update
  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Toggle order details
  const toggleOrderDetails = (orderId: number) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-heading">My Account</h1>
      
      <Tabs defaultValue="orders" className="space-y-8">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="mr-2 h-4 w-4" /> My Orders
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center">
            <UserIcon className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          {user?.role === "farmer" && (
            <TabsTrigger value="farmer" className="flex items-center">
              <Tractor className="mr-2 h-4 w-4" /> Farmer Dashboard
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and track all your past orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                  <p className="mt-2">Loading your orders...</p>
                </div>
              ) : orders && orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <React.Fragment key={order.id}>
                        <TableRow>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{formatDate(order.created)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleOrderDetails(order.id)}
                              className="flex items-center"
                            >
                              {openOrderId === order.id ? (
                                <>Hide Details <ChevronUp className="ml-1 h-4 w-4" /></>
                              ) : (
                                <>View Details <ChevronDown className="ml-1 h-4 w-4" /></>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        {/* Order details */}
                        {openOrderId === order.id && (
                          <TableRow>
                            <TableCell colSpan={5} className="bg-gray-50 p-0">
                              <div className="p-4">
                                <h4 className="text-sm font-medium mb-2">Order Items</h4>
                                <div className="space-y-3">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                          <img 
                                            src={item.product?.image || "https://via.placeholder.com/40"} 
                                            alt={item.product?.name || "Product"} 
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-medium">
                                            {item.product?.name || "Product"} × {item.quantity}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            ${item.price.toFixed(2)} each
                                          </p>
                                        </div>
                                      </div>
                                      <p className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex justify-between text-sm">
                                    <span>Shipping Address:</span>
                                    <span className="text-right">{order.address}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mt-2">
                                    <span>Phone:</span>
                                    <span>{order.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <Link href="/shop">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            Email address cannot be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {user?.role === "farmer" && (
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Tell customers about your farm and growing practices..."
                                className="min-h-32"
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your public farmer profile
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Button 
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge className="mt-2">
                    {user?.role === "farmer" ? "Farmer" : "Customer"}
                  </Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Member Since:</span>
                    <span>{user?.created ? formatDate(user.created) : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Orders Placed:</span>
                    <span>{orders?.length || 0}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Change Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and a new password below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="current">Current Password</Label>
                          <Input id="current" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new">New Password</Label>
                          <Input id="new" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm">Confirm New Password</Label>
                          <Input id="confirm" type="password" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Farmer Dashboard Tab */}
        {user?.role === "farmer" && (
          <TabsContent value="farmer">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Dashboard</CardTitle>
                <CardDescription>
                  Manage your products and orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {orders?.flatMap(o => o.items).filter(i => i.farmerId === user.id).length || 0}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/farmer/products">Manage Products</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {orders?.filter(o => o.status === "pending" && 
                          o.items.some(i => i.farmerId === user.id)).length || 0}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Pending Orders
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ${orders?.flatMap(o => o.items)
                          .filter(i => i.farmerId === user.id)
                          .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                          .toFixed(2) || "0.00"}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Sales Report
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button asChild>
                    <Link href="/farmer/products/new">Add New Product</Link>
                  </Button>
                  <Button variant="outline">Update Inventory</Button>
                  <Button variant="outline">View Customer Feedback</Button>
                </div>
                
                {/* Recent orders from this farmer */}
                <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                
                {orders && orders.filter(o => o.items.some(i => i.farmerId === user.id)).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter(o => o.items.some(i => i.farmerId === user.id))
                        .slice(0, 5)
                        .map((order) => {
                          // Filter items belonging to this farmer
                          const farmerItems = order.items.filter(i => i.farmerId === user.id);
                          // Calculate total amount for this farmer's items
                          const farmerTotal = farmerItems.reduce((sum, item) => 
                            sum + (item.price * item.quantity), 0);
                            
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.id}</TableCell>
                              <TableCell>{formatDate(order.created)}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell>{`Customer #${order.userId}`}</TableCell>
                              <TableCell>{farmerItems.length} products</TableCell>
                              <TableCell className="text-right">${farmerTotal.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p>No orders for your products yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={`border-t border-gray-200 ${className || ""}`}></div>;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}
