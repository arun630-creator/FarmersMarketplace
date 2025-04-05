import { useEffect, useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Category } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

const CategoryNavigation = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto pb-2 gap-4 md:gap-6 no-scrollbar">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center group min-w-[100px]">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto pb-2 gap-4 md:gap-6 no-scrollbar">
          {categories?.map((category) => (
            <Link 
              key={category.id} 
              href={`/shop/${category.slug}`}
              className="flex flex-col items-center group min-w-[100px]"
            >
              <div className={`w-16 h-16 ${category.iconBgColor} rounded-full flex items-center justify-center mb-2 group-hover:bg-opacity-80 transition-colors`}>
                <i className={`fas fa-${category.icon} ${category.iconTextColor} text-xl`}></i>
              </div>
              <span className="text-sm text-neutral-700 font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNavigation;
