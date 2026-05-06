import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SavedSuppliers.css";

/* ─── Icons ─── */
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 1a5 5 0 015 5c0 3.5-5 9-5 9S3 9.5 3 6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 2h5l7 7-5 5-7-7V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <polygon points="7,1 8.8,5.2 13.2,5.6 10,8.6 10.9,13 7,10.8 3.1,13 4,8.6 0.8,5.6 5.2,5.2"
        fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L2 3.5v3.5c0 2.9 2 5.6 5 6.3 3-.7 5-3.4 5-6.3V3.5L7 1z"
        fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M5 7l1.5 1.5L9 5.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBookmark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M10 6h20a2 2 0 012 2v24l-12-7-12 7V8a2 2 0 012-2z"
        stroke="#cbd5e1" strokeWidth="1.8" strokeLinejoin="round" fill="#f8fafc"/>
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M6 4V2h4v2M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Sample saved suppliers ─── */
const INITIAL_SAVED = [
  {
    id: 1, name: "Alpha Manufacturing Co.", location: "Beirut, Lebanon",
    category: "Manufacturing", score: 8.4, verified: true,
    desc: "High-quality industrial components for global supply chains.",
  },
  {
    id: 2, name: "TechParts Global", location: "Dubai, UAE",
    category: "Electronics", score: 9.1, verified: true,
    desc: "Premium electronic components and circuit assemblies for OEM markets.",
  },
  {
    id: 3, name: "BuildRight Solutions", location: "Riyadh, Saudi Arabia",
    category: "Manufacturing", score: 8.9, verified: true,
    desc: "Structural and construction materials for large infrastructure projects.",
  },
  {
    id: 4, name: "CircuitBase Ltd.", location: "Istanbul, Turkey",
    category: "Electronics", score: 9.4, verified: true,
    desc: "Industry-leading circuit boards and embedded systems manufacturer.",
  },
  {
    id: 5, name: "GrainPro Supplies", location: "Tunis, Tunisia",
    category: "Food", score: 8.1, verified: true,
    desc: "Grain, cereal, and dry goods supplier for regional retail chains.",
  },
];

const SCORE_COLOR = (s) => s >= 8.5 ? "#16a34a" : s >= 7 ? "#b45309" : "#dc2626";
const SCORE_BG    = (s) => s >= 8.5 ? "#dcfce7"  : s >= 7 ? "#fef9c3"  : "#fee2e2";

