import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowDown, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FarmGlobe = lazy(() => import('./FarmGlobe.jsx'));

const phrases = ['Predict yields.', 'Prevent crop loss.', 'Maximize profit.'];
const headline = 'AI-Powered Farm Intelligence. Built for the Future of Agriculture.';

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="home" className="hero-section relative flex min-h-screen items-center overflow-hidden">
      <div className="particle-field" aria-hidden="true">
        {Array.from({ length: 42 }).map((_, index) => (
          <span key={index} style={{ '--i': index }} />
        ))}
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="relative z-10">
          <div className="hero-kicker">Agentic AI + RAG + Yield Prediction</div>
          <h1 className="hero-title">
            {headline.split(' ').map((word, index) => (
              <span className="hero-word inline-block" key={`${word}-${index}`}>
                {word}&nbsp;
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/72 md:text-xl">
            A cinematic advisory system that predicts farm yield, retrieves grounded agronomy
            evidence, and turns it into practical next steps.
          </p>
          <div className="typewriter mt-6" aria-live="polite">
            {phrases[phraseIndex]}
          </div>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#advisory" className="magnetic-button primary-button" data-magnetic>
              Run Advisory
            </a>
            <a href="#how-it-works" className="ghost-button" data-magnetic>
              <PlayCircle size={19} />
              Watch Demo
            </a>
          </div>
        </div>

        <motion.div
          className="relative z-10 min-h-[420px]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.45 }}
        >
          <Suspense fallback={<div className="globe-fallback">Loading farm globe</div>}>
            <FarmGlobe />
          </Suspense>
        </motion.div>
      </div>

      <a href="#advisory" className="scroll-indicator" aria-label="Scroll to advisory form">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}

