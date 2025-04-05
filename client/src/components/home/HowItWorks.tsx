const HowItWorks = () => {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">How It Works</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Our platform connects farmers directly with customers, ensuring fresher products and fair prices for everyone.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="font-bold text-xl text-neutral-800 mb-2">Browse & Order</h3>
            <p className="text-neutral-600">Explore our selection of fresh, locally-grown produce and place your order online.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="font-bold text-xl text-neutral-800 mb-2">Farmers Prepare</h3>
            <p className="text-neutral-600">Local farmers harvest and prepare your products for maximum freshness.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="font-bold text-xl text-neutral-800 mb-2">Delivery or Pickup</h3>
            <p className="text-neutral-600">Choose delivery to your doorstep or pickup from a convenient location near you.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
