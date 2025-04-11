import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Helper function to get category name for display
  const getCategoryName = () => {
    const categoryMap: Record<number, { name: string, bgColor: string, textColor: string }> = {
      1: { name: "Vegetables", bgColor: "bg-primary/10", textColor: "text-primary" },
      2: { name: "Fruits", bgColor: "bg-red-100", textColor: "text-red-500" },
      3: { name: "Grains", bgColor: "bg-amber-100", textColor: "text-amber-600" },
      4: { name: "Dairy", bgColor: "bg-blue-100", textColor: "text-blue-500" },
      5: { name: "Eggs", bgColor: "bg-pink-100", textColor: "text-pink-500" },
      6: { name: "Meat", bgColor: "bg-orange-100", textColor: "text-orange-500" },
      7: { name: "Herbs", bgColor: "bg-emerald-100", textColor: "text-emerald-500" },
      8: { name: "Honey", bgColor: "bg-yellow-100", textColor: "text-yellow-500" }
    };
    
    return categoryMap[product.categoryId] || { name: "Other", bgColor: "bg-gray-100", textColor: "text-gray-700" };
  };
  
  const category = getCategoryName();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden product-card transition-all duration-300">
      <Link href={`/product/${product.id}`} className="product-image-container block">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`text-xs font-medium ${category.textColor} ${category.bgColor} px-2 py-1 rounded`}>
              {category.name}
            </span>
          </div>
          <div className="text-sm text-neutral-700 flex items-center">
            <Star className="text-yellow-400 fill-yellow-400 h-4 w-4 mr-1" />
            <span>{product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        </Link>
        <p className="text-sm text-neutral-700 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
            <span className="text-sm text-neutral-700 ml-1">/ {product.unit}</span>
          </div>
          <Button 
            size="icon"
            className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full"
            onClick={handleAddToCart}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
