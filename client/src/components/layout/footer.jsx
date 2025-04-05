import React from "react";
import { useLocation } from "wouter";

export function Footer() {
  const [_, navigate] = useLocation();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">FarmFresh</h3>
            <p className="text-sm text-gray-600 mb-4">
              Connecting farmers and consumers for a sustainable food system.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <div 
                  onClick={() => navigate("/")} 
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer"
                >
                  Home
                </div>
              </li>
              <li>
                <div 
                  onClick={() => navigate("/shop")} 
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer"
                >
                  Shop
                </div>
              </li>
              <li>
                <div 
                  onClick={() => navigate("/farmers")} 
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer"
                >
                  Farmers
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <div onClick={() => {}} className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">Contact Us</div>
              </li>
              <li>
                <div onClick={() => {}} className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">FAQ</div>
              </li>
              <li>
                <div onClick={() => {}} className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">Shipping Policy</div>
              </li>
              <li>
                <div onClick={() => {}} className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">Return Policy</div>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <div onClick={() => {}} className="text-gray-600 hover:text-green-600 cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0-9.375a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" />
                </svg>
              </div>
              <div onClick={() => {}} className="text-gray-600 hover:text-green-600 cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0-9.375a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" />
                </svg>
              </div>
              <div onClick={() => {}} className="text-gray-600 hover:text-green-600 cursor-pointer">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0-9.375a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} FarmFresh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}