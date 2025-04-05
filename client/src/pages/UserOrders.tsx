import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import {
  ShoppingBag,
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Eye
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

const UserOrders = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=orders");
    }
  }, [user, navigate]);

  // Fetch user's orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user
  });

  // Filter orders based on search term and selected tab
  const filteredOrders = orders
    ? orders.filter(order => {
        // Search filter
        const matchesSearch =
          !searchTerm ||
          order.id.toString().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Tab filter
        const matchesTab =
          selectedTab === "all" ||
          order.status === selectedTab;
        
        return matchesSearch && matchesTab;
      })
    : [];

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
  
  // Get order status label and class
  const getOrderStatus = (status: string) => {
    return orderStatusMap[status as keyof typeof orderStatusMap] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      icon: <Clock className="h-4 w-4 mr-2" />,
      color: "bg-gray-100 text-gray-800"
    };
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Farm Fresh Market</title>
        <meta name="description" content="View your order history on Farm Fresh Market." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-heading mb-6">My Orders</h1>
        
        {/* Search */}
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
          
          <TabsContent value={selectedTab} className="mt-0">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>
                  {selectedTab === "all" 
                    ? "All Orders" 
                    : `${orderStatusMap[selectedTab as keyof typeof orderStatusMap]?.label} Orders`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Accordion key={order.id} type="single" collapsible className="border rounded-lg">
                        <AccordionItem value={`order-${order.id}`} className="border-0">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full text-left">
                              <div className="flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-3 text-primary" />
                                <div>
                                  <p className="font-medium">Order #{order.id}</p>
                                  <p className="text-sm text-neutral-500">
                                    {formatDate(order.createdAt.toString())}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center mt-2 md:mt-0">
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mr-3 ${getOrderStatus(order.status).color}`}>
                                  {getOrderStatus(order.status).icon}
                                  {getOrderStatus(order.status).label}
                                </div>
                                <p className="font-medium">${order.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              {/* Order Items */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">Order Items</h4>
                                {order.items?.map((item) => (
                                  <div key={item.id} className="flex items-center py-2 border-b last:border-0">
                                    <div className="w-12 h-12 mr-3 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                      <img 
                                        src={item.product?.imageUrl} 
                                        alt={item.product?.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <p className="font-medium">{item.product?.name}</p>
                                      <p className="text-sm text-neutral-500">
                                        {item.quantity} x ${item.price.toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getOrderStatus(item.status).color}`}>
                                        {getOrderStatus(item.status).label}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <Separator />
                              
                              {/* Shipping Address */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                                  <p className="text-neutral-700">{order.address}</p>
                                  <p className="text-neutral-700">{order.city}, {order.state} {order.zipCode}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Payment Method</h4>
                                  <p className="text-neutral-700 capitalize">
                                    {order.paymentMethod.replace(/_/g, ' ')}
                                  </p>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              {/* Order Summary */}
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-neutral-700">Subtotal</span>
                                  <span>${(order.total - 5.99).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-700">Shipping</span>
                                  <span>$5.99</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                  <span>Total</span>
                                  <span>${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex justify-end pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="mr-2"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                {(order.status === "pending" || order.status === "processing") && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Orders Found</h3>
                    {searchTerm ? (
                      <p className="text-neutral-500">No orders match your search criteria.</p>
                    ) : (
                      <p className="text-neutral-500">You haven't placed any orders yet.</p>
                    )}
                    {!searchTerm && (
                      <Button 
                        asChild
                        className="bg-primary hover:bg-primary-dark text-white mt-4"
                      >
                        <a href="/shop">
                          Start Shopping
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserOrders;
