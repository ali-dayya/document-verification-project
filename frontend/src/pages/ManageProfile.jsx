import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders, getMessage } from "../api";
import "./ManageProfile.css";

/* ─── Icons ─── */
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5.5v5c0 4.1 2.9 8 7 9 4.1-1 7-4.9 7-9v-5L10 2z"
        stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="7" width="16" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="8" y="13" width="4" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <path d="M5 2h4l1.5 4-2.5 1.5a11 11 0 005.5 5.5L15 10.5l4 1.5v4a2 2 0 01-2 2C7 18 2 13 2 4a2 2 0 012-2h1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z"
        stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <path d="M3 3h6l8 8-6 6-8-8V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <path d="M11 2H5a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V7l-5-5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M11 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
      <path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Component ─── */
export default function ManageProfile() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const role         = localStorage.getItem("role") || "Supplier";
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer    = role === "Buyer"    || role === "Both";
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName:   "Alpha Manufacturing Co.",
    description:   "We specialize in high-quality industrial components for global supply chains.",
    industry:      "Manufacturing",
    location:      "Beirut, Lebanon",
    email:         "contact@alphamfg.com",
    phone:         "+961 1 234 567",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/factories/profile", {
        factory_name: form.companyName,
        description: form.description,
        category: form.industry,
        location: form.location,
      }, { headers: authHeaders() });
      localStorage.setItem("factoryId", response.data.data.factory_id);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(getMessage(err, "Could not save profile."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => navigate("/");

  return (
    <div className="mp-root">

      {/* ── Navbar ── */}
      <nav className="mp-nav">
        <div className="mp-nav-inner">
          <Link to="/dashboard" className="mp-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z"
                fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="mp-brand-name">TrustChain</span>
          </Link>

          <div className={`mp-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard" className="mp-nav-link">Dashboard</Link>
            {showSupplier && <Link to="/upload"    className="mp-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="mp-nav-link">Documents</Link>}
            {showBuyer    && <Link to="/verify"    className="mp-nav-link">Verify</Link>}
            {showBuyer    && <Link to="/search"    className="mp-nav-link">Search</Link>}
            {showSupplier && <Link to="/profile"   className="mp-nav-link mp-nav-active">Profile</Link>}
          </div>

          <button className="mp-logout-btn" onClick={handleLogout}>
            <IconLogout />
            <span>Logout</span>
          </button>

          <button className="mp-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="mp-main">

        {/* Page header */}
        <div className="mp-page-header">
          <div className="mp-page-header__left">
            <button className="mp-back-btn" onClick={() => navigate("/dashboard")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div>
              <h1 className="mp-page-title">Manage Profile</h1>
              <p className="mp-page-subtitle">Update your business information and verification details.</p>
            </div>
          </div>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="mp-toast">
            <IconCheck />
            <span>Profile updated successfully.</span>
          </div>
        )}

        {error && (
          <div className="mp-toast">
            <span>{error}</span>
          </div>
        )}

        {/* ── Content grid ── */}
        <div className="mp-grid">

          {/* ── Form card ── */}
          <form className="mp-card mp-form-card" onSubmit={handleSave}>
            <div className="mp-card-header">
              <IconBuilding />
              <span>Business Information</span>
            </div>

            <div className="mp-fields">

              <div className="mp-field">
                <label className="mp-label">Factory / Company Name</label>
                <div className="mp-input-wrap">
                  <span className="mp-input-icon"><IconBuilding /></span>
                  <input
                    className="mp-input"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Alpha Manufacturing Co."
                  />
                </div>
              </div>

              <div className="mp-field mp-field--full">
                <label className="mp-label">Business Description</label>
                <textarea
                  className="mp-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Briefly describe what your business does…"
                />
              </div>

              <div className="mp-field">
                <label className="mp-label">Industry / Category</label>
                <div className="mp-input-wrap">
                  <span className="mp-input-icon"><IconTag /></span>
                  <select
                    className="mp-input mp-select"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                  >
                    {["Manufacturing","Retail","Agriculture","Construction","Technology","Logistics","Healthcare","Other"].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mp-field">
                <label className="mp-label">Location</label>
                <div className="mp-input-wrap">
                  <span className="mp-input-icon"><IconPin /></span>
                  <input
                    className="mp-input"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="mp-field">
                <label className="mp-label">Contact Email</label>
                <div className="mp-input-wrap">
                  <span className="mp-input-icon"><IconMail /></span>
                  <input
                    className="mp-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="mp-field">
                <label className="mp-label">Phone Number</label>
                <div className="mp-input-wrap">
                  <span className="mp-input-icon"><IconPhone /></span>
                  <input
                    className="mp-input"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                  />
                </div>
              </div>

            </div>

            <div className="mp-form-footer">
              <button type="submit" className="mp-save-btn">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* ── Trust Summary card ── */}
          <aside className="mp-side">

            {/* Trust Score */}
            <div className="mp-card mp-trust-card">
              <div className="mp-trust-glow" />
              <div className="mp-trust-header">
                <div className="mp-trust-shield">
                  <IconShield />
                </div>
                <span className="mp-trust-chip">Verified Supplier</span>
              </div>
              <div className="mp-trust-score-wrap">
                <span className="mp-trust-score">8.4</span>
                <span className="mp-trust-denom">/ 10</span>
              </div>
              <div className="mp-trust-label">Trust Score</div>
              <div className="mp-trust-rating">Good rating</div>
              <div className="mp-trust-bar-bg">
                <div className="mp-trust-bar-fill" style={{ width: "84%" }} />
              </div>
            </div>

            {/* Stats */}
            <div className="mp-card mp-stats-card">
              <div className="mp-card-header">
                <IconDoc />
                <span>Document Summary</span>
              </div>
              <div className="mp-stat-row">
                <span className="mp-stat-label">Total Documents</span>
                <span className="mp-stat-value mp-stat-blue">24</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat-row">
                <span className="mp-stat-label">Verified Documents</span>
                <span className="mp-stat-value mp-stat-green">18</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat-row">
                <span className="mp-stat-label">Pending Review</span>
                <span className="mp-stat-value mp-stat-yellow">4</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat-row">
                <span className="mp-stat-label">Rejected</span>
                <span className="mp-stat-value mp-stat-red">2</span>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mp-footer">
        <span>© 2025 TrustChain</span>
        <span className="mp-footer-dot">·</span>
        <a href="#" className="mp-footer-link">Privacy</a>
        <span className="mp-footer-dot">·</span>
        <a href="#" className="mp-footer-link">Support</a>
      </footer>

    </div>
  );
}
