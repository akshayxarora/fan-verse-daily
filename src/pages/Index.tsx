import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedSystems from "@/components/FeaturedSystems";
import ToolsPreview from "@/components/ToolsPreview";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <FeaturedSystems />
        <ToolsPreview />
        <EmailCapture />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
