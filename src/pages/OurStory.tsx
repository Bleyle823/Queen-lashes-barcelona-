import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import StaggerChildren from "@/components/animations/StaggerChildren";

const OurStory = () => {
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
              An editorial on modern beauty
            </motion.p>
          </header>
        </FadeInWhenVisible>

        <StaggerChildren className="space-y-6 text-ink/90 text-base md:text-lg leading-relaxed" staggerDelay={0.15}>
          <p>
            Somewhere between Berlin and Barcelona,<br />
            a new definition of beauty began to emerge.
          </p>
          <p>
            One that rejects excess, yet commands attention.<br />
            One that whispers, instead of shouting.
          </p>
          <p>But where does a brand like this begin?</p>
          <p className="italic">
            "Was there a moment you knew this would become more than just a beauty concept?"
          </p>
          <p>
            There is a pause.<br />
            Not hesitation, intention.
          </p>
          <p>
            It was never about creating something new.<br />
            It was about refining what already existed.<br />
            Stripping beauty down to its essence and rebuilding it with purpose.
          </p>
          <p>
            At Queenlashes Barcelona, lashes are not applied.<br />
            They are composed.
          </p>
          <p>
            Every detail is considered. Every movement deliberate. The result is not transformation, but alignment, a version of beauty that feels innate, almost untouched.
          </p>
          <p className="italic">
            "Your work feels incredibly minimal, yet deeply expressive. How do you define luxury?"
          </p>
          <p>
            Luxury is not volume.<br />
            It is not drama.
          </p>
          <p>
            It lives in the invisible details in balance, in softness, in the quiet confidence of something done exceptionally well.
          </p>
          <p>
            And perhaps that is where the brand finds its identity:<br />
            in the space between technique and intuition.
          </p>
          <p>
            Queenlashes Barcelona was never created to follow trends. It exists to set a tone, one that feels timeless, effortless, and undeniably personal.
          </p>
          <p>
            Because in the end, beauty is not about becoming someone else. It's about returning to yourself.
          </p>
        </StaggerChildren>

        <FadeInWhenVisible delay={0.8}>
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="shadow-lg"
            >
              <Link to="/booking">
                BOOK YOUR APPOINTMENT
              </Link>
            </Button>
          </div>
        </FadeInWhenVisible>
      </main>
      <Footer />
    </div>
  );
};

export default OurStory;