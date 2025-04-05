import React from "react";
import { Link } from "wouter";

export function Footer() {
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
                <Link href="/">
                  <a className="text-sm text-gray-600 hover:text-green-600">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/shop">
                  <a className="text-sm text-gray-600 hover:text-green-600">Shop</a>
                </Link>
              </li>
              <li>
                <Link href="/farmers">
                  <a className="text-sm text-gray-600 hover:text-green-600">Farmers</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600">Return Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0-9.375a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0-9.375a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-10 6.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm0-9.375a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" />
                </svg>
              </a>
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