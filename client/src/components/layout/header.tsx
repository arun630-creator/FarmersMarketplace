import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { FarmFreshLogo } from "@/components/ui/farmfresh-logo";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import {
  Search,
  ShoppingCart,
  User,
  Tractor,
  Store,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <FarmFreshLogo />

          {/* Search bar - desktop */}
          <div className="hidden md:block flex-grow max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for fresh produce..."
                className="w-full py-2 px-4 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/shop">
              <a className="text-neutral-700 hover:text-primary font-medium flex items-center">
                <Store className="mr-1 h-4 w-4" /> Shop
              </a>
            </Link>
            <Link href="/farmers">
              <a className="text-neutral-700 hover:text-primary font-medium flex items-center">
                <Tractor className="mr-1 h-4 w-4" /> Farmers
              </a>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setLocation("/profile")}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  {user.role === "farmer" && (
                    <DropdownMenuItem
                      onClick={() => setLocation("/farmer/dashboard")}
                      className="cursor-pointer"
                    >
                      Farmer Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <a className="text-neutral-700 hover:text-primary font-medium flex items-center">
                  <User className="mr-1 h-4 w-4" /> Account
                </a>
              </Link>
            )}
            <Link href="/cart">
              <a className="relative text-neutral-700 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </a>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-neutral-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Search bar - mobile */}
        <div className="pb-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search for fresh produce..."
              className="w-full py-2 px-4 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary"
            >
              <Search size={18} />
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 absolute w-full left-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              <Link href="/shop">
                <a
                  className="text-neutral-700 hover:text-primary font-medium flex items-center py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store className="mr-3 w-6 h-6" /> Shop
                </a>
              </Link>
              <Link href="/farmers">
                <a
                  className="text-neutral-700 hover:text-primary font-medium flex items-center py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tractor className="mr-3 w-6 h-6" /> Farmers
                </a>
              </Link>
              {user ? (
                <>
                  <Link href="/profile">
                    <a
                      className="text-neutral-700 hover:text-primary font-medium flex items-center py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="mr-3 w-6 h-6" /> Profile
                    </a>
                  </Link>
                  {user.role === "farmer" && (
                    <Link href="/farmer/dashboard">
                      <a
                        className="text-neutral-700 hover:text-primary font-medium flex items-center py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Tractor className="mr-3 w-6 h-6" /> Farmer Dashboard
                      </a>
                    </Link>
                  )}
                  <button
                    className="text-neutral-700 hover:text-primary font-medium flex items-center py-2 w-full text-left"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth">
                  <a
                    className="text-neutral-700 hover:text-primary font-medium flex items-center py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-3 w-6 h-6" /> Account
                  </a>
                </Link>
              )}
              <Link href="/cart">
                <a
                  className="text-neutral-700 hover:text-primary font-medium flex items-center py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="mr-3 w-6 h-6" /> Cart
                  {cart && cart.items.length > 0 && (
                    <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </a>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
