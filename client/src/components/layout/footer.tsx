import React from "react";
import { Link } from "wouter";
import { FarmFreshLogo } from "@/components/ui/farmfresh-logo";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CreditCard,
} from "lucide-react";
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcPaypal, 
  FaCcAmex, 
  FaCcDiscover 
} from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <FarmFreshLogo className="mb-4" />
            <p className="text-neutral-400 mb-4">
              Connecting farmers and consumers for a healthier community and
              planet.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    All Products
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=1">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Vegetables
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=2">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Fruits
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=4">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Dairy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=3">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Grains
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop?tag=Seasonal">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Seasonal Specials
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <Link href="/farmers">
                  <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    Meet the Farmers
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Sustainability
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} FarmFresh. All rights reserved.
            </p>
           <div className="flex space-x-4 mt-2">
  <FaCcVisa className="text-3xl text-blue-600" />
  <FaCcMastercard className="text-3xl text-red-500" />
  <FaCcPaypal className="text-3xl text-blue-800" />
  <FaCcAmex className="text-3xl text-blue-400" />
  <FaCcDiscover className="text-3xl text-orange-500" />
</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
