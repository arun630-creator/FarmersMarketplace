import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTABanner = () => {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="md:flex items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Ready to taste the difference?</h2>
            <p className="opacity-90">Join thousands of happy customers supporting local agriculture.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/products">
              <Button className="bg-white text-primary font-bold hover:bg-neutral-100">
                Shop Now
              </Button>
            </Link>
            <Link href="/register?farmer=true">
              <Button variant="outline" className="bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-primary">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
