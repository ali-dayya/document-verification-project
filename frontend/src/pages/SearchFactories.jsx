import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../api";
import "./SearchFactories.css";

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
function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconBookmark({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h10a1 1 0 011 1v11l-6-3.5L2 14V3a1 1 0 011-1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L2 3.5v3.5c0 2.9 2 5.6 5 6.3 3-0.7 5-3.4 5-6.3V3.5L7 1z"
        fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M5 7l1.5 1.5L9 5.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
void IconFilter;

/* ─── Sample data ─── */
const suppliers = [
  { id: 1,  name: "Alpha Manufacturing Co.",  location: "Beirut, Lebanon",     category: "Manufacturing", score: 8.4, verified: true,  employees: "200–500",  founded: "2008", desc: "High-quality industrial components for global supply chains." },
  { id: 2,  name: "TechParts Global",          location: "Dubai, UAE",           category: "Electronics",   score: 9.1, verified: true,  employees: "500–1000", founded: "2012", desc: "Premium electronic components and circuit assemblies." },
  { id: 3,  name: "FreshFarms Export",         location: "Cairo, Egypt",         category: "Food",          score: 7.8, verified: true,  employees: "50–200",   founded: "2015", desc: "Fresh and packaged food products for export markets." },
  { id: 4,  name: "BuildRight Solutions",      location: "Riyadh, Saudi Arabia", category: "Manufacturing", score: 8.9, verified: true,  employees: "100–500",  founded: "2010", desc: "Structural and construction materials for large projects." },
  { id: 5,  name: "DigiServe Middle East",     location: "Amman, Jordan",        category: "Services",      score: 7.2, verified: false, employees: "20–100",   founded: "2019", desc: "Digital services and IT solutions for regional businesses." },
  { id: 6,  name: "CircuitBase Ltd.",          location: "Istanbul, Turkey",     category: "Electronics",   score: 9.4, verified: true,  employees: "1000+",    founded: "2005", desc: "Industry-leading circuit boards and embedded systems." },
  { id: 7,  name: "GrainPro Supplies",         location: "Tunis, Tunisia",       category: "Food",          score: 8.1, verified: true,  employees: "50–200",   founded: "2013", desc: "Grain, cereal, and dry goods supplier for retail chains." },
  { id: 8,  name: "Nexus Logistics",           location: "Casablanca, Morocco",  category: "Services",      score: 6.9, verified: false, employees: "10–50",    founded: "2020", desc: "End-to-end logistics and freight forwarding services." },
  { id: 9,  name: "IronWorks Factory",         location: "Ankara, Turkey",       category: "Manufacturing", score: 8.6, verified: true,  employees: "200–500",  founded: "2007", desc: "Steel fabrication and metalworks for industrial clients." },
  { id: 10, name: "SmartComp Systems",         location: "Tel Aviv, Israel",     category: "Electronics",   score: 9.0, verified: true,  employees: "100–500",  founded: "2011", desc: "Smart computing hardware and IoT device manufacturing." },
];

const CATEGORIES  = ["All", "Electronics", "Manufacturing", "Food", "Services", "Textiles", "Construction", "Chemicals", "Automotive", "Healthcare", "Logistics", "Agriculture", "Packaging"];
const VERIF_OPTS  = ["All", "Verified", "Not Verified"];
const SCORE_OPTS  = ["All", "9+ Excellent", "7–8.9 Good", "Below 7"];

const SCORE_COLOR = (s) => s >= 8.5 ? "#16a34a" : s >= 7 ? "#b45309" : "#dc2626";
const SCORE_BG    = (s) => s >= 8.5 ? "#dcfce7"  : s >= 7 ? "#fef9c3"  : "#fee2e2";

function matchesScore(score, filter) {
  if (filter === "All")          return true;
  if (filter === "9+ Excellent") return score >= 9;
  if (filter === "7–8.9 Good")   return score >= 7 && score < 9;
  if (filter === "Below 7")      return score < 7;
  return true;
}

/* ─── Card ─── */
function SupplierCard({ supplier, saved, onSave, onView }) {
  return (
    <div className="sf-card">
      <div className="sf-card__top">
        <div className="sf-card__avatar">{supplier.name.charAt(0)}</div>
        <div className="sf-card__title-wrap">
          <div className="sf-card__name-row">
            <h3 className="sf-card__name">{supplier.name}</h3>
            {supplier.verified && (
              <span className="sf-card__verified"><IconShield /> Verified</span>
            )}
          </div>
          <div className="sf-card__meta">
            <span className="sf-card__meta-item"><IconPin />{supplier.location}</span>
            <span className="sf-card__meta-item"><IconTag />{supplier.category}</span>
          </div>
        </div>
        <div className="sf-card__score"
          style={{ background: SCORE_BG(supplier.score), color: SCORE_COLOR(supplier.score) }}>
          <IconStar />
          <span className="sf-card__score-val">{supplier.score}</span>
          <span className="sf-card__score-denom">/10</span>
        </div>
      </div>

      <div className="sf-card__bar-wrap">
        <div className="sf-card__bar-bg">
          <div className="sf-card__bar-fill"
            style={{ width: `${supplier.score * 10}%`, background: SCORE_COLOR(supplier.score) }}/>
        </div>
        <span className="sf-card__employees">{supplier.employees} employees</span>
      </div>

      <div className="sf-card__actions">
        <button className="sf-card__btn sf-card__btn--view" onClick={() => onView(supplier)}>
          View Profile
        </button>
        <button
          className={`sf-card__btn sf-card__btn--save ${saved ? "sf-card__btn--saved" : ""}`}
          onClick={() => onSave(supplier.id)}
        >
          <IconBookmark filled={saved} />
          {saved ? "Saved" : "Save Supplier"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function SearchFactories() {
  const navigate     = useNavigate();
  const role         = localStorage.getItem("role") || "Buyer";
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer    = role === "Buyer"    || role === "Both";
  const [navOpen, setNavOpen] = useState(false);

  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const [verif,    setVerif]    = useState("All");
  const [scoreF,   setScoreF]   = useState("All");
  const [saved,    setSaved]    = useState({});
  const [toast,    setToast]    = useState(null);
  const [apiSuppliers, setApiSuppliers] = useState(suppliers);

  useEffect(() => {
    api.get("/factories", { headers: authHeaders() })
      .then((response) => {
        const list = response.data.data.map((f) => ({
          id: f.factory_id,
          name: f.factory_name,
          location: f.location,
          category: f.category,
          score: Number(f.trust_score || 0),
          verified: f.verification_badge,
          employees: "Not listed",
          founded: "Not listed",
          desc: f.description,
        }));
        if (list.length) setApiSuppliers(list);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleSave = (id) => {
    const isNowSaved = !saved[id];
    setSaved(prev => ({ ...prev, [id]: isNowSaved }));
    const name = apiSuppliers.find(s => s.id === id)?.name;
    setToast(isNowSaved ? `${name} saved!` : `${name} removed.`);
    setTimeout(() => setToast(null), 2800);
  };

  const handleView = (supplier) => {
    // Store selected supplier in sessionStorage so FactoryProfile can read it
    sessionStorage.setItem("selectedFactory", JSON.stringify(supplier));
    navigate("/factory-profile");
  };

  const filtered = apiSuppliers.filter(s => {
    const q = query.toLowerCase();
    const matchQuery  = !q || s.name.toLowerCase().includes(q)
                            || s.location.toLowerCase().includes(q)
                            || s.category.toLowerCase().includes(q);
    const matchCat    = category === "All" || s.category === category;
    const matchVerif  = verif === "All"
                          || (verif === "Verified"     && s.verified)
                          || (verif === "Not Verified" && !s.verified);
    const matchScore  = matchesScore(s.score, scoreF);
    return matchQuery && matchCat && matchVerif && matchScore;
  });

  const hasActiveFilters = category !== "All" || verif !== "All" || scoreF !== "All";

  const clearFilters = () => { setQuery(""); setCategory("All"); setVerif("All"); setScoreF("All"); };

  return (
    <div className="sf-root">

      {toast && <div className="sf-toast">{toast}</div>}

      {/* ── Navbar ── */}
      <nav className="sf-nav">
        <div className="sf-nav-inner">
          <Link to="/dashboard" className="sf-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sf-brand-name">TrustChain</span>
          </Link>

          <div className={`sf-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard"  className="sf-nav-link">Dashboard</Link>
            {showSupplier && <Link to="/upload"    className="sf-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="sf-nav-link">Documents</Link>}
            {showBuyer    && <Link to="/verify"    className="sf-nav-link">Verify</Link>}
            {showBuyer    && <Link to="/search"    className="sf-nav-link sf-nav-active">Search</Link>}
            {showSupplier && <Link to="/profile"   className="sf-nav-link">Profile</Link>}
          </div>

          <button className="sf-logout-btn" onClick={handleLogout}>
            <IconLogout /><span>Logout</span>
          </button>
          <button className="sf-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="sf-main">

        {/* Page header */}
        <div className="sf-page-header">
          <div className="sf-page-header__left">
            <button className="sf-back-btn" onClick={() => navigate("/dashboard")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div>
              <h1 className="sf-page-title">Search Factories</h1>
              <p className="sf-page-subtitle">Find trusted suppliers and verify their credibility.</p>
            </div>
          </div>
          <span className="sf-result-count">{filtered.length} supplier{filtered.length !== 1 ? "s" : ""} found</span>
        </div>

        {/* Search bar */}
        <div className="sf-search-wrap">
          <span className="sf-search-icon"><IconSearch /></span>
          <input
            className="sf-search-input"
            type="text"
            placeholder="Search by name, category, or location…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className="sf-search-clear" onClick={() => setQuery("")}>✕</button>}
        </div>

        {/* ── Compact filter toolbar ── */}
        <div className="sf-toolbar">

          {/* Left: filter icon + label */}
          <div className="sf-toolbar__left">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M1 3h14M3.5 8h9M6 13h4" stroke="#1E3A8A" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <span className="sf-toolbar__label">Filters</span>
          </div>

          <div className="sf-toolbar__divider" />

          {/* Industry dropdown */}
          <div className="sf-dropdown-wrap">
            <label className="sf-dropdown-label">Industry</label>
            <select
              className={`sf-dropdown ${category !== "All" ? "sf-dropdown--active" : ""}`}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg className="sf-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Trust Score dropdown */}
          <div className="sf-dropdown-wrap">
            <label className="sf-dropdown-label">Trust Score</label>
            <select
              className={`sf-dropdown ${scoreF !== "All" ? "sf-dropdown--active" : ""}`}
              value={scoreF}
              onChange={e => setScoreF(e.target.value)}
            >
              {SCORE_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="sf-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Verified dropdown */}
          <div className="sf-dropdown-wrap">
            <label className="sf-dropdown-label">Verified</label>
            <select
              className={`sf-dropdown ${verif !== "All" ? "sf-dropdown--active" : ""}`}
              value={verif}
              onChange={e => setVerif(e.target.value)}
            >
              {VERIF_OPTS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <svg className="sf-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Clear button */}
          {hasActiveFilters && (
            <button className="sf-toolbar__clear" onClick={clearFilters}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Clear Filters
            </button>
          )}

        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="sf-empty">
            <div className="sf-empty__icon">🏭</div>
            <p className="sf-empty__title">No suppliers found</p>
            <p className="sf-empty__sub">Try a different search term or adjust your filters.</p>
            <button className="sf-empty__reset" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <div className="sf-grid">
            {filtered.map(s => (
              <SupplierCard
                key={s.id}
                supplier={s}
                saved={!!saved[s.id]}
                onSave={handleSave}
                onView={handleView}
              />
            ))}
          </div>
        )}

      </main>

      <footer className="sf-footer">
        <span>© 2025 TrustChain</span>
        <span className="sf-footer-dot">·</span>
        <a href="#" className="sf-footer-link">Privacy</a>
        <span className="sf-footer-dot">·</span>
        <a href="#" className="sf-footer-link">Support</a>
      </footer>

    </div>
  );
}
