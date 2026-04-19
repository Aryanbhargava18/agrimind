import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Advisory', href: '#advisory' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 py-4 md:px-7">
      <nav className="glass-nav mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3">
        <a href="#home" className="group flex items-center gap-3" aria-label="AgriMind home">
          <motion.svg
            width="34"
            height="34"
            viewBox="0 0 40 40"
            fill="none"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="drop-shadow-[0_0_16px_rgba(170,255,69,0.35)]"
          >
            <motion.path
              animate={{
                d: hovered
                  ? 'M20 5C30 7 36 16 33 27C25 25 17 20 20 5Z'
                  : 'M20 6C29 8 34 16 31 27C23 25 16 19 20 6Z',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              fill="#aaff45"
            />
            <motion.path
              animate={{ rotate: hovered ? 16 : 0 }}
              d="M20 7C18 18 18 27 10 34"
              stroke="#0a2e1a"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </motion.svg>
          <span className="font-display text-xl font-semibold tracking-tight text-cream">
            AgriMind
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link" data-magnetic>
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#advisory" className="magnetic-button nav-cta" data-magnetic>
            Get Advisory
          </a>
        </div>

        <button
          type="button"
          className="mobile-menu-button md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-charcoal/95 px-6 py-5 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-lime">AgriMind</span>
              <button
                type="button"
                className="mobile-menu-button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <motion.div
              className="mt-16 grid gap-7"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {links.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="font-display text-5xl text-cream"
                  variants={{
                    hidden: { y: 32, opacity: 0 },
                    show: { y: 0, opacity: 1 },
                  }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#advisory"
                className="magnetic-button mt-5 w-fit"
                variants={{
                  hidden: { y: 32, opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
                onClick={() => setOpen(false)}
              >
                Get Advisory
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
