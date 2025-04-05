import React from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <p className="text-gray-500 max-w-md text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => navigate("/")} 
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Go to Homepage
      </button>
    </div>
  );
}