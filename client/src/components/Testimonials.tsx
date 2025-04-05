import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials/featured"],
  });

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-amber-400 text-amber-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-amber-400" />);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-dark">What Our Customers Say</h2>
          <p className="mt-2 text-neutral-700 max-w-2xl mx-auto">
            Read about experiences from our community of happy customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders for testimonials
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm h-[220px] animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-amber-400 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-neutral-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {testimonial.user?.profileImage && (
                    <img 
                      src={testimonial.user.profileImage}
                      alt={testimonial.user.fullName} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{testimonial.user?.fullName || "Anonymous User"}</h4>
                    <p className="text-sm text-neutral-700">{testimonial.customerType}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
