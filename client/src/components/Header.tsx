import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import FarmIcon from "../icons/FarmIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Search, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [location] = useLocation();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center h-12 w-auto text-primary-dark">
                <span className="sr-only">Farm Fresh Market</span>
                <FarmIcon className="text-3xl mr-2 text-primary" />
                <span className="font-heading font-bold text-xl">Farm Fresh Market</span>
              </div>
            </Link>
          </div>

          {/* Navigation links (desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-neutral-700 hover:text-primary font-medium ${
                  location === link.path ? "text-primary" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-700 hover:text-primary" aria-label="Search">
              <Search size={20} />
            </button>
            <Link href="/cart" className="p-2 text-neutral-700 hover:text-primary relative" aria-label="View cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="hidden md:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    {user.role === "farmer" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/farmer/dashboard">Farmer Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/farmer/products">My Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/farmer/orders">Manage Orders</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary-dark text-white">Sign In</Button>
                </Link>
              )}
            </div>
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-neutral-700 hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="block py-2 text-neutral-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link
                href="/login"
                className="block py-2 text-neutral-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-neutral-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block py-2 text-neutral-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                {user.role === "farmer" && (
                  <>
                    <Link
                      href="/farmer/dashboard"
                      className="block py-2 text-neutral-700 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Farmer Dashboard
                    </Link>
                    <Link
                      href="/farmer/products"
                      className="block py-2 text-neutral-700 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Products
                    </Link>
                    <Link
                      href="/farmer/orders"
                      className="block py-2 text-neutral-700 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Manage Orders
                    </Link>
                  </>
                )}
                <button
                  className="block py-2 text-neutral-700 font-medium w-full text-left"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
