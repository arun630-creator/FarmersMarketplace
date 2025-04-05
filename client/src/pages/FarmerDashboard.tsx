import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Product, OrderItem } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Helmet } from "react-helmet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { 
  Package,
  ShoppingCart,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";

// Define colors for the charts
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Check if user is a farmer, if not redirect to home
  useEffect(() => {
    if (user && user.role !== "farmer") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch farmer's products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (data) => data.filter(product => product.farmerId === user?.id),
    enabled: !!user
  });

  // Fetch farmer's orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<OrderItem[]>({
    queryKey: ["/api/farmer/orders"],
    enabled: !!user
  });

  // Process order data for status chart
  const orderStatusData = orders ? [
    { name: "Pending", value: orders.filter(order => order.status === "pending").length },
    { name: "Processing", value: orders.filter(order => order.status === "processing").length },
    { name: "Shipped", value: orders.filter(order => order.status === "shipped").length },
    { name: "Delivered", value: orders.filter(order => order.status === "delivered").length },
    { name: "Canceled", value: orders.filter(order => order.status === "canceled").length }
  ] : [];

  // Group orders by day for the past week
  const getLastWeekOrdersData = () => {
    if (!orders) return [];
    
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      
      // Count orders from this day
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.order?.createdAt || "");
        return orderDate >= dayStart && orderDate <= dayEnd;
      });
      
      result.push({
        name: dayName,
        orders: dayOrders.length
      });
    }
    
    return result;
  };
  
  const ordersByDayData = getLastWeekOrdersData();

  // Calculate summary statistics
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === "pending").length || 0;
  const totalSales = orders?.reduce((sum, order) => sum + order.price * order.quantity, 0) || 0;

  // Get recent orders
  const recentOrders = orders?.slice(0, 5) || [];

  if (!user || user.role !== "farmer") {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Farmer Dashboard - Farm Fresh Market</title>
        <meta name="description" content="Monitor your farm sales and manage orders." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold font-heading">Farmer Dashboard</h1>
          <div className="mt-4 md:mt-0 space-x-3">
            <Button asChild variant="outline" className="border-primary text-primary">
              <a href="/farmer/products">Manage Products</a>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary-dark text-white">
              <a href="/farmer/orders">View Orders</a>
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Products</p>
                  <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
                </div>
                <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Pending Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{pendingOrders}</h3>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Total Sales</p>
                  <h3 className="text-2xl font-bold mt-1">${totalSales.toFixed(2)}</h3>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Orders</CardTitle>
              <CardDescription>Number of orders received per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {isLoadingOrders ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-neutral-500">Loading data...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ordersByDayData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Distribution of orders by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {isLoadingOrders ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-neutral-500">Loading data...</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your most recent orders</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <a href="/farmer/orders">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-1">
                {recentOrders.map((order) => (
                  <div key={order.id} className="grid grid-cols-12 py-3 border-b last:border-0">
                    <div className="col-span-5 sm:col-span-4 flex items-center">
                      <div className="w-8 h-8 mr-2 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={order.product?.imageUrl || ""} 
                          alt={order.product?.name || "Product"} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{order.product?.name || "Unknown Product"}</p>
                        <p className="text-xs text-neutral-500">
                          Order #{order.orderId} • {new Date(order.order?.createdAt || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-3 flex items-center">
                      <div>
                        <p className="text-sm">${order.price.toFixed(2)} x {order.quantity}</p>
                        <p className="text-xs text-neutral-500">
                          ${(order.price * order.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-3 flex items-center">
                      <div className={`
                        px-2 py-1 rounded-full text-xs 
                        ${order.status === "pending" ? "bg-amber-100 text-amber-800" : ""}
                        ${order.status === "processing" ? "bg-blue-100 text-blue-800" : ""}
                        ${order.status === "shipped" ? "bg-purple-100 text-purple-800" : ""}
                        ${order.status === "delivered" ? "bg-green-100 text-green-800" : ""}
                        ${order.status === "canceled" ? "bg-red-100 text-red-800" : ""}
                      `}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-end">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">No Orders Yet</h3>
                <p className="text-neutral-500">You haven't received any orders yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FarmerDashboard;
