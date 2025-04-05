import { Helmet } from "react-helmet";
import Hero from "@/components/home/Hero";
import CategoryNav from "@/components/home/CategoryNav";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FarmersHighlight from "@/components/home/FarmersHighlight";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>FarmFresh Market - Farm to Table Produce</title>
        <meta 
          name="description" 
          content="Support local farmers and enjoy the freshest produce delivered directly to your home with FarmFresh Market."
        />
      </Helmet>

      <Hero />
      <CategoryNav />
      <FeaturedProducts />
      <FarmersHighlight />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  );
};

export default Home;
