import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const Testimonial = ({ name, role, image, text, rating }: TestimonialProps) => {
  return (
    <div className="bg-neutral-50 p-6 rounded-lg shadow-sm">
      <div className="flex text-amber-500 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star
            key={i}
            className="h-5 w-5"
            fill={i < rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="text-neutral-600 mb-6 italic">{text}</p>
      <div className="flex items-center">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <h4 className="font-bold text-neutral-800">{name}</h4>
          <p className="text-sm text-neutral-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah J.",
      role: "Loyal Customer",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "I've been ordering my weekly produce from FarmFresh Market for six months now. The quality is exceptional, and I love knowing exactly where my food comes from. The difference in taste is remarkable!",
      rating: 5
    },
    {
      name: "Michael T.",
      role: "Regular Customer",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "As a busy professional, I appreciate the convenience of having farm-fresh products delivered to my door. The farmers on this platform clearly take pride in their work, and it shows in the quality of everything I've purchased.",
      rating: 5
    },
    {
      name: "Lisa M.",
      role: "Happy Customer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "I started shopping here to support local agriculture, but I keep coming back because the products are simply amazing. My kids now prefer these fresh vegetables over processed snacks!",
      rating: 4
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">What Our Customers Say</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Read testimonials from satisfied customers who love the quality and freshness of our farm products.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              image={testimonial.image}
              text={testimonial.text}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
