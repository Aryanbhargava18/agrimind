import { Code2, RadioTower } from 'lucide-react';

export default function Footer({ health }) {
  return (
    <footer className="footer-shell">
      <div>
        <span className="footer-logo">AgriMind</span>
        <p>AI-powered farm intelligence for yield prediction and grounded field actions.</p>
      </div>
      <div className="footer-links">
        <a href="#home">Home</a>
        <a href="#advisory">Advisory</a>
        <a href="#how-it-works">How It Works</a>
        <a href="https://github.com/Agrim-2007/GENAI-capstone" target="_blank" rel="noreferrer">
          <Code2 size={17} />
          GitHub
        </a>
        <span className="backend-pill">
          <RadioTower size={15} />
          <span className={health.ok ? 'dot-online' : 'dot-warn'} />
          {health.ok ? 'Backend Online' : 'Backend Check'}
        </span>
      </div>
    </footer>
  );
}
