import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TreatmentBlock from "@/components/TreatmentBlock";
import { treatments } from "@/data/treatments";

const Treatments = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-pink-bar py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
            <h1 className="font-display text-5xl md:text-7xl text-ink">TREATMENTS</h1>
            <p className="mt-4 text-ink/75 max-w-2xl mx-auto uppercase tracking-wide text-sm">
              Bespoke lash and brow services, tailored to your features.
            </p>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-6 lg:px-10">
          {treatments.map((t, i) => (
            <TreatmentBlock key={t.slug} treatment={t} reverse={i % 2 === 1} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Treatments;
