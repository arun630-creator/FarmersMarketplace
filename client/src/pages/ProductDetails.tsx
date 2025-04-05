import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Review } from "@shared/schema";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Star,
  StarHalf,
  Check,
  Minus,
  Plus,
  Truck,
  Store,
  ShieldCheck
} from "lucide-react";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Define schema for review form
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long").max(500)
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ProductDetails = () => {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(5);

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId
  });

  // Fetch product reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId
  });

  // Setup form for reviews
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: ""
    }
  });

  // Check if user has already reviewed this product
  const hasReviewed = reviews?.some(review => review.userId === user?.id);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        description: `Only ${product.stock} units available.`,
        variant: "destructive"
      });
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      quantity
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`
    });
  };

  const onReviewSubmit = async (values: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review.",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiRequest("POST", `/api/products/${productId}/reviews`, {
        rating: selectedRating,
        comment: values.comment
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });

      // Invalidate reviews cache to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  // Helper function to render stars for ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="fill-amber-400 text-amber-400"
          onClick={() => setSelectedRating(i + 1)}
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className="fill-amber-400 text-amber-400" 
          onClick={() => setSelectedRating(fullStars + 0.5)}
        />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="text-amber-400"
          onClick={() => setSelectedRating(fullStars + i + 1)}
        />
      );
    }
    
    return stars;
  };

  // Helper function to render interactive stars for reviews
  const renderInteractiveStars = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            className={`cursor-pointer ${
              rating <= selectedRating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
            onClick={() => setSelectedRating(rating)}
          />
        ))}
      </div>
    );
  };

  // Helper function to get category details
  const getCategoryDetails = (categoryId: number) => {
    const categoryMap: Record<number, { name: string, bgColor: string, textColor: string }> = {
      1: { name: "Vegetables", bgColor: "bg-primary/10", textColor: "text-primary" },
      2: { name: "Fruits", bgColor: "bg-red-100", textColor: "text-red-500" },
      3: { name: "Grains", bgColor: "bg-amber-100", textColor: "text-amber-600" },
      4: { name: "Dairy", bgColor: "bg-blue-100", textColor: "text-blue-500" },
      5: { name: "Eggs", bgColor: "bg-pink-100", textColor: "text-pink-500" },
      6: { name: "Meat", bgColor: "bg-orange-100", textColor: "text-orange-500" },
      7: { name: "Herbs", bgColor: "bg-emerald-100", textColor: "text-emerald-500" },
      8: { name: "Honey", bgColor: "bg-yellow-100", textColor: "text-yellow-500" }
    };
    
    return categoryMap[categoryId] || { name: "Other", bgColor: "bg-gray-100", textColor: "text-gray-700" };
  };

  if (isLoadingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="md:flex md:gap-8">
            <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const category = getCategoryDetails(product.categoryId);

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Farm Fresh Market`}</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:gap-8">
          {/* Product Image */}
          <div className="md:w-1/2 md:sticky md:top-32 md:self-start">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto rounded-lg shadow-md object-cover aspect-square md:aspect-auto md:max-h-[500px]"
            />
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="mb-2">
              <span className={`text-xs font-medium ${category.textColor} ${category.bgColor} px-2 py-1 rounded`}>
                {category.name}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold font-heading mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400 mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-neutral-700">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
            
            <p className="text-lg mb-6">{product.description}</p>
            
            <div className="mb-6">
              <div className="text-2xl font-bold">${product.price.toFixed(2)}<span className="text-sm text-neutral-700 font-normal"> / {product.unit}</span></div>
              
              {product.stock > 0 ? (
                <div className="text-green-600 text-sm mt-1">In Stock ({product.stock} available)</div>
              ) : (
                <div className="text-red-600 text-sm mt-1">Out of Stock</div>
              )}
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center mb-6">
                <span className="mr-4 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center">{quantity}</div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary-dark text-white mb-6"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            {/* Product Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Truck className="h-5 w-5 text-primary mr-3" />
                </div>
                <div>
                  <span className="font-medium">Free Delivery</span>
                  <p className="text-sm text-neutral-700">For orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Store className="h-5 w-5 text-primary mr-3" />
                </div>
                <div>
                  <span className="font-medium">From Local Farms</span>
                  <p className="text-sm text-neutral-700">Directly from the source</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-primary mr-3" />
                </div>
                <div>
                  <span className="font-medium">Freshness Guarantee</span>
                  <p className="text-sm text-neutral-700">100% satisfaction or money back</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="reviews">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Product Information</h3>
                      <p>This {product.name} is sourced from local farms, ensuring the highest quality and freshness. It's harvested at peak ripeness and delivered directly to you.</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Nutritional Value</h3>
                      <p>Our products are rich in essential vitamins and minerals, providing you with the nutrients your body needs. Enjoy as part of a balanced diet.</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Storage Tips</h3>
                      <p>For optimal freshness, store in a cool, dry place or refrigerate depending on the product. Consume within a few days of delivery for the best taste.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {/* Submit Review Form */}
                  {user && !hasReviewed && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onReviewSubmit)} className="space-y-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Your Rating</label>
                            {renderInteractiveStars()}
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Share your thoughts about this product..." 
                                    className="min-h-24"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
                            Submit Review
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}
                  
                  {/* List of Reviews */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                    
                    {isLoadingReviews ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center mb-2">
                              <div className="h-4 bg-gray-200 rounded w-24 mr-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        ))}
                      </div>
                    ) : reviews && reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-0">
                            <div className="flex items-center mb-2">
                              <div className="flex text-amber-400 mr-2">
                                {renderStars(review.rating)}
                              </div>
                              <div className="text-sm text-neutral-700">
                                by {review.user?.fullName || "Anonymous User"}
                              </div>
                            </div>
                            <p className="text-neutral-700">{review.comment}</p>
                            <div className="mt-1 text-xs text-neutral-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-neutral-700">No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
