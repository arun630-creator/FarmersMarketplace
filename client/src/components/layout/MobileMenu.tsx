import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/AuthContext";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-neutral-800">Menu</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-500">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                Home
              </Link>
            </li>
            <li>
              <button 
                className="flex items-center justify-between w-full text-neutral-700 hover:text-primary font-medium"
                onClick={toggleCategories}
              >
                Categories
                {isCategoriesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {isCategoriesOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <Link href="/products/category/fruits" className="block text-neutral-600 hover:text-primary" onClick={onClose}>
                      Fruits
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/category/vegetables" className="block text-neutral-600 hover:text-primary" onClick={onClose}>
                      Vegetables
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/category/grains" className="block text-neutral-600 hover:text-primary" onClick={onClose}>
                      Grains
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/category/dairy" className="block text-neutral-600 hover:text-primary" onClick={onClose}>
                      Dairy
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/category/herbs" className="block text-neutral-600 hover:text-primary" onClick={onClose}>
                      Herbs
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/products" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                All Products
              </Link>
            </li>
            {user?.isFarmer && (
              <li>
                <Link href="/farmer-dashboard" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                  Farmer Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link href="/cart" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                Cart
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/profile" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                    Profile
                  </Link>
                </li>
                <li>
                  <button 
                    className="block text-neutral-700 hover:text-primary font-medium w-full text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="block text-neutral-700 hover:text-primary font-medium" onClick={onClose}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
