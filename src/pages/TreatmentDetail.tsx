import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { getTreatment, priceGroups, lashLiftPriceGroups } from "@/data/treatments";

const TreatmentDetail = () => {
  const { slug } = useParams();
  const treatment = slug ? getTreatment(slug) : undefined;

  if (!treatment) return <Navigate to="/treatments" replace />;

  const detailPriceGroups =
    treatment.slug === "signature-lash-extensions"
      ? priceGroups
      : treatment.slug === "korean-lash-lift"
        ? lashLiftPriceGroups
        : [];
  const showPrices = detailPriceGroups.length > 0;
  const inlinePrice = treatment.price;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <Link to="/treatments" className="text-sm uppercase tracking-widest text-ink/70 hover:text-ink transition-colors">← All treatments</Link>

        <FadeInWhenVisible>
          <div className="mt-8 grid md:grid-cols-2 gap-12 items-start">
            <motion.img 
              src={treatment.image} 
              alt={treatment.name} 
              className="w-full aspect-square object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <div className="space-y-5">
              <motion.h1 
                className="font-display text-4xl md:text-5xl text-ink"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {treatment.name.toUpperCase()}
              </motion.h1>
              
              <motion.p 
                className="font-script text-3xl text-ink/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {treatment.tagline}
              </motion.p>
              
              {inlinePrice && (
                <motion.div 
                  className="pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="font-display text-2xl text-ink">PRICE</h2>
                  <p className="font-display text-xl text-ink mt-1">{inlinePrice}</p>
                </motion.div>
              )}
              
              <StaggerChildren staggerDelay={0.1}>
                {treatment.description.map((p, i) => (
                  <p key={i} className="text-ink/85 uppercase text-sm tracking-wide leading-relaxed">{p}</p>
                ))}
              </StaggerChildren>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="shadow-lg"
                >
                  <Link to={`/booking?treatment=${encodeURIComponent(treatment.slug)}`}>
                    BOOK THIS TREATMENT
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </FadeInWhenVisible>

        {treatment.exploreLook && treatment.exploreLook.length > 0 && (
          <FadeInWhenVisible delay={0.3}>
            <section className="mt-20" aria-label="Explore your look">
              <h2 className="font-display text-4xl md:text-5xl text-ink mb-8">EXPLORE YOUR LOOK</h2>
              <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {treatment.exploreLook.map((item, i) => (
                  <motion.img
                    key={i}
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-auto object-contain bg-background"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))}
              </StaggerChildren>
            </section>
          </FadeInWhenVisible>
        )}

        {showPrices && (
          <FadeInWhenVisible delay={0.5}>
            <section className="mt-20">
              <h2 className="font-display text-4xl md:text-5xl text-ink mb-8">PRICES</h2>
              <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {detailPriceGroups.map((g) => (
                  <div key={g.name} className="bg-muted p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-display text-lg text-ink mb-3">{g.name.toUpperCase()}</h3>
                    <ul className="space-y-1 text-sm uppercase tracking-wide text-ink/85">
                      {g.tiers.map((t) => (
                        <li key={t.label} className="flex justify-between">
                          <span>{t.label}</span>
                          <span className="font-semibold">{t.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </StaggerChildren>
            </section>
          </FadeInWhenVisible>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TreatmentDetail;