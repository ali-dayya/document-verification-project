import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders, clearUser } from "../api";
import "./Dashboard.css";

function IconFile() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11 2H5a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V7l-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="7" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5.5v5c0 4.1 2.9 8 7 9 4.1-1 7-4.9 7-9v-5L10 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <polygon points="10,2 12.5,7.5 18.5,8 14,12.5 15.5,18.5 10,15.5 4.5,18.5 6,12.5 1.5,8 7.5,7.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 14V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 19c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 15l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 3v16M5 3h12l-3 5 3 5H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconVerify() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L4 5.5v5c0 4.8 3.1 9.2 7 10.5 3.9-1.3 7-5.7 7-10.5v-5L11 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 3h12a1 1 0 011 1v15l-7-4-7 4V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActionCard({ action }) {
  return (
    <Link to={action.to} className={`db-action-card db-action-${action.color}`}>
      <div className="db-action-icon">{action.icon}</div>
      <div className="db-action-text">
        <span className="db-action-label">{action.label}</span>
        <span className="db-action-desc">{action.desc}</span>
      </div>
      <svg className="db-action-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function StatCard({ className, icon, value, label, extra }) {
  return (
    <div className={`db-stat-card ${className}`}>
      <div className="db-stat-top">
        <div className="db-stat-icon">{icon}</div>
        {extra && <span className="db-stat-change">{extra}</span>}
      </div>
      <div className="db-stat-value">{value}</div>
      <div className="db-stat-label">{label}</div>
    </div>
  );
}

function EmptyActivity() {
  return (
    <div className="db-activity-item">
      <div className="db-activity-body">
        <span className="db-activity-text">No recent activity yet.</span>
        <span className="db-activity-time">Activity will appear after uploads, verification, and reports.</span>
      </div>
    </div>
  );
}

const supplierActions = [
  { id: "upload", label: "Upload Document", desc: "Add a new document for verification", icon: <IconUpload />, color: "blue", to: "/upload" },
  { id: "documents", label: "View Documents", desc: "Browse all your uploaded files", icon: <IconFolder />, color: "teal", to: "/documents" },
  { id: "profile", label: "Manage Profile", desc: "Update your account information", icon: <IconUser />, color: "slate", to: "/profile" },
];

const buyerActions = [
  { id: "verify", label: "Verify Document", desc: "Check if a document is valid and authentic", icon: <IconVerify />, color: "teal", to: "/verify" },
  { id: "search", label: "Search Factories", desc: "Find and explore trusted suppliers", icon: <IconSearch />, color: "blue", to: "/search" },
  { id: "report", label: "Report Issue", desc: "Flag a problem with a document", icon: <IconFlag />, color: "red", to: "/report" },
  { id: "saved", label: "Saved Suppliers", desc: "View and manage suppliers you saved", icon: <IconBookmark />, color: "slate", to: "/saved" },
];

