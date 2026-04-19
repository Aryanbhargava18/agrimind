import { featureCards, statCards } from '../lib/constants.js';

export default function Features() {
  return (
    <section id="about" className="section-shell features-section">
      <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="reveal-up">
          <div className="section-kicker">Technical depth</div>
          <h2 className="section-title">Built to score on implementation, code quality, and demo readiness.</h2>
        </div>
        <p className="section-copy reveal-up">
          The interface is premium, but the grading story is still engineering-first: modular API
          calls, validated inputs, persisted output, RAG evidence, and clear agent orchestration.
        </p>
      </div>

      <div className="feature-stat-row reveal-up">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="feature-stat" key={stat.label}>
              <Icon size={20} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          );
        })}
      </div>

      <div className="feature-grid stagger-scope">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          return (
            <article className="feature-card stagger-card" key={feature.title}>
              <Icon size={26} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

