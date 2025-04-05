import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';

const Checkout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { cartItems } = useCart();
  const [, navigate] = useLocation();

  // Redirect if cart is empty or user is not authenticated
  useEffect(() => {
    if (!isLoading) {
      if (cartItems.length === 0) {
        navigate('/cart');
      } else if (!isAuthenticated) {
        navigate('/login?redirect=checkout');
      }
    }
  }, [cartItems.length, isAuthenticated, isLoading, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Checkout - FarmFresh Market</title>
        <meta name="description" content="Complete your purchase" />
      </Helmet>

      <h1 className="text-3xl font-bold text-neutral-800 mb-8">Checkout</h1>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : isAuthenticated && cartItems.length > 0 ? (
        <CheckoutForm />
      ) : null}
    </div>
  );
};

export default Checkout;
