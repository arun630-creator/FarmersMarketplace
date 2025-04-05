import { Link } from "wouter";
import FarmIcon from "../icons/FarmIcon";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <FarmIcon className="text-3xl mr-2 text-primary-light" />
              <span className="font-heading font-bold text-xl">Farm Fresh Market</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Connecting local farmers with consumers for fresher, more sustainable food systems. 
              From farm to table with transparency and care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">Linkedin</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop/vegetables" className="text-gray-400 hover:text-white transition-colors">Vegetables</Link></li>
              <li><Link href="/shop/fruits" className="text-gray-400 hover:text-white transition-colors">Fruits</Link></li>
              <li><Link href="/shop/dairy" className="text-gray-400 hover:text-white transition-colors">Dairy & Eggs</Link></li>
              <li><Link href="/shop/meat" className="text-gray-400 hover:text-white transition-colors">Meat & Poultry</Link></li>
              <li><Link href="/shop/honey" className="text-gray-400 hover:text-white transition-colors">Specialty Items</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/farmers" className="text-gray-400 hover:text-white transition-colors">Our Farmers</Link></li>
              <li><Link href="/sustainability" className="text-gray-400 hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/delivery" className="text-gray-400 hover:text-white transition-colors">Delivery Information</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns Policy</Link></li>
              <li><Link href="/how-to-order" className="text-gray-400 hover:text-white transition-colors">How to Order</Link></li>
              <li><Link href="/become-farmer" className="text-gray-400 hover:text-white transition-colors">Become a Farmer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Farm Fresh Market. All rights reserved.</p>
            <div className="flex flex-wrap space-x-4 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors mb-2">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors mb-2">Privacy Policy</Link>
              <Link href="/cookies" className="hover:text-white transition-colors mb-2">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors mb-2">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
