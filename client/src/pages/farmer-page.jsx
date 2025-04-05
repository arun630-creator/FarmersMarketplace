import React from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";

export default function FarmerPage() {
  const { id } = useParams();
  const { addItem, isAddingItem } = useCart();
  
  // Fetch farmer details
  const { data: farmer, isLoading: isLoadingFarmer } = useQuery({
    queryKey: [`/api/users/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("Failed to fetch farmer details");
      return await res.json();
    },
  });
  
  // Fetch products by this farmer
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [`/api/products/farmer/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/products/farmer/${id}`);
      if (!res.ok) throw new Error("Failed to fetch farmer products");
      return await res.json();
    },
  });
  
  if (isLoadingFarmer || isLoadingProducts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!farmer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Farmer Not Found</h1>
          <p className="text-gray-600 mb-6">
            The farmer you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/farmers">
            <a className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              View All Farmers
            </a>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Farmer Profile */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            {farmer.profileImage ? (
              <img 
                src={farmer.profileImage} 
                alt={farmer.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {farmer.name || farmer.username}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {farmer.bio || "Local farmer committed to sustainable farming practices."}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Organic
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Local Produce
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Sustainable
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{farmer.location || "Local Farm, Countryside"}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold mb-4">About {farmer.name || farmer.username}</h2>
          <p className="text-gray-600">
            {farmer.description || 
              "We are passionate about growing the freshest, most nutritious produce possible while caring for the land using sustainable practices. Our farm has been in the family for generations, and we take pride in continuing the tradition of providing our community with wholesome, locally-grown food."}
          </p>
        </div>
      </div>
      
      {/* Farmer Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products from this Farmer</h2>
        
        {!products || products.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              This farmer doesn't have any products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <a className="block text-lg font-semibold text-gray-800 hover:text-green-600 mb-1">
                      {product.name}
                    </a>
                  </Link>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-800">
                      ${product.price ? product.price.toFixed(2) : "0.00"}
                    </span>
                    
                    <span className="text-sm text-gray-500">
                      {product.unit || "per lb"}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => addItem({ productId: product.id })}
                    disabled={isAddingItem}
                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}