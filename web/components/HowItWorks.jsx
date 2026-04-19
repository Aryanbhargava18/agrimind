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

    const context = gsap.context(() => {
      if (window.matchMedia('(max-width: 720px)').matches) return;
      const distance = track.scrollWidth - window.innerWidth + 80;
      if (distance <= 0) return;
      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="horizontal-section">
      <div className="horizontal-intro">
        <div className="section-kicker">How it works</div>
        <h2 className="section-title">A five-stage AI pipeline, visualized.</h2>
      </div>
      <div ref={trackRef} className="horizontal-track">
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
