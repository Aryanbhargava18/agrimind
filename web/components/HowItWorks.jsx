import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { howItWorks } from '../lib/constants.js';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const getScrollDistance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance() + window.innerHeight * 0.65}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.from('.process-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      return () => tween.kill();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="how-it-works" className="horizontal-section" ref={sectionRef}>
      <div className="horizontal-intro">
        <div className="section-kicker">How it works</div>
        <h2 className="section-title">A five-stage AI pipeline, visualized.</h2>
      </div>

      <div className="horizontal-track" ref={trackRef}>
        {howItWorks.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="process-card" key={step.title}>
              <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="process-icon">
                <Icon size={42} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
