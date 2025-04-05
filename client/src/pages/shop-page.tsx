import React, { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function ShopPage() {
  const search = useSearch();
  const { user } = useAuth();
  const [searchParams] = useState(new URLSearchParams(search));
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Get query parameters
  const categoryId = searchParams.get("category") ? parseInt(searchParams.get("category")!) : undefined;
  const farmerId = searchParams.get("farmer") ? parseInt(searchParams.get("farmer")!) : undefined;
  const searchQuery = searchParams.get("search") || "";

  // Filter states
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId?.toString() || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  
  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [
      "/api/products", 
      categoryId ? `?categoryId=${categoryId}` : "", 
      farmerId ? `?farmerId=${farmerId}` : ""
    ].filter(Boolean).join(""),
  });

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    // Filter by search query
    if (localSearch && !product.name.toLowerCase().includes(localSearch.toLowerCase()) && 
        !product.description.toLowerCase().includes(localSearch.toLowerCase())) {
      return false;
    }
    
    // Filter by category if not "all"
    if (selectedCategory !== "all" && product.categoryId !== parseInt(selectedCategory)) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by organic
    if (organicOnly && !product.isOrganic) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort products
    switch(sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default: // newest
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
  }) || [];

  // Filter panel for desktop
  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Categories</h3>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="cat-all"
              value="all"
              checked={selectedCategory === "all"}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="cat-all">All Categories</Label>
          </div>
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`cat-${category.id}`}
                value={category.id.toString()}
                checked={selectedCategory === category.id.toString()}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor={`cat-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Price Range</h3>
        <Slider
          defaultValue={[0, 100]}
          max={100}
          step={1}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="organic-only" 
            checked={organicOnly}
            onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
          />
          <Label htmlFor="organic-only">Organic Products Only</Label>
        </div>
      </div>

      <div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedCategory("all");
            setPriceRange([0, 100]);
            setOrganicOnly(false);
            setLocalSearch("");
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 font-heading">
        {categoryId && categories?.find(c => c.id === categoryId)?.name 
          ? `${categories.find(c => c.id === categoryId)?.name}`
          : farmerId 
            ? "Farmer Products" 
            : searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : "All Products"}
      </h1>
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span>Home</span> {" "}
        <span className="mx-2">›</span> {" "}
        <span>Shop</span>
        {categoryId && categories?.find(c => c.id === categoryId) && (
          <>
            <span className="mx-2">›</span>
            <span>{categories.find(c => c.id === categoryId)?.name}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar - desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterPanel />
        </div>

        {/* Mobile filter button */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden mb-4">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <FilterPanel />
          </SheetContent>
        </Sheet>

        {/* Product list */}
        <div className="flex-1">
          {/* Search and sort bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product count */}
          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {/* Product grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
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
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <Button 
                    onClick={() => {
                      setSelectedCategory("all");
                      setPriceRange([0, 100]);
                      setOrganicOnly(false);
                      setLocalSearch("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
