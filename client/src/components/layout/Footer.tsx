import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-bold text-xl mb-4 font-heading">FarmFresh Market</h3>
            <p className="mb-4">Connecting local farmers with customers for fresher food and sustainable agriculture.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/products" className="hover:text-white">Shop</Link></li>
              <li><Link href="/login" className="hover:text-white">Account</Link></li>
              <li><Link href="/register?farmer=true" className="hover:text-white">Become a Seller</Link></li>
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className="hover:text-white">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-white">Order History</Link></li>
              <li><Link href="#" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-neutral-800" 
              />
              <Button type="submit" className="bg-primary hover:bg-primary-dark rounded-r-lg rounded-l-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} FarmFresh Market. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
