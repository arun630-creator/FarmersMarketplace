import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { cart } = useCart();
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Farmers", path: "/farmers" },
  ];

  const itemCount = cart?.items?.length || 0;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="text-xl font-bold text-green-600 cursor-pointer">FarmFresh</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`text-sm cursor-pointer ${location === item.path ? 'font-semibold text-green-600' : 'text-gray-600 hover:text-green-600'}`}>
                {item.name}
              </div>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/cart">
            <div className="relative text-gray-600 hover:text-green-600 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <div className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">
                  {user.name || user.username}
                </div>
              </Link>
              <button 
                onClick={logout}
                className="text-sm text-gray-600 hover:text-green-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth">
              <div className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">
                Login / Register
              </div>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600"
          onClick={toggleMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`py-2 cursor-pointer ${location === item.path ? 'font-semibold text-green-600' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              <Link href="/cart">
                <div 
                  className="py-2 flex items-center justify-between text-gray-600 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                  {itemCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>
              {user ? (
                <>
                  <Link href="/profile">
                    <div 
                      className="py-2 text-gray-600 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </div>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="py-2 text-left text-gray-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth">
                  <div 
                    className="py-2 text-gray-600 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </div>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}