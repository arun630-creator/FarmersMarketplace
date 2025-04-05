import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/lib/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, Package, MapPin, User, ShoppingBag, ExternalLink } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login?redirect=profile");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch user's orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/orders'],
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>My Profile - FarmFresh Market</title>
        <meta name="description" content="Manage your account and view your orders" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">My Profile</h1>
        <p className="text-neutral-600">Manage your account and view your order history</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your personal details and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">First Name</h3>
                      <p className="text-neutral-800">{user.firstName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Last Name</h3>
                      <p className="text-neutral-800">{user.lastName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Email Address</h3>
                    <p className="text-neutral-800">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Username</h3>
                    <p className="text-neutral-800">{user.username}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Phone Number</h3>
                    <p className="text-neutral-800">{user.phone || "Not provided"}</p>
                  </div>
                  
                  {user.isFarmer && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Farmer Details</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-1">Farm Name</h4>
                          <p className="text-neutral-800">{user.farmName || "Not provided"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-1">Farm Description</h4>
                          <p className="text-neutral-800">{user.farmDescription || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="outline">Change Password</Button>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center flex-col text-center h-40">
                  {user.isFarmer ? (
                    <>
                      <div className="bg-green-100 rounded-full p-4 mb-4">
                        <User className="h-8 w-8 text-green-700" />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-1">Farmer Account</h3>
                      <p className="text-sm text-neutral-600">You can sell products on FarmFresh Market</p>
                      <Button 
                        variant="link" 
                        className="mt-4"
                        asChild
                      >
                        <a href="/farmer-dashboard">
                          Go to Farmer Dashboard
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-100 rounded-full p-4 mb-4">
                        <User className="h-8 w-8 text-blue-700" />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-1">Customer Account</h3>
                      <p className="text-sm text-neutral-600">Shop for fresh produce from local farmers</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and track your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p>Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">No orders yet</h3>
                  <p className="text-neutral-600 mb-4">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <a href="/products">Start Shopping</a>
                  </Button>
                </div>
              ) : (
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
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-neutral-100 text-neutral-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="link" size="sm" asChild>
                            <a href={`/orders/${order.id}`}>View Details</a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>
                Manage your shipping and billing addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-medium text-neutral-800">Default Address</h3>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-neutral-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-neutral-800">{user.firstName} {user.lastName}</p>
                        <p className="text-neutral-600">{user.address}</p>
                        <p className="text-neutral-600">{user.city}, {user.state} {user.zipCode}</p>
                        <p className="text-neutral-600">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-2">No addresses saved</h3>
                  <p className="text-neutral-600 mb-4">You haven't saved any addresses yet.</p>
                  <Button>Add New Address</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
