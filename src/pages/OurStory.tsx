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
            a quieter vision of beauty began to take shape.
          </p>
          <p>
            Not louder.<br />
            Not more excessive.<br />
            Just more intentional.
          </p>
          <p>
            The kind of beauty that doesn't compete for attention, yet somehow keeps it.
          </p>
          <p>
            But brands like this are rarely born from trends.<br />
            They emerge from instinct.
          </p>
          <p className="italic">
            "Was there a moment you realized this would become more than a beauty concept?"
          </p>
          <p>
            A pause follows.<br />
            Not out of hesitation, but precision.
          </p>
          <p>
            Because Queenlashes Barcelona was never created to reinvent beauty.<br />
            It was created to refine it.
          </p>
          <p>
            To strip away the unnecessary.<br />
            To return to softness, balance, and detail.<br />
            To make beauty feel less performed and more inherent.
          </p>
          <p>
            At Queenlashes Barcelona, lashes are not simply applied.<br />
            They are curated with the same intention one might approach fashion, architecture, or photography.
          </p>
          <p>
            Every movement is deliberate.<br />
            Every detail considered.
          </p>
          <p>
            The result is never dramatic transformation, but something far more compelling:<br />
            alignment.
          </p>
          <p>
            A version of beauty that feels instinctive. Effortless. Almost untouched.
          </p>
          <p className="italic">
            "Your work feels minimal, yet deeply expressive. What does luxury mean to you?"
          </p>
          <p>
            Luxury is not volume.<br />
            It is not excess.
          </p>
          <p>
            Luxury lives in restraint.<br />
            In softness.<br />
            In the invisible details that most people feel before they ever notice.
          </p>
          <p>
            It is the quiet confidence of something executed exceptionally well.
          </p>
          <p>
            And perhaps that is where the identity of the brand truly exists:<br />
            somewhere between technique and intuition, between modern minimalism and feminine expression.
          </p>
          <p>
            Queenlashes Barcelona was never designed to follow beauty culture.<br />
            It was created to set a tone.
          </p>
          <p>
            Timeless.<br />
            Personal.<br />
            Understated in the most intentional way.
          </p>
          <p>
            Because the most powerful kind of beauty never asks you to become someone else.<br />
            Only to return to yourself.
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