import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import type { Treatment } from "@/data/treatments";

interface Props {
  treatment: Treatment;
  reverse?: boolean;
  useListingsImage?: boolean;
}

const TreatmentBlock = ({ treatment, reverse, useListingsImage }: Props) => {
  const imageSrc =
    useListingsImage && treatment.listingsImage
      ? treatment.listingsImage
      : treatment.image;

  return (
    <FadeInWhenVisible>
      <article className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-start md:items-center py-12 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img
            src={imageSrc}
            alt={treatment.name}
            className="w-full aspect-square object-cover"
          />
        </motion.div>
        
        <div className="space-y-5 mt-8 md:mt-0">
          <motion.h2 
            className="font-display text-3xl md:text-4xl text-ink"
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {treatment.name.toUpperCase()}
          </motion.h2>
          
          {treatment.description.map((p, i) => (
            <motion.p 
              key={i} 
              className="text-ink/85 leading-relaxed uppercase text-sm tracking-wide font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              {p}
            </motion.p>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              asChild
              variant="primary"
              size="default"
              className="shadow-lg"
            >
              <Link to={`/treatments/${treatment.slug}`}>
                {treatment.cta}
              </Link>
            </Button>
          </motion.div>
        </div>
      </article>
    </FadeInWhenVisible>
  );
};

export default TreatmentBlock;