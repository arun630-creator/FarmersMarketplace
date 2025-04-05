import { useState } from "react";
import { Link } from "wouter";
import { Heart, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Rating from "@/components/ui/rating";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  // Mock farmer data - in a real app, this would come from the API
  const farmerName = product.farmerId === 1
    ? "Green Valley Farms"
    : product.farmerId === 2
    ? "Sunshine Organics"
    : "Mountain Apiaries";

  // Mock rating - in a real app, this would come from the API
  const rating = 4.5 + (product.id % 5) / 10;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300">
      <Link href={`/products/${product.slug}`}>
        <a className="block relative">
          <img 
            src={product.imageUrl || "https://via.placeholder.com/500x350?text=Product+Image"} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
          {product.isFeatured && (
            <Badge className="absolute top-0 left-0 bg-accent text-white rounded-br-lg rounded-tl-none">
              FEATURED
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white p-1.5 rounded-full ${
              isWishlisted ? 'text-red-500' : 'text-neutral-500 hover:text-primary'
            }`}
            onClick={toggleWishlist}
          >
            <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
          </Button>
        </a>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/products/${product.slug}`}>
            <a className="hover:text-primary transition-colors">
              <h3 className="font-bold text-neutral-800">{product.name}</h3>
            </a>
          </Link>
          <div className="flex items-center text-xs text-amber-500">
            <Rating value={rating} />
            <span className="ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-neutral-500 mb-2">{farmerName}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg text-neutral-800">{formatCurrency(product.price)}</span>
            <span className="text-sm text-neutral-500">/{product.unit}</span>
          </div>
          <Button 
            size="sm"
            className="bg-primary hover:bg-primary-dark text-white py-1.5 px-3 rounded text-sm font-medium flex items-center"
            onClick={handleAddToCart}
          >
            Add to Cart
            <PlusCircle className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
