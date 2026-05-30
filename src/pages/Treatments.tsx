import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TreatmentBlock from "@/components/TreatmentBlock";
import { useTreatments } from "@/data/treatments";
import { useTranslation } from "@/i18n/LocaleProvider";

const Treatments = () => {
  const treatments = useTreatments();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-pink-bar py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
            <h1 className="font-display text-5xl md:text-7xl text-ink">{t.treatmentsPage.title}</h1>
            <p className="mt-4 text-ink/75 max-w-2xl mx-auto uppercase tracking-wide text-sm">
              {t.treatmentsPage.subtitle}
            </p>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-6 lg:px-10">
          {treatments.map((tr, i) => (
            <TreatmentBlock key={tr.slug} treatment={tr} reverse={i % 2 === 1} useListingsImage />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Treatments;
