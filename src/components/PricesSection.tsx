import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { usePriceGroups } from "@/data/treatments";
import { useTranslation } from "@/i18n/LocaleProvider";

const PricesSection = () => {
  const { t } = useTranslation();
  const { priceGroups, lashLiftPriceGroups } = usePriceGroups();
  const allGroups = [...priceGroups, ...lashLiftPriceGroups];

  return (
    <section className="py-16 lg:py-24">
      <motion.h2
        className="font-display text-5xl md:text-6xl text-ink mb-10 max-w-7xl mx-auto px-6 lg:px-10"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {t.prices.title}
      </motion.h2>

      <FadeInWhenVisible>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <StaggerChildren
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch"
            itemClassName="h-full"
          >
            {allGroups.map((g) => (
              <motion.div
                key={g.name}
                className="h-full flex flex-col bg-muted p-6 hover:shadow-lg transition-shadow group"
              >
                <h3 className="font-display text-xl text-ink mb-3 group-hover:text-peach transition-colors">
                  {g.name.toUpperCase()}
                </h3>
                <ul className="space-y-1 text-sm uppercase tracking-wide text-ink/85">
                  {g.tiers.map((tier) => (
                    <li
                      key={tier.label}
                      className="flex justify-between gap-4 hover:text-ink transition-colors"
                    >
                      <span>{tier.label}</span>
                      <span className="font-semibold shrink-0">{tier.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

export default PricesSection;
