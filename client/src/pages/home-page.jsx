import React from "react";
import { Link, useLocation } from "wouter";

export default function HomePage() {
  const [_, navigate] = useLocation();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fresh from the Farm to Your Table
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Buy directly from local farmers and enjoy fresh, organic produce delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/shop")} 
                className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Shop Now
              </button>
              <button 
                onClick={() => navigate("/farmers")} 
                className="px-6 py-3 bg-white text-green-600 border border-green-600 rounded-md font-medium hover:bg-green-50 transition-colors"
              >
                Meet Our Farmers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FarmFresh?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
              <p className="text-gray-600">
                All our products are freshly harvested and grown using organic practices.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Local</h3>
              <p className="text-gray-600">
                By buying from us, you're directly supporting local farmers and their families.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Sustainable farming practices that are better for the environment and your health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Farm-Fresh Quality?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who enjoy fresh, locally-grown produce delivered right to their homes.
          </p>
          <button 
            onClick={() => navigate("/shop")} 
            className="px-6 py-3 bg-white text-green-600 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Products
          </button>
        </div>
      </section>
    </div>
  );
}