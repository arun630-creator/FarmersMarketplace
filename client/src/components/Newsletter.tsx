import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold font-heading text-neutral-dark mb-3">Get Fresh Updates</h2>
          <p className="text-neutral-700 mb-6">
            Subscribe to our newsletter for seasonal recipes, farmer stories, and early access to special products.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3"
              required
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary-dark text-white whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-neutral-700 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
