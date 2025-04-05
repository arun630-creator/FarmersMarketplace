import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, User, Review } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, StarHalf, Truck, ShieldCheck, Leaf, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Product query
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId
  });

  // Farmer query
  const { data: farmer } = useQuery<Partial<User>>({
    queryKey: [`/api/farmers/${product?.farmerId}`],
    enabled: !!product?.farmerId
  });

  // Reviews query
  const { data: reviews } = useQuery<(Review & { user: { name: string, profileImage?: string } })[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId
  });

  // Error state
  if (!productId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleAddToCart = () => {
    if (user) {
      addToCart(product.id, quantity);
    } else {
      window.location.href = `/auth?redirect=/product/${product.id}`;
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400" size={18} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-amber-400 text-amber-400" size={18} />);
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }
    
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/">
          <a className="hover:text-primary">Home</a>
        </Link>
        <span className="mx-2">›</span>
        <Link href="/shop">
          <a className="hover:text-primary">Shop</a>
        </Link>
        <span className="mx-2">›</span>
        <span>{product.name}</span>
      </div>

      {/* Product details */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a"} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="md:w-1/2">
          <div className="flex flex-wrap gap-2 mb-2">
            {product.isOrganic && (
              <Badge className="bg-primary text-white">Organic</Badge>
            )}
            {product.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="border-amber-500 text-amber-700">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-2 font-heading">{product.name}</h1>
          
          {/* Rating */}
          {reviews && reviews.length > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderRatingStars(averageRating)}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-2xl font-bold text-neutral-900 mb-4">
            ${product.price.toFixed(2)}
            <span className="text-base font-normal text-neutral-500 ml-1">/{product.unit}</span>
          </div>

          {/* Description */}
          <p className="text-neutral-700 mb-6">{product.description}</p>

          {/* Availability */}
          <div className="mb-6">
            <span className="font-medium">Availability: </span>
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock} {product.stock === 1 ? 'unit' : 'units'})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Add to cart section */}
          {product.stock > 0 && (
            <div className="flex items-center mb-6">
              <div className="flex border border-gray-300 rounded-md mr-4">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-1 border-r border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-l-md"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock}
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= product.stock) {
                      setQuantity(val);
                    }
                  }}
                  className="w-12 text-center py-1 border-0"
                />
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-1 border-l border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-r-md"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2"
              >
                <Heart size={18} />
              </Button>
            </div>
          )}

          {/* Farmer info */}
          {farmer && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <Avatar className="mr-2">
                  <AvatarImage src={farmer.profileImage} alt={farmer.name} />
                  <AvatarFallback>{farmer.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{farmer.name}</p>
                  <p className="text-sm text-gray-600">Local Farmer</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{farmer.bio}</p>
              <Link href={`/farmer/${farmer.id}`}>
                <a className="text-primary hover:text-primary-dark font-medium text-sm">
                  View all products from this farmer
                </a>
              </Link>
            </div>
          )}

          {/* Shipping info */}
          <div className="space-y-3">
            <div className="flex items-center">
              <Truck size={18} className="mr-2 text-primary" />
              <span className="text-sm">Free shipping for orders over $50</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck size={18} className="mr-2 text-primary" />
              <span className="text-sm">Fresh quality guarantee</span>
            </div>
            <div className="flex items-center">
              <Leaf size={18} className="mr-2 text-primary" />
              <span className="text-sm">Sustainably grown and sourced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional info tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews {reviews?.length ? `(${reviews.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              <p>{product.description}</p>
              
              {product.tags && product.tags.length > 0 && (
                <>
                  <h4 className="text-lg font-bold mt-6 mb-2">Features</h4>
                  <ul>
                    {product.isOrganic && <li>Certified Organic</li>}
                    {product.tags.map((tag, index) => (
                      <li key={index}>{tag}</li>
                    ))}
                    <li>Freshly harvested for maximum flavor and nutrition</li>
                    <li>Grown by local farmers using sustainable practices</li>
                  </ul>
                </>
              )}
              
              <h4 className="text-lg font-bold mt-6 mb-2">Storage Tips</h4>
              <p>For maximum freshness, store in a cool, dry place or refrigerate as appropriate for this product type.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderRatingStars(averageRating)}
                  </div>
                  <span className="font-bold mr-1">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">out of 5</span>
                </div>
                
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={review.user.profileImage} />
                        <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex text-amber-400">
                          {renderRatingStars(review.rating)}
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(review.created).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
                {user ? (
                  <Button>Write a Review</Button>
                ) : (
                  <Button asChild>
                    <Link href={`/auth?redirect=/product/${product.id}`}>
                      Sign in to Write a Review
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shipping" className="py-6">
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
              <p>We aim to deliver the freshest produce to your doorstep. Here's what you need to know:</p>
              
              <h4 className="text-lg font-bold mt-6 mb-2">Delivery Areas</h4>
              <p>Currently, we deliver to the following areas:</p>
              <ul>
                <li>Within city limits: 1-2 business days</li>
                <li>Surrounding suburbs: 2-3 business days</li>
              </ul>
              
              <h4 className="text-lg font-bold mt-6 mb-2">Shipping Costs</h4>
              <ul>
                <li>Orders under $50: $5.99 shipping fee</li>
                <li>Orders over $50: FREE shipping</li>
              </ul>
              
              <h4 className="text-lg font-bold mt-6 mb-2">Returns & Refunds</h4>
              <p>If you're not completely satisfied with your purchase, please contact us within 24 hours of delivery. We'll gladly replace any items that don't meet our quality standards or provide a full refund.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products section would go here */}
    </div>
  );
}
