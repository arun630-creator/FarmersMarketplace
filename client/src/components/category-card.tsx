import React from "react";
import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.id}`}>
      <a className="group relative rounded-lg overflow-hidden h-40 md:h-56 shadow-md hover:shadow-lg transition duration-200">
        <img 
          src={category.image || `https://images.unsplash.com/photo-1610832958506-aa56368176cf`} 
          alt={category.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <h3 className="text-white font-bold text-lg md:text-xl p-4 font-heading">{category.name}</h3>
        </div>
      </a>
    </Link>
  );
}
