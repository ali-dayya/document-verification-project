import { Link } from "react-router-dom";
import "./Home.css";

/* ─── Icons ─── */
function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L5 7v7c0 5.8 3.9 11.2 9 12.7C19.1 25.2 23 19.8 23 14V7L14 3z"
        fill="rgba(14,165,164,0.12)" stroke="#0EA5A4" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M10 14l3 3 5-5" stroke="#0EA5A4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconVerify() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" fill="rgba(30,58,138,0.08)" stroke="#1E3A8A" strokeWidth="1.6"/>
      <circle cx="14" cy="14" r="4" fill="rgba(30,58,138,0.12)" stroke="#1E3A8A" strokeWidth="1.6"/>
      <path d="M7 7l4 4M21 7l-4 4M7 21l4-4M21 21l-4-4" stroke="#1E3A8A" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon points="14,3 17,10.5 25,11.2 19.5,16.5 21.5,24 14,20 6.5,24 8.5,16.5 3,11.2 11,10.5"
        fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 14V4M7 8l4-4 4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 15v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="4" y="9" width="14" height="11" rx="2.5" stroke="white" strokeWidth="1.8"/>
      <path d="M7 9V7a4 4 0 018 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="11" cy="15" r="1.5" fill="white"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L4 5.5v5c0 4.8 3.1 9.2 7 10.5 3.9-1.3 7-5.7 7-10.5v-5L11 2z"
        stroke="white" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
      <path d="M8 11l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="7"  cy="11" r="3.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="15" cy="11" r="3.5" stroke="white" strokeWidth="1.8"/>
      <path d="M10.5 11h1" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Component ─── */
export default function Home() {
  return (
    <div className="hm-root">

      {/* ── Navbar ── */}
      <nav className="hm-nav">
        <div className="hm-nav-inner">
          <Link to="/" className="hm-brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="hm-brand-name">TrustChain</span>
          </Link>

          <div className="hm-nav-links">
            <a href="#features"   className="hm-nav-link">Features</a>
            <a href="#how-it-works" className="hm-nav-link">How It Works</a>
            <Link to="/login"     className="hm-nav-link">Login</Link>
          </div>

          <Link to="/signup" className="hm-nav-cta">Sign Up</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hm-hero">
        <div className="hm-hero-bg">
          <div className="hm-hero-blob hm-hero-blob--1" />
          <div className="hm-hero-blob hm-hero-blob--2" />
          <div className="hm-hero-dots" />
        </div>
        <div className="hm-hero-inner">
          <h1 className="hm-hero-title">
            Verify business documents<br />
            <span className="hm-hero-title--accent">with confidence</span>
          </h1>
          <p className="hm-hero-sub">
            TrustChain helps suppliers and buyers protect documents, confirm authenticity,
            and build trusted business relationships.
          </p>
          <div className="hm-hero-btns">
            <Link to="/signup" className="hm-btn hm-btn--primary">
              Get Started
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 5l4 3-4 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/login" className="hm-btn hm-btn--ghost">Log In</Link>
          </div>

          {/* Mini trust indicators */}
          <div className="hm-hero-trust">
            <div className="hm-hero-trust__item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
                <path d="M4.5 7l2 2 3-3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              No technical knowledge needed
            </div>
            <div className="hm-hero-trust__item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
                <path d="M4.5 7l2 2 3-3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Free to get started
            </div>
            <div className="hm-hero-trust__item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
                <path d="M4.5 7l2 2 3-3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Works for suppliers and buyers
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="hm-features" id="features">
        <div className="hm-section-inner">
          <div className="hm-section-label">Features</div>
          <h2 className="hm-section-title">Everything you need to verify with confidence</h2>
          <p className="hm-section-sub">Simple tools built for real business relationships — no technical expertise required.</p>

          <div className="hm-features-grid">
            <div className="hm-feature-card">
              <div className="hm-feature-card__icon hm-feature-card__icon--teal">
                <IconShield />
              </div>
              <h3 className="hm-feature-card__title">Secure Document Upload</h3>
              <p className="hm-feature-card__desc">Upload your business documents once. They're stored safely and only accessible to the right people.</p>
              <div className="hm-feature-card__footer">
                <span className="hm-feature-tag">For Suppliers</span>
              </div>
            </div>

            <div className="hm-feature-card hm-feature-card--featured">
              <div className="hm-feature-card__glow" />
              <div className="hm-feature-card__icon hm-feature-card__icon--navy">
                <IconVerify />
              </div>
              <h3 className="hm-feature-card__title">Instant Verification</h3>
              <p className="hm-feature-card__desc">Buyers can check any document's authenticity in seconds — no paperwork, no waiting.</p>
              <div className="hm-feature-card__footer">
                <span className="hm-feature-tag hm-feature-tag--navy">For Buyers</span>
              </div>
            </div>

            <div className="hm-feature-card">
              <div className="hm-feature-card__icon hm-feature-card__icon--gold">
                <IconStar />
              </div>
              <h3 className="hm-feature-card__title">Trust Score for Suppliers</h3>
              <p className="hm-feature-card__desc">Every supplier builds a Trust Score over time — giving buyers a clear, honest picture of who they're working with.</p>
              <div className="hm-feature-card__footer">
                <span className="hm-feature-tag">For Everyone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="hm-how" id="how-it-works">
        <div className="hm-section-inner">
          <div className="hm-section-label">How It Works</div>
          <h2 className="hm-section-title">TrustChain in 4 simple steps</h2>
          <p className="hm-section-sub">Getting started takes minutes. Building trust lasts forever.</p>

          <div className="hm-steps">
            {[
              { num: "01", icon: <IconUpload />,  color: "#1E3A8A", title: "Upload a document",                    desc: "Suppliers upload their business documents — certificates, invoices, contracts — in just a few clicks." },
              { num: "02", icon: <IconLock />,    color: "#0EA5A4", title: "Keep it securely protected",           desc: "Your documents are stored privately. Only verified parties can access what you share." },
              { num: "03", icon: <IconCheck />,   color: "#1E3A8A", title: "Verify authenticity anytime",         desc: "Buyers can check any document at any time to confirm it's real, unchanged, and trustworthy." },
              { num: "04", icon: <IconLink />,    color: "#0EA5A4", title: "Build trust between both sides",       desc: "Suppliers earn a Trust Score. Buyers gain peace of mind. Everyone works with confidence." },
            ].map((step, i) => (
              <div className="hm-step" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="hm-step__num">{step.num}</div>
                <div className="hm-step__icon-wrap" style={{ background: step.color }}>
                  {step.icon}
                </div>
                <div className="hm-step__body">
                  <h3 className="hm-step__title">{step.title}</h3>
                  <p className="hm-step__desc">{step.desc}</p>
                </div>
                {i < 3 && <div className="hm-step__connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hm-footer">
        <div className="hm-footer-inner">
          <div className="hm-footer-brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>TrustChain</span>
          </div>
          <p className="hm-footer-copy">© 2025 TrustChain — Secure Business Document Verification</p>
          <div className="hm-footer-links">
            <a href="#" className="hm-footer-link">Privacy</a>
            <a href="#" className="hm-footer-link">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
