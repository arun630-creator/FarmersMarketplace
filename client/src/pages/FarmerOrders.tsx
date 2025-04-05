import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { OrderItem } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Helmet } from "react-helmet";
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package as PackageIcon
} from "lucide-react";

const orderStatusMap = {
  pending: {
    label: "Pending",
    icon: <Clock className="h-4 w-4 mr-2" />,
    color: "bg-amber-100 text-amber-800"
  },
  processing: {
    label: "Processing",
    icon: <Package className="h-4 w-4 mr-2" />,
    color: "bg-blue-100 text-blue-800"
  },
  shipped: {
    label: "Shipped",
    icon: <Truck className="h-4 w-4 mr-2" />,
    color: "bg-purple-100 text-purple-800"
  },
  delivered: {
    label: "Delivered",
    icon: <CheckCircle className="h-4 w-4 mr-2" />,
    color: "bg-green-100 text-green-800"
  },
  canceled: {
    label: "Canceled",
    icon: <XCircle className="h-4 w-4 mr-2" />,
    color: "bg-red-100 text-red-800"
  }
};

const FarmerOrders = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Check if user is a farmer, if not redirect to home
  useEffect(() => {
    if (user && user.role !== "farmer") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch farmer's orders
  const { data: orders, isLoading } = useQuery<OrderItem[]>({
    queryKey: ["/api/farmer/orders"],
    enabled: !!user
  });

  // Filter orders based on search term and selected tab
  const filteredOrders = orders
    ? orders.filter(order => {
        // Search filter
        const matchesSearch =
          !searchTerm ||
          (order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order?.id?.toString().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Tab filter
        const matchesTab =
          selectedTab === "all" ||
          (selectedTab === "pending" && order.status === "pending") ||
          (selectedTab === "processing" && order.status === "processing") ||
          (selectedTab === "shipped" && order.status === "shipped") ||
          (selectedTab === "delivered" && order.status === "delivered") ||
          (selectedTab === "canceled" && order.status === "canceled");
        
        return matchesSearch && matchesTab;
      })
    : [];

  // Update order status
  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      setIsUpdating(orderId);
      
      await apiRequest("PUT", `/api/farmer/orders/${orderId}`, { status });
      
      // Invalidate orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/orders"] });
      
      toast({
        title: "Order updated",
        description: `Order status has been updated to ${status}.`
      });
    } catch (error) {
      toast({
        title: "Failed to update order",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Count orders by status
  const pendingCount = orders ? orders.filter(order => order.status === "pending").length : 0;
  const processingCount = orders ? orders.filter(order => order.status === "processing").length : 0;
  const shippedCount = orders ? orders.filter(order => order.status === "shipped").length : 0;
  const deliveredCount = orders ? orders.filter(order => order.status === "delivered").length : 0;
  const canceledCount = orders ? orders.filter(order => order.status === "canceled").length : 0;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user || user.role !== "farmer") {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Manage Orders - Farm Fresh Market</title>
        <meta name="description" content="Manage your farm orders on Farm Fresh Market." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold font-heading">Manage Orders</h1>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button asChild variant="outline">
              <a href="/farmer/dashboard">Dashboard</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/farmer/products">Products</a>
            </Button>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>
        
        {/* Order Tabs */}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="all">
              All ({orders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({processingCount})
            </TabsTrigger>
            <TabsTrigger value="shipped">
              Shipped ({shippedCount})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered ({deliveredCount})
            </TabsTrigger>
            <TabsTrigger value="canceled">
              Canceled ({canceledCount})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 font-medium">Order</th>
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b last:border-0">
                            <td className="py-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 mr-3 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img 
                                    src={order.product?.imageUrl} 
                                    alt={order.product?.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{order.product?.name}</p>
                                  <p className="text-xs text-neutral-500">
                                    Order #{order.orderId} • {order.quantity} {order.quantity > 1 ? 'units' : 'unit'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              {order.order?.customerId ? (
                                <div>
                                  <p className="font-medium">Customer #{order.order.customerId}</p>
                                  <p className="text-xs text-neutral-500">{order.order.address}, {order.order.city}</p>
                                </div>
                              ) : (
                                <span className="text-neutral-500">-</span>
                              )}
                            </td>
                            <td className="py-4">
                              {order.order?.createdAt ? (
                                <span>{formatDate(order.order.createdAt.toString())}</span>
                              ) : (
                                <span className="text-neutral-500">-</span>
                              )}
                            </td>
                            <td className="py-4">
                              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${orderStatusMap[order.status as keyof typeof orderStatusMap]?.color}`}>
                                {orderStatusMap[order.status as keyof typeof orderStatusMap]?.icon}
                                {orderStatusMap[order.status as keyof typeof orderStatusMap]?.label}
                              </div>
                            </td>
                            <td className="py-4">
                              ${(order.price * order.quantity).toFixed(2)}
                            </td>
                            <td className="py-4 text-right">
                              <Select
                                disabled={isUpdating === order.id || order.status === "delivered" || order.status === "canceled"}
                                defaultValue={order.status}
                                onValueChange={(value) => handleUpdateStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-[140px] ml-auto">
                                  <SelectValue placeholder="Update status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="canceled">Canceled</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Orders Found</h3>
                    {searchTerm ? (
                      <p className="text-neutral-500">No orders match your search criteria.</p>
                    ) : (
                      <p className="text-neutral-500">You haven't received any orders yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content for other tabs is the same, just filtered by the tab value */}
          {["pending", "processing", "shipped", "delivered", "canceled"].map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center">
                      {orderStatusMap[status as keyof typeof orderStatusMap]?.icon}
                      {orderStatusMap[status as keyof typeof orderStatusMap]?.label} Orders
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <div className="overflow-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-3 font-medium">Order</th>
                            <th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b last:border-0">
                              <td className="py-4">
                                <div className="flex items-center">
                                  <div className="w-12 h-12 mr-3 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img 
                                      src={order.product?.imageUrl} 
                                      alt={order.product?.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{order.product?.name}</p>
                                    <p className="text-xs text-neutral-500">
                                      Order #{order.orderId} • {order.quantity} {order.quantity > 1 ? 'units' : 'unit'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                                {order.order?.customerId ? (
                                  <div>
                                    <p className="font-medium">Customer #{order.order.customerId}</p>
                                    <p className="text-xs text-neutral-500">{order.order.address}, {order.order.city}</p>
                                  </div>
                                ) : (
                                  <span className="text-neutral-500">-</span>
                                )}
                              </td>
                              <td className="py-4">
                                {order.order?.createdAt ? (
                                  <span>{formatDate(order.order.createdAt.toString())}</span>
                                ) : (
                                  <span className="text-neutral-500">-</span>
                                )}
                              </td>
                              <td className="py-4">
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${orderStatusMap[order.status as keyof typeof orderStatusMap]?.color}`}>
                                  {orderStatusMap[order.status as keyof typeof orderStatusMap]?.icon}
                                  {orderStatusMap[order.status as keyof typeof orderStatusMap]?.label}
                                </div>
                              </td>
                              <td className="py-4">
                                ${(order.price * order.quantity).toFixed(2)}
                              </td>
                              <td className="py-4 text-right">
                                <Select
                                  disabled={isUpdating === order.id || order.status === "delivered" || order.status === "canceled"}
                                  defaultValue={order.status}
                                  onValueChange={(value) => handleUpdateStatus(order.id, value)}
                                >
                                  <SelectTrigger className="w-[140px] ml-auto">
                                    <SelectValue placeholder="Update status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PackageIcon className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No {orderStatusMap[status as keyof typeof orderStatusMap]?.label} Orders</h3>
                      <p className="text-neutral-500">You don't have any orders with this status.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default FarmerOrders;
