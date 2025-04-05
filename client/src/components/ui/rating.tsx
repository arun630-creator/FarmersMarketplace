import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Rating = ({ value, max = 5, size = "md", className }: RatingProps) => {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  // Get size-specific styling
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-3 w-3";
      case "lg":
        return "h-6 w-6";
      case "md":
      default:
        return "h-4 w-4";
    }
  };

  const sizeClass = getSizeClass();

  return (
    <div className={cn("flex text-amber-500", className)}>
      {/* Full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} className={sizeClass} fill="currentColor" />
        ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className={cn(sizeClass, "text-neutral-300")} fill="currentColor" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={sizeClass} fill="currentColor" />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizeClass, "text-neutral-300")} />
        ))}
    </div>
  );
};

export default Rating;
