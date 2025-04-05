import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, Product } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Phone, Mail, ExternalLink, Loader2 } from "lucide-react";

export default function FarmerPage() {
  const [, params] = useRoute("/farmer/:id");
  const farmerId = params?.id ? parseInt(params.id) : undefined;
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch farmer details
  const { data: farmer, isLoading: farmerLoading } = useQuery<Partial<User>>({
    queryKey: [`/api/farmers/${farmerId}`],
    enabled: !!farmerId
  });

  // Fetch farmer's products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?farmerId=${farmerId}`],
    enabled: !!farmerId
  });

  // Filter products based on search
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Error state
  if (!farmerId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Farmer Not Found</h1>
        <p className="mb-8">The farmer you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/farmers">View All Farmers</Link>
        </Button>
      </div>
    );
  }

  // Loading state
  if (farmerLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
        <p className="mt-4 text-neutral-600">Loading farmer profile...</p>
      </div>
    );
  }

  // If farmer not found
  if (!farmer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Farmer Not Found</h1>
        <p className="mb-8">The farmer you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/farmers">View All Farmers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/">
          <span className="hover:text-primary cursor-pointer">Home</span>
        </Link>
        <span className="mx-2">›</span>
        <Link href="/farmers">
          <span className="hover:text-primary cursor-pointer">Farmers</span>
        </Link>
        <span className="mx-2">›</span>
        <span>{farmer.name}</span>
      </div>

      {/* Farmer profile header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-primary to-primary-dark relative">
          {/* Profile image */}
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage src={farmer.profileImage} alt={farmer.name} />
              <AvatarFallback className="text-3xl">
                {farmer.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="pt-20 pb-6 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold font-heading mb-1">{farmer.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                  Vegetables
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                  Organic
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                  Sustainable
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 flex items-center" onClick={() => window.open("#", "_blank")}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Farm Website
            </Button>
          </div>
          
          <p className="text-neutral-700 mb-6">
            {farmer.bio || "This farmer is dedicated to growing high-quality, sustainable produce using environmentally-friendly farming practices."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-neutral-500 mr-2" />
              <span>{farmer.address || "Local Farm, Countryside"}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-neutral-500 mr-2" />
              <span>{farmer.phone || "Contact via message"}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-neutral-500 mr-2" />
              <span>{farmer.email || "Contact via platform"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer products */}
      <div>
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About the Farm</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            {/* Search and filter bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Products grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="flex justify-between pt-2">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts && filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        farmerName={farmer.name}
                        farmerImage={farmer.profileImage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-medium mb-2">No products found</h3>
                    <p className="text-neutral-600 mb-6">
                      {searchTerm ? 
                        "No products match your search criteria." : 
                        "This farmer hasn't added any products yet."}
                    </p>
                    {searchTerm && (
                      <Button onClick={() => setSearchTerm("")}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 font-heading">About Our Farm</h2>
              <p className="mb-4">
                {farmer.bio || `At our farm, we're committed to sustainable agriculture and producing the highest quality
                food for our community. We use environmentally friendly farming practices that prioritize
                soil health, biodiversity, and water conservation.`}
              </p>
              <p className="mb-4">
                Our farming philosophy centers around working with nature rather than against it. We avoid synthetic
                pesticides and fertilizers, instead focusing on building healthy soil through composting,
                crop rotation, and other organic practices.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">Our Farming Practices</h3>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700">
                    <li>Organic growing methods</li>
                    <li>No synthetic pesticides or fertilizers</li>
                    <li>Sustainable water management</li>
                    <li>Crop rotation for soil health</li>
                    <li>Pollinator-friendly farming</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">Seasonal Specialties</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Spring:</span> Leafy greens, radishes, early berries
                    </div>
                    <div>
                      <span className="font-medium">Summer:</span> Tomatoes, cucumbers, peppers, stone fruits
                    </div>
                    <div>
                      <span className="font-medium">Fall:</span> Squash, apples, root vegetables
                    </div>
                    <div>
                      <span className="font-medium">Winter:</span> Storage crops, preserved goods
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
