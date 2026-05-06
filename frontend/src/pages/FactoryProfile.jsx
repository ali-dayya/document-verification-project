import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../api";
import "./FactoryProfile.css";

/* ─── Icons ─── */
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2h5l7 7-5 5-7-7V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6"  cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11 9c1.7.5 3 2 3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L3 5v5c0 3.7 2.6 7.1 6 8 3.4-.9 6-4.3 6-8V5L9 2z"
        fill="rgba(22,163,74,0.12)" stroke="#16a34a" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6.5 9l2 2 3-3" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <polygon points="7,1 8.8,5.2 13.2,5.6 10,8.6 10.9,13 7,10.8 3.1,13 4,8.6 0.8,5.6 5.2,5.2"
        fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBookmark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h10a1 1 0 011 1v11l-6-3.5L2 14V3a1 1 0 011-1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
void IconBookmark;
function IconFlag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2v12M3 2h9l-2.5 4L12 10H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
void IconFlag;

const SCORE_COLOR = (s) => s >= 8.5 ? "#16a34a" : s >= 7 ? "#b45309" : "#dc2626";
const SCORE_BG    = (s) => s >= 8.5 ? "#dcfce7"  : s >= 7 ? "#fef9c3"  : "#fee2e2";
const SCORE_LABEL = (s) => s >= 9 ? "Excellent" : s >= 8.5 ? "Very Good" : s >= 7 ? "Good" : "Fair";

export default function FactoryProfile() {
  const navigate     = useNavigate();
  const role         = localStorage.getItem("role") || "Buyer";
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer    = role === "Buyer"    || role === "Both";
  const [navOpen, setNavOpen] = useState(false);
  const [factory] = useState(() => {
    const data = sessionStorage.getItem("selectedFactory");
    return data ? JSON.parse(data) : null;
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!factory) return;
    api.get("/documents", { headers: authHeaders() })
      .then((response) => {
        const list = response.data.data || [];
        setDocuments(list.filter((doc) => doc.factory_id === factory.id));
      })
      .catch(() => setDocuments([]));
  }, [factory]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  if (!factory) {
    return (
      <div className="fp-root fp-not-found">
        <p>No factory selected.</p>
        <button onClick={() => navigate("/search")}>← Back to Search</button>
      </div>
    );
  }

  return (
    <div className="fp-root">

      {/* ── Navbar ── */}
      <nav className="fp-nav">
        <div className="fp-nav-inner">
          <Link to="/dashboard" className="fp-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="fp-brand-name">TrustChain</span>
          </Link>

          <div className={`fp-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard"  className="fp-nav-link">Dashboard</Link>
            {showSupplier && <Link to="/upload"    className="fp-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="fp-nav-link">Documents</Link>}
            {showBuyer    && <Link to="/verify"    className="fp-nav-link">Verify</Link>}
            {showBuyer    && <Link to="/search"    className="fp-nav-link">Search</Link>}
            {showSupplier && <Link to="/profile"   className="fp-nav-link">Profile</Link>}
          </div>

          <button className="fp-logout-btn" onClick={handleLogout}>
            <IconLogout /><span>Logout</span>
          </button>
          <button className="fp-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main className="fp-main">

        {/* Back button + breadcrumb */}
        <div className="fp-breadcrumb">
          <button className="fp-back-btn" onClick={() => navigate("/search")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Search
          </button>
          <span className="fp-breadcrumb__sep">›</span>
          <span className="fp-breadcrumb__current">{factory.name}</span>
        </div>

        {/* ── Hero card ── */}
        <div className="fp-hero">
          <div className="fp-hero__glow" />

          <div className="fp-hero__left">
            <div className="fp-hero__avatar">{factory.name.charAt(0)}</div>
            <div className="fp-hero__info">
              <div className="fp-hero__name-row">
                <h1 className="fp-hero__name">{factory.name}</h1>
                {factory.verified && (
                  <span className="fp-hero__verified"><IconShield /> Verified Supplier</span>
                )}
              </div>
              <p className="fp-hero__desc">{factory.desc}</p>
              <div className="fp-hero__tags">
                <span className="fp-hero__tag"><IconPin />{factory.location}</span>
                <span className="fp-hero__tag"><IconTag />{factory.category}</span>
                <span className="fp-hero__tag"><IconUsers />{factory.employees} employees</span>
                <span className="fp-hero__tag"><IconCalendar />Founded {factory.founded}</span>
              </div>
            </div>
          </div>

          <div className="fp-hero__right">
            <div className="fp-score-card" style={{ background: SCORE_BG(factory.score), borderColor: SCORE_COLOR(factory.score) + "44" }}>
              <div className="fp-score-card__stars">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ opacity: factory.score / 10 >= i * 0.2 ? 1 : 0.25 }}>
                    <IconStar />
                  </span>
                ))}
              </div>
              <div className="fp-score-card__val" style={{ color: SCORE_COLOR(factory.score) }}>
                {factory.score}
                <span className="fp-score-card__denom">/10</span>
              </div>
              <div className="fp-score-card__label" style={{ color: SCORE_COLOR(factory.score) }}>
                {SCORE_LABEL(factory.score)}
              </div>
              <div className="fp-score-card__bar-bg">
                <div className="fp-score-card__bar-fill"
                  style={{ width: `${factory.score * 10}%`, background: SCORE_COLOR(factory.score) }}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── Documents on Record — full width ── */}
        <div className="fp-docs-section" style={{ width: "100%", display: "block", boxSizing: "border-box" }}>
          <div className="fp-card fp-docs-card" style={{ width: "100%", maxWidth: "100%", display: "block", boxSizing: "border-box" }}>
            <div className="fp-card__header">
              <h2 className="fp-card__title">Documents on Record</h2>
              <span className="fp-card__count">{documents.length} documents</span>
            </div>
            <div className="fp-doc-grid">
              {documents.length ? documents.map((doc) => (
                <div className="fp-doc-item" key={doc.document_id}>
                  <div className="fp-doc-item__left">
                    <div className="fp-doc-item__icon">📄</div>
                    <div>
                      <div className="fp-doc-item__name">Document #{doc.document_id}</div>
                      <div className="fp-doc-item__date">{new Date(doc.upload_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`fp-doc-item__badge fp-doc-item__badge--${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span>
                </div>
              )) : (
                <div className="fp-doc-item">
                  <div className="fp-doc-item__left">
                    <div className="fp-doc-item__icon">📄</div>
                    <div>
                      <div className="fp-doc-item__name">No documents uploaded yet</div>
                      <div className="fp-doc-item__date">Documents will appear after supplier uploads.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      <footer className="fp-footer">
        <span>© 2025 TrustChain</span>
        <span className="fp-footer-dot">·</span>
        <a href="#" className="fp-footer-link">Privacy</a>
        <span className="fp-footer-dot">·</span>
        <a href="#" className="fp-footer-link">Support</a>
      </footer>

    </div>
  );
}
