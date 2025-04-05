import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import FarmerDashboard from "@/pages/FarmerDashboard";
import FarmerProducts from "@/pages/FarmerProducts";
import FarmerOrders from "@/pages/FarmerOrders";
import UserProfile from "@/pages/UserProfile";
import UserOrders from "@/pages/UserOrders";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Router() {
  const { user } = useAuth();
  const isFarmer = user?.role === "farmer";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/shop/:category" component={Shop} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/orders" component={UserOrders} />
          
          {/* Farmer routes - only accessible if user is a farmer */}
          {isFarmer && <Route path="/farmer/dashboard" component={FarmerDashboard} />}
          {isFarmer && <Route path="/farmer/products" component={FarmerProducts} />}
          {isFarmer && <Route path="/farmer/orders" component={FarmerOrders} />}
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
