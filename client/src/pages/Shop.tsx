import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import ProductCard from "../components/ProductCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet";
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
import { Search, Filter, X } from "lucide-react";

const Shop = () => {
  const [_, params] = useRoute("/shop/:category");
  const categorySlug = params?.category;

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products based on selected category slug
  useEffect(() => {
    if (categorySlug && categories) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategories([category.id]);
      }
    }
  }, [categorySlug, categories]);

  // Filter and sort products
  const filteredProducts = products
    ? products
        .filter(product => {
          // Filter by search term
          const matchesSearch = 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
          
          // Filter by category if categories are selected
          const matchesCategory = 
            selectedCategories.length === 0 || 
            selectedCategories.includes(product.categoryId);
          
          // Filter by price range
          const matchesPrice = 
            product.price >= priceRange[0] && 
            product.price <= priceRange[1];
          
          return matchesSearch && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "price-low":
              return a.price - b.price;
            case "price-high":
              return b.price - a.price;
            case "rating":
              return b.rating - a.rating;
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
              return b.featured ? 1 : -1;
          }
        })
    : [];

  const highestPrice = products
    ? Math.ceil(Math.max(...products.map(p => p.price)))
    : 100;

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  return (
    <>
      <Helmet>
        <title>Shop - Farm Fresh Market</title>
        <meta name="description" content="Browse fresh produce directly from local farmers. Vegetables, fruits, dairy, and more." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold font-heading">
              {categorySlug 
                ? categories?.find(c => c.slug === categorySlug)?.name || "Products"
                : "All Products"}
            </h1>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center text-sm font-medium text-neutral-700"
            >
              {filterOpen ? <X className="mr-2" /> : <Filter className="mr-2" />}
              {filterOpen ? "Close Filters" : "Filter"}
            </button>
          </div>
          
          {/* Sidebar - Filters */}
          <div className={`md:w-1/4 ${filterOpen ? 'block' : 'hidden'} md:block`}>
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm mb-6">
              {/* Search */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <Accordion type="single" collapsible defaultValue="categories">
                <AccordionItem value="categories" className="border-none">
                  <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                    Categories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories?.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category.id, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Price Range */}
              <Accordion type="single" collapsible defaultValue="price">
                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">
                    Price Range
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, highestPrice]}
                        min={0}
                        max={highestPrice}
                        step={1}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Header and sort */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold font-heading hidden md:block">
                {categorySlug 
                  ? categories?.find(c => c.slug === categorySlug)?.name || "Products"
                  : "All Products"}
              </h1>
              <div className="flex items-center">
                <span className="text-sm text-neutral-700 mr-2">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-[380px] animate-pulse">
                    <div className="w-full h-[200px] bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-neutral-700">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
