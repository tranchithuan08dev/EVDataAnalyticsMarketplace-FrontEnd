import Header from '../../components/Header/Header.jsx';
import HeroSection from '../../components/Home/HeroSection.jsx';
import FeaturesSection from '../../components/Home/FeaturesSection.jsx';
import MarketplaceStats from '../../components/Home/MarketplaceStats.jsx';
import DataCategories from '../../components/Home/DataCategories.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import HowItWorks from '../../components/Home/HowItWorks.jsx';
import Testimonials from '../../components/Home/Testimonials.jsx';
import FinalCTA from '../../components/Home/FinalCTA.jsx';

export default function HomePage() {
  return (
    <>
      <Header/>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <MarketplaceStats />
      <DataCategories />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}