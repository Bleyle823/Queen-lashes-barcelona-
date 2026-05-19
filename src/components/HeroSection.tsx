import { motion } from "framer-motion";
import heroImage from "@/assets/hero.png";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        <motion.img
          src={heroImage}
          alt="Queenlashes Barcelona model with effortless beauty"
          className="absolute inset-0 w-full h-full object-contain bg-background"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
