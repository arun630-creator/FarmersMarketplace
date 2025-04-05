import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { FarmerCard } from "@/components/farmer-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { Category, Product, User } from "@shared/schema";
import { Leaf, HandHeart, Truck } from "lucide-react";

export default function HomePage() {
  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch featured products
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch farmers
  const { data: farmers } = useQuery<Partial<User>[]>({
    queryKey: ["/api/farmers"],
  });

  const featuredProducts = products?.slice(0, 4) || [];
  const featuredFarmers = farmers?.slice(0, 3) || [];

  // Testimonials data
  const testimonials = [
    {
      text: "The quality of produce from FarmFresh is incredible. It's like having a farmers market delivered to my door every week!",
      name: "Emily Wilson",
      title: "Regular Customer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      rating: 5
    },
    {
      text: "I love knowing exactly where my food comes from and who grew it. The connection to local farmers makes the food taste even better.",
      name: "David Thompson",
      title: "Home Chef",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      rating: 5
    },
    {
      text: "Since switching to FarmFresh, my family eats more vegetables and our meals taste so much better. The seasonal variety keeps things interesting.",
      name: "Lisa Chen",
      title: "Monthly Subscriber",
      avatar: "https://images.unsplash.com/photo-1569913486515-b74bf7751574",
      rating: 4.5
    }
  ];

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-dark to-primary relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
              Farm to Table, <br/>Just a Click Away
            </h1>
            <p className="text-white text-lg md:text-xl opacity-90 mb-8">
              Directly support local farmers while enjoying the freshest produce delivered right to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary-dark hover:bg-gray-100">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                <Link href="/auth?role=farmer">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Abstract farm pattern overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-full h-full">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 22l-3.55-6.17L2 14.26l4.11-5.31L4 3h7l1-2 1 2h7l-2.11 5.95 4.11 5.31-6.45 1.57L12 22z"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 font-heading mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories ? (
              categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              // Loading state
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="rounded-lg bg-gray-200 h-40 md:h-56 animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 font-heading">Featured Products</h2>
            <Link href="/shop">
              <a className="text-primary hover:text-primary-dark font-medium flex items-center">
                View All <span aria-hidden="true" className="ml-1">→</span>
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))
            ) : (
              // Loading state
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="rounded-lg bg-white shadow-md">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-neutral-900 font-heading mb-12">Why Choose FarmFresh?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-5 mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 font-heading">Fresh & Local</h3>
              <p className="text-neutral-700">From farm to table in under 24 hours. Our products are harvested daily for maximum freshness.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-5 mb-4">
                <HandHeart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 font-heading">Support Farmers</h3>
              <p className="text-neutral-700">Every purchase directly supports local farmers and their families, helping rural communities thrive.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-5 mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 font-heading">Convenient Delivery</h3>
              <p className="text-neutral-700">Farm-fresh goodness delivered right to your doorstep on your schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Spotlight */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 font-heading mb-8">Meet Our Farmers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFarmers.length > 0 ? (
              featuredFarmers.map(farmer => (
                <FarmerCard key={farmer.id} farmer={farmer} />
              ))
            ) : (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="rounded-lg bg-white shadow-md">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="flex space-x-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="secondary" size="lg" className="bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/farmers">Explore All Farmers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-neutral-900 font-heading mb-8">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                text={testimonial.text}
                name={testimonial.name}
                title={testimonial.title}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Ready to taste the difference?</h2>
            <p className="text-white/90 text-lg mb-8">Join thousands of happy customers supporting local agriculture while enjoying the freshest produce available.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-gray-100">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                <Link href="#">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
