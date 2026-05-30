import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { useTranslation } from "@/i18n/LocaleProvider";

const OurStory = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <FadeInWhenVisible>
          <header className="text-center mb-14">
            <motion.h1
              className="font-display text-5xl md:text-7xl text-ink leading-none"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              QUEENLASHES BARCELONA
            </motion.h1>
            <motion.p
              className="font-script text-3xl md:text-4xl text-ink/80 mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t.ourStory.subtitle}
            </motion.p>
          </header>
        </FadeInWhenVisible>

        <StaggerChildren className="space-y-6 text-ink/90 text-base md:text-lg leading-relaxed" staggerDelay={0.15}>
          {t.ourStory.paragraphs.map((paragraph, index) => (
            <p key={index} className={paragraph.startsWith("\"") ? "italic" : undefined}>
              {paragraph.split("\n").map((line, lineIndex, lines) => (
                <span key={lineIndex}>
                  {line}
                  {lineIndex < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </StaggerChildren>

        <FadeInWhenVisible delay={0.8}>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="shadow-lg">
              <Link to="/booking">{t.ourStory.cta}</Link>
            </Button>
          </div>
        </FadeInWhenVisible>
      </main>
      <Footer />
    </div>
  );
};

export default OurStory;
