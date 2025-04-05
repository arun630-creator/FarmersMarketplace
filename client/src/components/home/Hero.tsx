import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-[#3f6212] to-[#4D7C0F] py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="md:flex items-center">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">Fresh From Farm <br />To Your Table</h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">Support local farmers and enjoy the freshest produce delivered directly to your home.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/products">
                <a className="inline-block bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-neutral-100 transition duration-200 text-center">
                  Shop Now
                </a>
              </Link>
              <Link href="/register?farmer=true">
                <a className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200 text-center">
                  Become a Seller
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1595855759920-86582396756a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Fresh farm produce" 
              className="rounded-lg shadow-lg w-full max-w-md object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
