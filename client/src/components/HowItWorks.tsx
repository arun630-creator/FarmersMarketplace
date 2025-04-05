const HowItWorks = () => {
  const steps = [
    {
      icon: "tractor",
      title: "Farmers Harvest",
      description: "Local farmers harvest fresh produce at peak ripeness, ensuring maximum flavor and nutrition."
    },
    {
      icon: "box",
      title: "We Package & Deliver",
      description: "We carefully package the produce and deliver it directly to your doorstep, usually within 24-48 hours of harvest."
    },
    {
      icon: "utensils",
      title: "You Enjoy Fresh Food",
      description: "Enjoy farm-fresh produce that tastes better, lasts longer, and supports local agriculture."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-dark">How It Works</h2>
          <p className="mt-2 text-neutral-700 max-w-2xl mx-auto">
            We connect you directly with local farmers for the freshest produce. 
            Here's how our farm-to-table process works.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className={`fas fa-${step.icon} text-primary text-2xl`}></i>
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-neutral-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