/* ─── Supplier Card ─── */
function SupplierCard({ supplier, onRemove, onView }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(supplier.id), 320);
  };

  return (
    <div className={`ss-card ${removing ? "ss-card--removing" : ""}`}>
      <div className="ss-card__top">
        <div className="ss-card__avatar">{supplier.name.charAt(0)}</div>
        <div className="ss-card__info">
          <div className="ss-card__name-row">
            <h3 className="ss-card__name">{supplier.name}</h3>
            {supplier.verified && (
              <span className="ss-card__verified"><IconShield /> Verified</span>
            )}
          </div>
          <p className="ss-card__desc">{supplier.desc}</p>
          <div className="ss-card__meta">
            <span className="ss-card__meta-item"><IconPin />{supplier.location}</span>
            <span className="ss-card__meta-item"><IconTag />{supplier.category}</span>
          </div>
        </div>
        <div className="ss-card__score"
          style={{ background: SCORE_BG(supplier.score), color: SCORE_COLOR(supplier.score) }}>
          <IconStar />
          <span className="ss-card__score-val">{supplier.score}</span>
          <span className="ss-card__score-denom">/10</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="ss-card__bar-bg">
        <div className="ss-card__bar-fill"
          style={{ width: `${supplier.score * 10}%`, background: SCORE_COLOR(supplier.score) }}/>
      </div>

      {/* Actions */}
      <div className="ss-card__actions">
        <button className="ss-card__btn ss-card__btn--view" onClick={() => onView(supplier)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M1 8s2.8-5 7-5 7 5 7 5-2.8 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
          View Profile
        </button>
        <button className="ss-card__btn ss-card__btn--remove" onClick={handleRemove}>
          <IconTrash />
          Remove
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function SavedSuppliers() {
  const navigate     = useNavigate();
  const role         = localStorage.getItem("role") || "Buyer";
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer    = role === "Buyer"    || role === "Both";
  const [navOpen, setNavOpen] = useState(false);

  const [saved,  setSaved]  = useState(INITIAL_SAVED);
  const [query,  setQuery]  = useState("");
  const [toast,  setToast]  = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleRemove = (id) => {
    const name = saved.find(s => s.id === id)?.name;
    setSaved(prev => prev.filter(s => s.id !== id));
    setToast(`${name} removed from saved suppliers.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleView = (supplier) => {
    sessionStorage.setItem("selectedFactory", JSON.stringify(supplier));
    navigate("/factory-profile");
  };

  const filtered = saved.filter(s => {
    const q = query.toLowerCase();
    return !q
      || s.name.toLowerCase().includes(q)
      || s.location.toLowerCase().includes(q)
      || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="ss-root">

      {/* Toast */}
      {toast && <div className="ss-toast">{toast}</div>}

      {/* ── Navbar ── */}
      <nav className="ss-nav">
        <div className="ss-nav-inner">
          <Link to="/dashboard" className="ss-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ss-brand-name">TrustChain</span>
          </Link>

          <div className={`ss-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard"  className="ss-nav-link">Dashboard</Link>
            {showSupplier && <Link to="/upload"    className="ss-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="ss-nav-link">Documents</Link>}
            {showBuyer    && <Link to="/verify"    className="ss-nav-link">Verify</Link>}
            {showBuyer    && <Link to="/search"    className="ss-nav-link">Search</Link>}
            {showBuyer    && <Link to="/saved"     className="ss-nav-link ss-nav-active">Saved</Link>}
            {showSupplier && <Link to="/profile"   className="ss-nav-link">Profile</Link>}
          </div>

          <button className="ss-logout-btn" onClick={handleLogout}>
            <IconLogout /><span>Logout</span>
          </button>
          <button className="ss-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main className="ss-main">

        {/* Page header */}
        <div className="ss-page-header">
          <div className="ss-page-header__left">
            <button className="ss-back-btn" onClick={() => navigate("/dashboard")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div>
              <h1 className="ss-page-title">Saved Suppliers</h1>
              <p className="ss-page-subtitle">View and manage suppliers you saved.</p>
            </div>
          </div>
          <span className="ss-count-badge">
            {saved.length} saved
          </span>
        </div>

        {/* Search bar */}
        {saved.length > 0 && (
          <div className="ss-search-wrap">
            <span className="ss-search-icon"><IconSearch /></span>
            <input
              className="ss-search-input"
              type="text"
              placeholder="Search saved suppliers…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className="ss-search-clear" onClick={() => setQuery("")}>✕</button>
            )}
          </div>
        )}

        {/* Cards or empty state */}
        {saved.length === 0 ? (
          <div className="ss-empty">
            <div className="ss-empty__icon"><IconBookmark /></div>
            <h2 className="ss-empty__title">No saved suppliers yet</h2>
            <p className="ss-empty__sub">
              You haven't saved any suppliers yet. Browse the search page to find and save trusted suppliers.
            </p>
            <button className="ss-empty__btn" onClick={() => navigate("/search")}>
              Browse Suppliers
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ss-empty">
            <div className="ss-empty__icon">🔍</div>
            <h2 className="ss-empty__title">No results found</h2>
            <p className="ss-empty__sub">No saved suppliers match your search.</p>
            <button className="ss-empty__btn ss-empty__btn--ghost" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        ) : (
          <div className="ss-grid">
            {filtered.map(s => (
              <SupplierCard
                key={s.id}
                supplier={s}
                onRemove={handleRemove}
                onView={handleView}
              />
            ))}
          </div>
        )}

      </main>

      <footer className="ss-footer">
        <span>© 2025 TrustChain</span>
        <span className="ss-sep">·</span>
        <a href="#" className="ss-flink">Privacy</a>
        <span className="ss-sep">·</span>
        <a href="#" className="ss-flink">Support</a>
      </footer>

    </div>
  );
}
