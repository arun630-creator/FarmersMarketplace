import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function FarmersPage() {
  // Fetch all farmers
  const { data: farmers, isLoading } = useQuery({
    queryKey: ["/api/farmers"],
    queryFn: async () => {
      const res = await fetch("/api/farmers");
      if (!res.ok) throw new Error("Failed to fetch farmers");
      return await res.json();
    },
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Our Farmers</h1>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-3">Our Farmers</h1>
        <p className="text-gray-600 max-w-2xl">
          Meet the dedicated local farmers who bring fresh, sustainable produce to your table.
          Each farmer has their own unique story and commitment to quality.
        </p>
      </div>
      
      {!farmers || farmers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No farmers available at the moment.</p>
          <p className="text-gray-500">Please check back soon for updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <Link key={farmer.id} href={`/farmer/${farmer.id}`}>
              <a className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                    {farmer.profileImage ? (
                      <img 
                        src={farmer.profileImage} 
                        alt={farmer.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{farmer.name || farmer.username}</h2>
                    <p className="text-sm text-gray-500 mb-2">{farmer.location || "Local Farm"}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {(farmer.tags || ["Organic"]).map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {farmer.bio || "A local farmer committed to sustainable farming practices and providing the community with fresh, healthy produce."}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {farmer.productCount || 0} Products
                  </span>
                  
                  <span className="text-green-600 text-sm font-medium">
                    View Profile →
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
      
      {/* Join as Farmer CTA */}
      <div className="mt-12 bg-green-50 border border-green-100 rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Are You a Local Farmer?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Join our community of farmers and connect directly with customers.
          Expand your reach and sell your products online with FarmFresh.
        </p>
        <Link href="/auth">
          <a className="px-6 py-3 bg-green-600 text-white rounded-md inline-block font-medium hover:bg-green-700 transition-colors">
            Join as a Farmer
          </a>
        </Link>
      </div>
    </div>
  );
}