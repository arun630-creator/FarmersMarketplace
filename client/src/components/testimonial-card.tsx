import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, StarHalf } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
}

export function TestimonialCard({ text, name, title, avatar, rating }: TestimonialCardProps) {
  // Generate array of full and half stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400" size={18} />);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-amber-400 text-amber-400" size={18} />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex text-amber-400 mb-4">
        {renderStars()}
      </div>
      <p className="text-neutral-700 mb-4 font-serif italic">"{text}"</p>
      <div className="flex items-center">
        <Avatar className="mr-3">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-neutral-500">{title}</p>
        </div>
      </div>
    </div>
  );
}
