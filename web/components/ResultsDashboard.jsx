import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  FileSearch,
  MapPin,
  Sprout,
} from 'lucide-react';
import {
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

import { agentTrace, cropOptions, riskConfig } from '../lib/constants.js';
import { parseYieldValue } from '../lib/api.js';

export default function ResultsDashboard({ result, isLoading }) {
  return (
    <section id="results" className="section-shell results-section">
      <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="reveal-up">
          <div className="section-kicker">Results dashboard</div>
          <h2 className="section-title">Model output, agent trace, and RAG evidence.</h2>
        </div>
        <p className="section-copy reveal-up">
          Results persist in localStorage after refresh. Cards show the same structured JSON sections
          returned by the deployed advisory API.
        </p>
      </div>

      {isLoading && <SkeletonGrid />}

      {!isLoading && !result && (
        <div className="empty-results reveal-up">
          Run the advisory wizard to generate a bento dashboard with prediction, risk, actions,
          citations, and safety guidance.
        </div>
      )}

      <AnimatePresence>
        {!isLoading && result && <ResultGrid key={result.receivedAt || 'result'} result={result} />}
      </AnimatePresence>
    </section>
  );
}

function ResultGrid({ result }) {
  const risk = riskConfig[result.riskLevel] || riskConfig.Unknown;
  const yieldValue = parseYieldValue(result.cropSummary.yieldPrediction);
  const crop = cropOptions.find((item) => item.value === result.cropSummary.cropName);
  const CropIcon = crop?.icon || Sprout;

  return (
    <motion.div
      className="bento-grid stagger-scope"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bento-card yield-card stagger-card">
        <span className="card-eyebrow">Predicted yield</span>
        <div className="yield-value">
          <AnimatedCounter value={yieldValue} />
          <small>tons/hectare</small>
        </div>
        <p>{result.cropSummary.yieldPrediction}</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="68%" outerRadius="100%" data={[{ value: Math.min(yieldValue * 12, 100) }]}>
              <RadialBar dataKey="value" cornerRadius={20} fill={risk.color} background={{ fill: 'rgba(245,240,232,.08)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bento-card risk-card stagger-card" style={{ '--risk-color': risk.color }}>
        <span className="card-eyebrow">Risk level</span>
        <strong>{risk.label}</strong>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'risk', value: risk.score },
                  { name: 'remaining', value: 100 - risk.score },
                ]}
                innerRadius={48}
                outerRadius={68}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                <Cell fill={risk.color} />
                <Cell fill="rgba(245,240,232,.08)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bento-card profile-card stagger-card">
        <span className="card-eyebrow">Crop profile</span>
        <div className="crop-portrait">
          <CropIcon size={38} />
        </div>
        <strong>{result.cropSummary.cropName}</strong>
        <div className="profile-line">
          <MapPin size={16} />
          {result.cropSummary.region}
        </div>
        <div className="profile-line">
          <CloudSun size={16} />
          {result.fieldStatus.weather} / {result.fieldStatus.temperature}
        </div>
      </div>

      <div className="bento-card actions-card stagger-card">
        <span className="card-eyebrow">Recommended actions</span>
        <div className="timeline-list">
          {result.recommendedActions.length ? (
            result.recommendedActions.map((action, index) => (
              <ActionAccordion key={`${action.task}-${index}`} action={action} index={index} />
            ))
          ) : (
            <p className="muted-copy">No recommended actions were returned by the backend.</p>
          )}
        </div>
      </div>

      <div className="bento-card evidence-card stagger-card">
        <span className="card-eyebrow">Sources from agronomy knowledge base</span>
        {result.agronomicReferences.length ? (
          result.agronomicReferences.map((reference, index) => (
            <div className="citation-card" key={`${reference}-${index}`}>
              <FileSearch size={17} />
              <span>{reference}</span>
            </div>
          ))
        ) : (
          <p className="muted-copy">No RAG references returned. Retry the advisory request.</p>
        )}
      </div>

      <div className="bento-card trace-card stagger-card">
        <span className="card-eyebrow">Agent pipeline trace</span>
        <div className="trace-list">
          {agentTrace.map((step, index) => (
            <div className="trace-row" key={step.title}>
              <span>
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>{step.title}</strong>
                <small>{step.detail}</small>
              </div>
              <em>{String(index + 1).padStart(2, '0')}</em>
            </div>
          ))}
        </div>
      </div>

      <div className="bento-card safety-card stagger-card">
        <AlertTriangle size={24} />
        <div>
          <span className="card-eyebrow">Safety note</span>
          <p>{result.safetyDisclaimer}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ActionAccordion({ action, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <article className={open ? 'action-accordion open' : 'action-accordion'}>
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{action.task}</strong>
        <ChevronDown size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {action.description}
          </motion.p>
        )}
      </AnimatePresence>
    </article>
  );
}

function AnimatedCounter({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      value,
      duration: 1.35,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = proxy.value.toFixed(2);
      },
    });
    return () => tween.kill();
  }, [value]);

  return <strong ref={ref}>0.00</strong>;
}

function SkeletonGrid() {
  return (
    <div className="bento-grid">
      {Array.from({ length: 7 }).map((_, index) => (
        <div className="bento-card skeleton-card" key={index}>
          <span />
          <strong />
          <p />
        </div>
      ))}
    </div>
  );
}
