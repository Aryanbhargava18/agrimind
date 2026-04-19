import { tickerItems } from '../lib/constants.js';

export default function StatsTicker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <section className="ticker-shell" aria-label="AgriMind capability ticker">
      <div className="ticker-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i />
          </span>
        ))}
      </div>
    </section>
  );
}

