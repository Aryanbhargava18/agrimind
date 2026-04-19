import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import AdvisoryWizard from './components/AdvisoryWizard.jsx';
import Features from './components/Features.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import MagneticCursor from './components/MagneticCursor.jsx';
import Navbar from './components/Navbar.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import StatsTicker from './components/StatsTicker.jsx';
import { useGsapAnimations } from './hooks/useGsapAnimations.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { getBackendHealth, requestAdvisory } from './lib/api.js';
import { STORAGE_KEYS } from './lib/constants.js';

export default function App() {
  const [result, setResult] = useLocalStorage(STORAGE_KEYS.result, null);
  const [savedForm, setSavedForm] = useLocalStorage(STORAGE_KEYS.form, null);
  const [health, setHealth] = useState({ ok: false, message: 'Checking backend...' });
  const [isLoading, setIsLoading] = useState(false);

  useGsapAnimations();

  useEffect(() => {
    let mounted = true;
    getBackendHealth().then((status) => {
      if (mounted) setHealth(status);
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(values) {
    setIsLoading(true);
    setSavedForm(values);
    try {
      const advisory = await requestAdvisory(values);
      setResult(advisory);
      toast.success('Advisory report generated.');
      window.setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-charcoal text-cream">
      <div className="load-curtain" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      <MagneticCursor />
      <Navbar health={health} />
      <main>
        <Hero />
        <StatsTicker />
        <section id="advisory" className="section-shell">
          <div className="section-kicker reveal-up">Main advisory engine</div>
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="reveal-up">
              <h2 className="section-title">A guided farm intelligence workflow.</h2>
            </div>
            <p className="section-copy reveal-up">
              The wizard collects only the fields required by the deployed FastAPI agent, validates
              them locally, then calls the RAG + LangGraph advisory backend through a browser-safe
              API proxy.
            </p>
          </div>
          <AdvisoryWizard
            defaultForm={savedForm}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </section>
        <ResultsDashboard result={result} isLoading={isLoading} />
        <HowItWorks />
        <Features />
      </main>
      <Footer health={health} />
    </div>
  );
}

