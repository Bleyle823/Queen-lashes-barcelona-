import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import galleryImage from "@/assets/gallery-v1.png";

const Gallery = () => {
  return (
    <section className="relative py-16">
      <FadeInWhenVisible>
        <div className="relative w-full overflow-hidden">
          <motion.img
            src={galleryImage}
            alt="Queenlashes Barcelona lash and brow portfolio collage"
            className="w-full h-auto object-cover"
            loading="lazy"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </FadeInWhenVisible>
    </section>
  );
};

export default Gallery;
