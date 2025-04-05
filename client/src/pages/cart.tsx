import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useCart } from '@/lib/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { ShoppingCart, ArrowRight, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Cart = () => {
  const { cartItems, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Your Cart - FarmFresh Market</title>
        <meta name="description" content="View and manage items in your shopping cart" />
      </Helmet>

      <h1 className="text-3xl font-bold text-neutral-800 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-neutral-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-neutral-800">
                    Cart Items ({totalItems})
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-neutral-500 hover:text-red-500"
                    onClick={() => clearCart()}
                  >
                    Clear Cart
                  </Button>
                </div>
                
                <div>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-neutral-600">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="my-4 border-t border-b py-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    Shipping costs and taxes will be calculated at checkout.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark text-white" 
                  size="lg"
                  asChild
                >
                  <Link href="/checkout">
                    <div className="flex items-center justify-center">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
