import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: React.ReactNode;
}

const CategoryCard = ({ name, slug, icon }: CategoryCardProps) => {
  return (
    <Link href={`/products/category/${slug}`}>
      <a className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg hover:bg-primary-light hover:text-white transition duration-200 group">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-white">
          <div className="h-8 w-8 text-primary group-hover:text-primary">{icon}</div>
        </div>
        <span className="text-center font-medium">{name}</span>
      </a>
    </Link>
  );
};

const CategoryNav = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Icons mapping for categories
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'fruits':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'vegetables':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'grains':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case 'dairy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'herbs':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
    }
  };

  const renderCategorySkeleton = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="flex flex-col items-center p-4 bg-neutral-50 rounded-lg">
        <Skeleton className="w-16 h-16 rounded-full mb-3" />
        <Skeleton className="h-4 w-24" />
      </div>
    ));
  };

  return (
    <section className="bg-white py-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-neutral-800">Categories</h2>
          <Link href="/products">
            <a className="text-primary hover:text-primary-dark font-medium flex items-center">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            renderCategorySkeleton()
          ) : (
            categories?.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                icon={getCategoryIcon(category.slug)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
