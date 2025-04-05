import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const FarmerCTA = () => {
  const benefits = [
    "Sell directly to local customers without middlemen",
    "Simple dashboard to manage inventory and orders",
    "Flexible delivery options and scheduling",
    "Get paid weekly with transparent pricing"
  ];

  return (
    <section className="py-16 bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Are You a Farmer?</h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Join our network of local producers and reach more customers. 
              We handle the marketing, sales platform, and delivery logistics 
              so you can focus on what you do best - farming.
            </p>
            <ul className="mb-8 space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <Check className="text-accent mr-2" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="bg-white text-secondary hover:bg-neutral-light">
              <Link href="/become-farmer">Apply to Sell With Us</Link>
            </Button>
          </div>
          <div className="hidden md:block md:w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1589923188761-71c231fa8526?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Farmer with produce" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmerCTA;
