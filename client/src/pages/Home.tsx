import HeroBanner from "../components/HeroBanner";
import CategoryNavigation from "../components/CategoryNavigation";
import FeaturedProducts from "../components/FeaturedProducts";
import HowItWorks from "../components/HowItWorks";
import FarmerSpotlight from "../components/FarmerSpotlight";
import Testimonials from "../components/Testimonials";
import FarmerCTA from "../components/FarmerCTA";
import Newsletter from "../components/Newsletter";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Farm Fresh Market - Direct from Farmers to Your Table</title>
        <meta name="description" content="Get fresh produce directly from local farmers. Support sustainable agriculture and enjoy the farm-to-table experience." />
      </Helmet>
      
      <HeroBanner />
      <CategoryNavigation />
      <FeaturedProducts />
      <HowItWorks />
      <FarmerSpotlight />
      <Testimonials />
      <FarmerCTA />
      <Newsletter />
    </>
  );
};

export default Home;