function DashboardContent({ role, stats }) {
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer = role === "Buyer" || role === "Both";

  return (
    <>
      <div className="db-hero">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 className="db-title">Welcome back</h1>
            <span style={{ background: "#f3e8ff", color: "#7c3aed", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
              {role === "Both" ? "Supplier & Buyer" : role}
            </span>
          </div>
          <p className="db-subtitle">Your dashboard uses the current backend data.</p>
        </div>
        <div className="db-date">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {showSupplier && (
        <section className="db-section">
          <h2 className="db-section-title">As a Supplier</h2>
          <div className="db-stats-grid">
            <StatCard className="db-stat-blue" icon={<IconFile />} value={stats.totalDocuments} label="Total Documents" />
            <StatCard className="db-stat-teal" icon={<IconShield />} value={stats.verifiedDocuments} label="Verified Documents" />
            <StatCard className="db-stat-gold" icon={<IconStar />} value={stats.trustScore} label="Trust Score" extra="out of 10" />
            <div className="db-verified-card">
              <div className="db-verified-glow" />
              <div className="db-verified-top">
                <div className="db-verified-badge-icon"><IconShield /></div>
                <span className="db-verified-chip">{stats.verifiedBadge ? "Active" : "Pending"}</span>
              </div>
              <div className="db-verified-label">{stats.verifiedBadge ? "Verified Supplier" : "Supplier Profile"}</div>
              <div className="db-verified-sub">{stats.verifiedBadge ? "Your account is trusted on TrustChain" : "Upload more valid documents to improve the badge"}</div>
            </div>
          </div>
          <div className="db-actions-grid">
            {supplierActions.map((action) => <ActionCard key={action.id} action={action} />)}
          </div>
        </section>
      )}

      {showBuyer && (
        <section className="db-section">
          <h2 className="db-section-title">As a Buyer</h2>
          <div className="db-buyer-stats-row">
            <StatCard className="db-stat-blue" icon={<IconVerify />} value={stats.totalDocuments} label="Documents Available" />
            <StatCard className="db-stat-teal" icon={<IconShield />} value={stats.verifiedDocuments} label="Valid Documents" />
            <StatCard className="db-stat-gold" icon={<IconBookmark />} value={stats.totalFactories} label="Factories Listed" />
          </div>
          <div className="db-buyer-actions-grid">
            {buyerActions.map((action) => <ActionCard key={action.id} action={action} />)}
          </div>
        </section>
      )}

      <section className="db-section">
        <div className="db-activity-header">
          <h2 className="db-section-title">Recent Activity</h2>
          <Link to="/documents" className="db-view-all">View documents</Link>
        </div>
        <div className="db-activity-list">
          {stats.recentDocuments.length ? stats.recentDocuments.map((doc) => (
            <div className="db-activity-item" key={doc.document_id}>
              <div className="db-activity-icon"><IconFile /></div>
              <div className="db-activity-body">
                <span className="db-activity-text">Document #{doc.document_id} was uploaded</span>
                <span className="db-activity-time">{doc.document_type}</span>
              </div>
              <span className="db-activity-tag tag-green">{doc.status}</span>
            </div>
          )) : <EmptyActivity />}
        </div>
      </section>
    </>
  );
}

export default function Dashboard() {
  const [navOpen, setNavOpen] = useState(false);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    verifiedDocuments: 0,
    totalFactories: 0,
    trustScore: "-",
    verifiedBadge: false,
    recentDocuments: [],
  });
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "Supplier";
  const factoryId = localStorage.getItem("factoryId");
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer = role === "Buyer" || role === "Both";

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [docsResponse, factoriesResponse] = await Promise.all([
          api.get("/documents", { headers: authHeaders() }),
          api.get("/factories", { headers: authHeaders() }),
        ]);

        const documents = docsResponse.data.data || [];
        const factories = factoriesResponse.data.data || [];
        let trustScore = factories[0]?.trust_score ?? "-";
        let verifiedBadge = factories[0]?.verification_badge ?? false;

        if (factoryId) {
          const scoreResponse = await api.get(`/trust-score/${factoryId}`, { headers: authHeaders() });
          trustScore = scoreResponse.data.data.trust_score;
          verifiedBadge = scoreResponse.data.data.verification_badge;
        }

        setStats({
          totalDocuments: documents.length,
          verifiedDocuments: documents.filter((doc) => doc.status === "Valid").length,
          totalFactories: factories.length,
          trustScore,
          verifiedBadge,
          recentDocuments: documents.slice(0, 5),
        });
      } catch {
        setStats((current) => current);
      }
    }
    loadDashboard();
  }, [factoryId]);

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <div className="db-root">
      <nav className="db-nav">
        <div className="db-nav-inner">
          <Link to="/dashboard" className="db-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A" />
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9" />
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="db-brand-name">TrustChain</span>
          </Link>

          <div className={`db-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard" className="db-nav-link db-nav-active">Dashboard</Link>
            {showSupplier && <Link to="/upload" className="db-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="db-nav-link">Documents</Link>}
            {showBuyer && <Link to="/verify" className="db-nav-link">Verify</Link>}
            {showBuyer && <Link to="/search" className="db-nav-link">Search</Link>}
            {showSupplier && <Link to="/profile" className="db-nav-link">Profile</Link>}
          </div>

          <button className="db-logout-btn" onClick={handleLogout}>
            <IconLogout />
            <span>Logout</span>
          </button>

          <button className="db-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main className="db-main">
        <DashboardContent role={role} stats={stats} />
      </main>

      <footer className="db-footer">
        <span>© 2025 TrustChain</span>
        <span className="db-footer-dot">·</span>
        <a href="#" className="db-footer-link">Privacy</a>
        <span className="db-footer-dot">·</span>
        <a href="#" className="db-footer-link">Support</a>
      </footer>
    </div>
  );
}
