import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TreatmentBlock from "@/components/TreatmentBlock";
import Gallery from "@/components/Gallery";
import PricesSection from "@/components/PricesSection";
import LocationSection from "@/components/LocationSection";
import { useTreatments } from "@/data/treatments";

const Index = () => {
  const treatments = useTreatments();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />

        <section className="max-w-7xl mx-auto px-6 lg:px-10">
          {treatments.map((t, i) => (
            <TreatmentBlock key={t.slug} treatment={t} reverse={i % 2 === 1} />
          ))}
        </section>

        <Gallery />
        <PricesSection />
      </main>
      <LocationSection />
      <Footer />
    </div>
  );
};

export default Index;
