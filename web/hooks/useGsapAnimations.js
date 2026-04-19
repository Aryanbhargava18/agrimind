import { useEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimations() {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to('.load-curtain', {
        yPercent: -100,
        duration: 1.15,
        ease: 'power4.inOut',
        delay: 0.15,
      });

      gsap.from('.hero-word', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.35,
      });

      gsap.utils.toArray('.reveal-up').forEach((element) => {
        gsap.from(element, {
          y: 56,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
          },
        });
      });

      gsap.utils.toArray('.stagger-scope').forEach((scope) => {
        gsap.from(scope.querySelectorAll('.stagger-card'), {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: scope,
            start: 'top 78%',
          },
        });
      });

      const marquee = document.querySelector('.ticker-track');
      if (marquee) {
        gsap.to(marquee, {
          xPercent: -50,
          duration: 24,
          repeat: -1,
          ease: 'none',
        });
      }
    });

    return () => context.revert();
  }, []);
}

