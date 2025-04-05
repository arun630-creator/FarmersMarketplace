import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { User } from "@/lib/context/AuthContext";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FarmerCardProps {
  farmer: User;
  reviewCount: number;
  rating: number;
}

const FarmerCard = ({ farmer, reviewCount, rating }: FarmerCardProps) => {
  return (
    <div className="bg-neutral-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300">
      <img 
        src={`https://images.unsplash.com/photo-${farmer.id === 1 ? "1595475038784-bbe439ff41e6" : farmer.id === 2 ? "1615811361523-6bd03d7748e7" : "1592983941914-0229cee64de6"}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80`} 
        alt={farmer.farmName || ""} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-bold text-xl text-neutral-800 mb-2">{farmer.farmName}</h3>
        <p className="text-neutral-600 mb-4">{farmer.farmDescription}</p>
        <div className="flex items-center mb-4">
          <div className="flex text-amber-500">
            {Array(Math.floor(rating)).fill(0).map((_, i) => (
              <Star key={i} className="h-5 w-5" fill="currentColor" />
            ))}
            {rating % 1 !== 0 && (
              <Star className="h-5 w-5" fill="none" />
            )}
          </div>
          <span className="ml-2 text-neutral-500 text-sm">{reviewCount} reviews</span>
        </div>
        <Link href={`/products?farmer=${farmer.id}`}>
          <a className="inline-block text-primary hover:text-primary-dark font-medium">
            Shop Products
          </a>
        </Link>
      </div>
    </div>
  );
};

const FarmersHighlight = () => {
  // Filter users to only get farmers
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    select: (data) => data.filter(user => user.isFarmer),
  });

  const renderFarmerSkeleton = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="bg-neutral-50 rounded-lg overflow-hidden shadow-sm">
        <Skeleton className="w-full h-48" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    ));
  };

  // Mocked review data
  const reviewData = [
    { reviewCount: 175, rating: 5 },
    { reviewCount: 142, rating: 4 },
    { reviewCount: 89, rating: 5 }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Meet Our Local Farmers</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Behind every product is a hardworking farmer committed to sustainable and ethical farming practices. Get to know the people who grow your food.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            renderFarmerSkeleton()
          ) : (
            users?.map((farmer, index) => (
              <FarmerCard 
                key={farmer.id}
                farmer={farmer}
                reviewCount={reviewData[index % reviewData.length].reviewCount}
                rating={reviewData[index % reviewData.length].rating}
              />
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" className="bg-white border border-primary text-primary font-bold hover:bg-primary hover:text-white">
            View All Farmers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FarmersHighlight;
