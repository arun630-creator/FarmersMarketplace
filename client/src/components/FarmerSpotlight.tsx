import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Farmer } from "@shared/schema";
import { Button } from "@/components/ui/button";

const FarmerSpotlight = () => {
  const { data: farmers, isLoading } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers/featured"],
  });

  return (
    <section className="py-16 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-dark">Meet Our Farmers</h2>
          <p className="mt-2 text-neutral-700 max-w-2xl mx-auto">
            The passionate people behind your food who are committed to sustainable farming practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders for farmers
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-[400px] animate-pulse">
                <div className="w-full h-[240px] bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            farmers?.map((farmer) => (
              <div key={farmer.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img 
                  src={farmer.imageUrl}
                  alt={`${farmer.farmName}`} 
                  className="w-full h-60 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="font-medium text-xl mb-1">{farmer.farmName.split(' ')[0]}</h3>
                  <p className="text-primary font-medium mb-3">{farmer.farmName}</p>
                  <p className="text-sm text-neutral-700 mb-4">{farmer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(farmer.specialties as string[])?.map((specialty, index) => {
                      // Generate a different color for each tag
                      const colors = [
                        "bg-primary/10 text-primary",
                        "bg-red-100 text-red-600",
                        "bg-green-100 text-green-600",
                        "bg-blue-100 text-blue-600",
                        "bg-yellow-100 text-yellow-600",
                        "bg-pink-100 text-pink-600",
                        "bg-orange-100 text-orange-600",
                        "bg-amber-100 text-amber-600"
                      ];
                      
                      return (
                        <span 
                          key={index} 
                          className={`text-xs ${colors[index % colors.length]} px-3 py-1 rounded-full`}
                        >
                          {specialty}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/farmers">Meet All Farmers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FarmerSpotlight;
