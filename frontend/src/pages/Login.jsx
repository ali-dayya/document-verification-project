import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getMessage, saveUser } from "../api";
import "./Login.css";

function ShieldIllustration() {
  return (
    <svg className="shield-svg" width="148" height="148" viewBox="0 0 148 148" fill="none">
      <circle cx="74" cy="74" r="68" stroke="rgba(96,165,250,0.1)" strokeWidth="1" />
      <circle cx="74" cy="74" r="56" stroke="rgba(96,165,250,0.07)" strokeWidth="1" />
      <path d="M74 18L30 37v30c0 24 18.8 46.4 44 52 25.2-5.6 44-28 44-52V37L74 18z"
        fill="rgba(255,255,255,0.05)" stroke="rgba(96,165,250,0.3)" strokeWidth="1.3" />
      <rect x="55" y="48" width="38" height="48" rx="4.5"
        fill="rgba(255,255,255,0.07)" stroke="rgba(148,186,230,0.25)" strokeWidth="1" />
      <line x1="62" y1="59" x2="86" y2="59" stroke="rgba(148,186,230,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="62" y1="67" x2="86" y2="67" stroke="rgba(148,186,230,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="62" y1="75" x2="78" y2="75" stroke="rgba(148,186,230,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="84" cy="87" r="12" fill="#1E3A8A" />
      <circle cx="84" cy="87" r="12" stroke="rgba(96,165,250,0.4)" strokeWidth="1" />
      <path d="M78 87l4.5 4.5L90 81" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="60" r="3.5" fill="rgba(96,165,250,0.25)" />
      <circle cx="120" cy="76" r="3" fill="rgba(165,180,252,0.25)" />
      <circle cx="34" cy="96" r="2.5" fill="rgba(96,165,250,0.18)" />
      <circle cx="116" cy="50" r="2.5" fill="rgba(165,180,252,0.18)" />
      <line x1="31.5" y1="60" x2="46" y2="65" stroke="rgba(96,165,250,0.12)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="117" y1="76" x2="100" y2="73" stroke="rgba(165,180,252,0.12)" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="field-icon" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="#64748b" strokeWidth="1.4" />
      <path d="M1.5 3.5L8 9l6.5-5.5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="field-icon" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#64748b" strokeWidth="1.4" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="11" r="1" fill="#64748b" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 5l4 3-4 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Role icons ── */
function SupplierIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l-7 4v4c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5V6L10 2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function BuyerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 4l3.5 3.5M16 4l-3.5 3.5M4 16l3.5-3.5M16 16l-3.5-3.5"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function BothIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="7"  cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="13" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M13 12c1.7.5 3 2 3 4"            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

const roles = [
  {
    value: "Supplier",
    label: "Supplier",
    desc: "Upload & manage documents",
    icon: <SupplierIcon />,
    activeColor: "#1E3A8A",
    activeBg: "#dbeafe",
  },
  {
    value: "Buyer",
    label: "Buyer",
    desc: "Verify & review documents",
    icon: <BuyerIcon />,
    activeColor: "#0EA5A4",
    activeBg: "#e0f7f7",
  },
  {
    value: "Both",
    label: "Both",
    desc: "Full access to all features",
    icon: <BothIcon />,
    activeColor: "#7c3aed",
    activeBg: "#f3e8ff",
  },
];

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L3 5v5c0 4.1 2.6 7.9 6 9 3.4-1.1 6-4.9 6-9V5L9 2z"
          stroke="rgba(148,186,230,0.8)" strokeWidth="1.3" fill="rgba(255,255,255,0.06)" strokeLinejoin="round"/>
        <path d="M6.5 9l1.8 1.8 3.2-3.2" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Verify documents with confidence",
    desc: "Every document is checked and confirmed before it reaches you.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="7" width="14" height="10" rx="2" stroke="rgba(148,186,230,0.8)" strokeWidth="1.3" fill="rgba(255,255,255,0.06)"/>
        <path d="M5 7V5a4 4 0 018 0v2" stroke="rgba(148,186,230,0.8)" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="9" cy="12" r="1.5" fill="#60a5fa"/>
      </svg>
    ),
    title: "Protect business records",
    desc: "Your files are kept private and accessible only to the right people.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="6" cy="7" r="3" stroke="rgba(148,186,230,0.8)" strokeWidth="1.3" fill="rgba(255,255,255,0.06)"/>
        <circle cx="12" cy="7" r="3" stroke="rgba(148,186,230,0.8)" strokeWidth="1.3" fill="rgba(255,255,255,0.06)"/>
        <path d="M1 15c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="rgba(148,186,230,0.8)" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M12 11c1.7.4 3 1.8 3 3.5" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: "Build trust between suppliers and buyers",
    desc: "A shared space where all parties can view and confirm agreements.",
  },
];

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [role, setRole]         = useState("");
  const [roleError, setRoleError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate role selection
    if (!role) {
      setRoleError(true);
      return;
    }

    // Save role to localStorage
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      saveUser(response.data.data);
      localStorage.setItem("role", role);
      navigate("/dashboard");
    } catch (err) {
      setError(getMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }

    // Redirect to dashboard — Dashboard reads role and renders accordingly
  };

  const handleRoleSelect = (val) => {
    setRole(val);
    setRoleError(false);
  };

  return (
    <div className="page-bg">
      <div className="login-wrapper">

        {/* ── LEFT: Form ── */}
        <div className="login-left">
          <div className="login-form-inner">

            {/* Brand */}
            <div className="brand-mark">
              <svg className="brand-icon" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="9" fill="#1E3A8A" />
                <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9" />
                <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="brand-text">
                <span className="brand-name">TrustChain</span>
                <span className="brand-sub">Secure Business Document Verification</span>
              </div>
            </div>

            <h1 className="login-heading">Welcome back</h1>
            <p className="login-sub">Sign in to access your documents</p>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="email">Email address</label>
                <div className="field-wrap">
                  <EmailIcon />
                  <input id="email" className="login-input" type="email"
                    placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="field-wrap">
                  <LockIcon />
                  <input id="password" className="login-input" type="password"
                    placeholder="Enter your password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              {/* ── Role selector ── */}
              <div className="field-group">
                <label className="field-label">
                  I am logging in as a…
                </label>
                <div className="role-selector">
                  {roles.map((r) => {
                    const isSelected = role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        className={`role-card ${isSelected ? "role-card--active" : ""}`}
                        style={isSelected ? {
                          borderColor: r.activeColor,
                          background: r.activeBg,
                          color: r.activeColor,
                        } : {}}
                        onClick={() => handleRoleSelect(r.value)}
                      >
                        <span className="role-card__icon"
                          style={isSelected ? { color: r.activeColor } : {}}>
                          {r.icon}
                        </span>
                        <span className="role-card__label">{r.label}</span>
                        <span className="role-card__desc">{r.desc}</span>
                        {isSelected && (
                          <span className="role-card__check"
                            style={{ background: r.activeColor }}>
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                              <path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.6"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {roleError && (
                  <p className="role-error">Please select your role to continue.</p>
                )}
              </div>

              {error && <p className="role-error">{error}</p>}

              {/* Remember + Forgot */}
              <div className="row-between">
                <label className="check-wrap" onClick={() => setRemember(!remember)}>
                  <div className={`check-box ${remember ? "checked" : ""}`}>
                    {remember && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="check-label">Keep me signed in</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
                <ArrowIcon />
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <p className="signup-row">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">Sign up</Link>
            </p>

          </div>
        </div>

        {/* ── RIGHT: Visual ── */}
        <div className="login-right">
          <div className="glow-circle glow-1" />
          <div className="glow-circle glow-2" />
          <div className="shield-wrap"><ShieldIllustration /></div>
          <div className="right-copy">
            <h2 className="right-heading">Built for business trust</h2>
            <p className="right-desc">
              TrustChain makes it simple for companies to share, verify, and rely on important documents.
            </p>
            <div className="feature-list">
              {features.map((f, i) => (
                <div className="feature-item" key={i}>
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-text">
                    <span className="feature-title">{f.title}</span>
                    <span className="feature-desc">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="trust-badges">
              <div className="badge"><div className="badge-dot dot-green" />Verified documents</div>
              <div className="badge"><div className="badge-dot dot-green" />Secure access</div>
              <div className="badge"><div className="badge-dot dot-green" />Trusted partners</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
