import React from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";

interface FarmerCardProps {
  farmer: Partial<User>;
  specialties?: string[];
}

export function FarmerCard({ farmer, specialties = ["Vegetables", "Organic", "Sustainable"] }: FarmerCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <img 
        src={farmer.profileImage || "https://images.unsplash.com/photo-1622383563234-1978348701c5"} 
        alt={farmer.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-bold text-xl text-neutral-900 mb-2 font-heading">{farmer.name}</h3>
        <p className="text-primary font-medium mb-2">{farmer.bio?.split('.')[0] || "Local Organic Farm"}</p>
        <p className="text-neutral-700 mb-4 line-clamp-2">{farmer.bio || "Growing high-quality produce with sustainable farming practices."}</p>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-neutral-100 text-neutral-700 text-xs font-medium">
              {specialty}
            </Badge>
          ))}
        </div>
        <Link href={`/farmer/${farmer.id}`}>
          <a className="block mt-4 text-primary hover:text-primary-dark font-medium">
            View Products <span aria-hidden="true">→</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
