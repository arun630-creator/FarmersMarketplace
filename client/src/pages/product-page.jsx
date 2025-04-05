import React from "react";
import { useParams } from "wouter";

export default function ProductPage() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Product {id}</h1>
      <p>Product details coming soon...</p>
    </div>
  );
}