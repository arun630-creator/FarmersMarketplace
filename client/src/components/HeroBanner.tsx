import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary-light to-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 text-white z-10 relative">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Fresh from the Farm<br />
              <span className="text-accent-light">Direct to Your Table</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-lg">
              Support local farmers and enjoy the freshest produce delivered straight to your door. Farm-to-table has never been easier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-white text-primary hover:bg-neutral-light">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" className="border border-white text-white hover:bg-white/10">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1574943320219-5c3dd9bf0b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Fresh vegetables in baskets" 
              className="rounded-lg shadow-lg object-cover w-full h-64 md:h-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
