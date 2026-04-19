import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot || window.matchMedia('(pointer: coarse)').matches) return undefined;

    const moveCursor = (event) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.18, ease: 'power2.out' });
      gsap.to(dot, { x: event.clientX, y: event.clientY, duration: 0.03 });
    };

    const enter = () => cursor.classList.add('cursor-grow');
    const leave = () => cursor.classList.remove('cursor-grow');

    const magneticMove = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(target, { x: x * 0.18, y: y * 0.18, duration: 0.3, ease: 'power3.out' });
    };
    const magneticLeave = (event) => {
      gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, .35)' });
    };

    window.addEventListener('mousemove', moveCursor);
    const hoverables = document.querySelectorAll('a, button, [data-magnetic]');
    hoverables.forEach((item) => {
      item.addEventListener('mouseenter', enter);
      item.addEventListener('mouseleave', leave);
      if (item.hasAttribute('data-magnetic')) {
        item.addEventListener('mousemove', magneticMove);
        item.addEventListener('mouseleave', magneticLeave);
      }
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      hoverables.forEach((item) => {
        item.removeEventListener('mouseenter', enter);
        item.removeEventListener('mouseleave', leave);
        item.removeEventListener('mousemove', magneticMove);
        item.removeEventListener('mouseleave', magneticLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="magnetic-cursor" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

