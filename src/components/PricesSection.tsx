import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { priceGroups, lashLiftPriceGroups } from "@/data/treatments";

const PricesSection = () => {
  const allGroups = [...priceGroups, ...lashLiftPriceGroups];
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 items-center">
        <FadeInWhenVisible>
          <div>
            <motion.h2 
              className="font-display text-5xl md:text-6xl text-ink mb-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              PRICES
            </motion.h2>
            
            <StaggerChildren className="space-y-8">
              {allGroups.map((g) => (
                <div key={g.name} className="group">
                  <motion.h3 
                    className="font-display text-xl text-ink mb-2 group-hover:text-peach transition-colors"
                  >
                    {g.name.toUpperCase()}
                  </motion.h3>
                  <ul className="space-y-1 text-sm uppercase tracking-wide text-ink/85">
                    {g.tiers.map((t) => (
                      <motion.li 
                        key={t.label} 
                        className="flex justify-between max-w-xs hover:text-ink transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <span>{t.label}</span>
                        <span className="font-semibold">{t.price}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </FadeInWhenVisible>
        
        <FadeInWhenVisible delay={0.3}>
          <div className="relative">
            <motion.img
              src="/classic-1-1-lash.png"
              alt="Classic 1:1 lash work"
              className="w-full aspect-square object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default PricesSection;
