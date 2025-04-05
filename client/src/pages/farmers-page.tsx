import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { FarmerCard } from "@/components/farmer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function FarmersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch farmers
  const { data: farmers, isLoading } = useQuery<Partial<User>[]>({
    queryKey: ["/api/farmers"],
  });

  // Filter farmers based on search term
  const filteredFarmers = farmers?.filter(farmer => 
    farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample specialties for each farmer based on their ID
  const getFarmerSpecialties = (farmerId: number) => {
    const specialtiesList = [
      ["Vegetables", "Organic", "Sustainable"],
      ["Fruits", "Pesticide-Free", "Family Farm"],
      ["Dairy", "Free-Range", "Grassfed"],
      ["Honey", "Raw", "Wildflower"],
      ["Eggs", "Free-Range", "Organic"],
      ["Grains", "Ancient", "Gluten-Free"]
    ];
    
    // Use modulo to cycle through specialties
    return specialtiesList[farmerId % specialtiesList.length];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 font-heading">Our Farmers</h1>
      <p className="text-neutral-700 mb-8 max-w-3xl">
        Meet the dedicated farmers who grow the fresh, sustainable produce that makes its way to your table. 
        Each farmer has their own story and specialty - discover who's behind your food!
      </p>
      
      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search farmers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Farmers grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredFarmers && filteredFarmers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.map((farmer) => (
                <FarmerCard 
                  key={farmer.id} 
                  farmer={farmer} 
                  specialties={getFarmerSpecialties(farmer.id || 0)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">No farmers found</h3>
              <p className="text-neutral-600 mb-6">
                {searchTerm ? 
                  "No farmers match your search criteria." : 
                  "There are no farmers registered yet."}
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
      
      {/* Info section */}
      <div className="mt-12 bg-primary-dark/5 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 font-heading">Become a Farm Fresh Seller</h2>
        <p className="text-neutral-700 mb-4">
          Are you a farmer looking to connect directly with customers? Join our platform and start selling your
          fresh, local produce to a community that values quality and sustainability.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-primary text-xl font-bold mb-2">1.</div>
            <h3 className="font-bold mb-2">Create an Account</h3>
            <p className="text-sm text-neutral-600">Sign up as a farmer and set up your profile with your farm's story and specialties.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-primary text-xl font-bold mb-2">2.</div>
            <h3 className="font-bold mb-2">List Your Products</h3>
            <p className="text-sm text-neutral-600">Add your produce to our marketplace with details, pricing, and availability.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-primary text-xl font-bold mb-2">3.</div>
            <h3 className="font-bold mb-2">Start Selling</h3>
            <p className="text-sm text-neutral-600">Receive orders, manage your inventory, and connect with customers who appreciate your work.</p>
          </div>
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="px-8">
            <a href="/auth?role=farmer">Get Started as a Farmer</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
