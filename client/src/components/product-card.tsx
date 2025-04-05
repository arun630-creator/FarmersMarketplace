import React from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  farmerName?: string;
  farmerImage?: string;
}

export function ProductCard({ product, farmerName, farmerImage }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      addToCart(product.id, 1);
    } else {
      window.location.href = "/auth?redirect=/shop";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <span className="block cursor-pointer">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a"} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
          </span>
        </Link>
        <div className="absolute top-2 left-2">
          {product.isOrganic && (
            <Badge className="bg-primary text-white text-xs font-bold">Organic</Badge>
          )}
          {product.tags && product.tags.length > 0 && (
            <Badge className={`ml-1 bg-${
              product.tags[0] === "Free Range" ? "amber-500" : 
              product.tags[0] === "Raw" ? "orange-700" : 
              product.tags[0] === "Seasonal" ? "primary" : 
              "primary"
            } text-white text-xs font-bold`}>
              {product.tags[0]}
            </Badge>
          )}
        </div>
        <button className="absolute top-2 right-2 bg-white rounded-full p-2 text-neutral-500 hover:text-primary transition-colors duration-200">
          <Heart size={16} />
        </button>
      </div>
      <div className="p-4">
        {farmerName && (
          <div className="flex items-center mb-2">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={farmerImage} alt={farmerName} />
              <AvatarFallback>{farmerName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-neutral-700">{farmerName}</span>
          </div>
        )}
        <Link href={`/product/${product.id}`}>
          <span className="block">
            <h3 className="font-bold text-neutral-900 text-lg mb-1 hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
          </span>
        </Link>
        <p className="text-neutral-700 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-neutral-900">
            ${product.price.toFixed(2)}
            <span className="text-sm font-normal text-neutral-500">/{product.unit}</span>
          </span>
          <Button 
            onClick={handleAddToCart} 
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
