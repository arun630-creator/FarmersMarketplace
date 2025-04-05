import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, Review } from "@shared/schema";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Star, Minus, Plus, ShoppingCart, Truck, RotateCcw, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Rating from "@/components/ui/rating";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { formatCurrency } from "@/lib/utils";

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });
  
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [product ? `/api/products/${product.id}/reviews` : null],
    enabled: !!product,
  });

  const { data: farmer, isLoading: isLoadingFarmer } = useQuery({
    queryKey: [product ? `/api/users/${product?.farmerId}` : null],
    enabled: !!product,
  });

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  // Calculate average rating
  const avgRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/3 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Product Not Found</h2>
        <p className="text-neutral-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/products/category/${product.categoryId}`}>
            {product.categoryId === 1 ? "Fruits" : 
             product.categoryId === 2 ? "Vegetables" : 
             product.categoryId === 3 ? "Grains" : 
             product.categoryId === 4 ? "Dairy" : 
             product.categoryId === 5 ? "Herbs" : "Specialty"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>{product.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/500x500?text=Product+Image"} 
            alt={product.name}
            className="w-full rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <Rating value={avgRating} />
              <span className="ml-2 text-sm text-neutral-600">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
            <span className="mx-3 text-neutral-300">|</span>
            <span className="text-sm text-neutral-600">
              {product.stock > 0 ? 
                <span className="text-green-600">In Stock ({product.stock} available)</span> : 
                <span className="text-red-600">Out of Stock</span>
              }
            </span>
          </div>

          <div className="text-2xl font-bold text-neutral-800 mb-6">
            {formatCurrency(product.price)} <span className="text-sm font-normal text-neutral-500">/{product.unit}</span>
          </div>

          <p className="text-neutral-600 mb-6">{product.description}</p>

          {/* Farm info */}
          {!isLoadingFarmer && farmer && (
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-700 mb-2">Sold by:</h3>
              <a 
                href={`/products?farmer=${product.farmerId}`}
                className="inline-flex items-center text-primary hover:underline"
              >
                {farmer.farmName || `${farmer.firstName} ${farmer.lastName}'s Farm`}
              </a>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-16 mx-2 text-center"
            />
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to cart button */}
          <Button 
            className="w-full mb-4 bg-primary hover:bg-primary-dark text-white"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center p-3">
              <Truck className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-neutral-600">Free Shipping on orders over $50</span>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <RotateCcw className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-neutral-600">Easy Returns within 14 days</span>
            </div>
            <div className="flex flex-col items-center text-center p-3">
              <Shield className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm text-neutral-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full border-b border-neutral-200 mb-6">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Description</h3>
                <p className="text-neutral-600">{product.description}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Specifications</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Category</span>
                    <span className="font-medium">{
                      product.categoryId === 1 ? "Fruits" : 
                      product.categoryId === 2 ? "Vegetables" : 
                      product.categoryId === 3 ? "Grains" : 
                      product.categoryId === 4 ? "Dairy" : 
                      product.categoryId === 5 ? "Herbs" : "Specialty"
                    }</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Unit</span>
                    <span className="font-medium">{product.unit}</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Stock</span>
                    <span className="font-medium">{product.stock}</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Featured</span>
                    <span className="font-medium">{product.isFeatured ? "Yes" : "No"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-4">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Customer Reviews</h3>
              
              {/* Review Stats */}
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <div className="text-5xl font-bold text-neutral-800">{avgRating.toFixed(1)}</div>
                  <div className="flex mt-2">
                    <Rating value={avgRating} size="lg" />
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">Based on {reviews.length} reviews</div>
                </div>
              </div>

              {/* Review List */}
              {isLoadingReviews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-neutral-200 pb-4">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-b border-neutral-200 pb-4">
                      <CardContent className="pt-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-bold text-neutral-800">
                            {/* This would be replaced with the actual user name in a real implementation */}
                            Customer {review.userId}
                          </h4>
                          <span className="text-sm text-neutral-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex mb-3">
                          <Rating value={review.rating} />
                        </div>
                        <p className="text-neutral-600">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">No reviews yet. Be the first to review this product!</p>
              )}

              {/* Write a Review */}
              {user && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-neutral-800 mb-4">Write a Review</h4>
                  {/* Review form would go here */}
                  <p className="text-neutral-600">To write a review, please use this product first.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
