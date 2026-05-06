import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getMessage } from "../api";
import "./SignUp.css";

function UserIcon() {
  return (
    <svg className="su-field-icon" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="#64748b" strokeWidth="1.4" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg className="su-field-icon" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="#64748b" strokeWidth="1.4" />
      <path d="M1.5 3.5L8 9l6.5-5.5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="su-field-icon" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="1" width="8" height="14" rx="2" stroke="#64748b" strokeWidth="1.4" />
      <circle cx="8" cy="12.5" r="0.8" fill="#64748b" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg className="su-field-icon" viewBox="0 0 16 16" fill="none">
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

function RoleCard({ value, label, description, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`su-role-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(value)}
    >
      <div className="su-role-dot" />
      <div className="su-role-text">
        <span className="su-role-label">{label}</span>
        <span className="su-role-desc">{description}</span>
      </div>
    </button>
  );
}

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    password: "", confirmPassword: "", role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRole = (role) =>
    setForm((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.role) {
      setError("Please select a role.");
      return;
    }

    // ── Save role to localStorage so Dashboard and Login can read it ──
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        full_name: form.fullName,
        email: form.email,
        phone_number: form.phone,
        password: form.password,
        role: form.role,
      });
      navigate("/login");
    } catch (err) {
      setError(getMessage(err, "Could not create account."));
    } finally {
      setLoading(false);
    }

    // ── Redirect to dashboard ──
  };

  const roles = [
    { value: "Supplier", label: "Supplier", description: "Upload and share documents" },
    { value: "Buyer",    label: "Buyer",    description: "Review and verify documents" },
    { value: "Both",     label: "Both",     description: "Upload and verify documents" },
  ];

  return (
    <div className="su-page">
      <div className="su-blob su-blob-blue" />
      <div className="su-blob su-blob-teal" />

      <div className="su-card">

        {/* Brand */}
        <div className="su-brand">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="#1E3A8A" />
            <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9" />
            <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="su-brand-text">
            <span className="su-brand-name">TrustChain</span>
            <span className="su-brand-sub">Secure Business Document Verification</span>
          </div>
        </div>

        <div className="su-accent-bar" />

        <h1 className="su-heading">Create your account</h1>
        <p className="su-subheading">Join thousands of businesses that trust TrustChain to verify and protect their documents.</p>

        <form className="su-form" onSubmit={handleSubmit}>

          <div className="su-row">
            <div className="su-field-group">
              <label className="su-label" htmlFor="su-fullname">Full Name</label>
              <div className="su-field-wrap">
                <UserIcon />
                <input id="su-fullname" className="su-input" type="text"
                  placeholder="Jane Smith" value={form.fullName}
                  onChange={handleChange("fullName")} required />
              </div>
            </div>
            <div className="su-field-group">
              <label className="su-label" htmlFor="su-email">Email Address</label>
              <div className="su-field-wrap">
                <EmailIcon />
                <input id="su-email" className="su-input" type="email"
                  placeholder="you@company.com" value={form.email}
                  onChange={handleChange("email")} required />
              </div>
            </div>
          </div>

          <div className="su-row">
            <div className="su-field-group">
              <label className="su-label" htmlFor="su-phone">Phone Number</label>
              <div className="su-field-wrap">
                <PhoneIcon />
                <input id="su-phone" className="su-input" type="tel"
                  placeholder="+1 234 567 8900" value={form.phone}
                  onChange={handleChange("phone")} required />
              </div>
            </div>
            <div className="su-field-group">
              <label className="su-label" htmlFor="su-password">Password</label>
              <div className="su-field-wrap">
                <LockIcon />
                <input id="su-password" className="su-input" type="password"
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={handleChange("password")} required />
              </div>
            </div>
          </div>

          <div className="su-field-group su-full">
            <label className="su-label" htmlFor="su-confirm">Confirm Password</label>
            <div className="su-field-wrap">
              <LockIcon />
              <input id="su-confirm" className="su-input" type="password"
                placeholder="Re-enter your password" value={form.confirmPassword}
                onChange={handleChange("confirmPassword")} required />
            </div>
          </div>

          {/* Role selection */}
          <div className="su-role-section">
            <label className="su-label">Your Role</label>
            <div className="su-role-grid">
              {roles.map((r) => (
                <RoleCard key={r.value} value={r.value} label={r.label}
                  description={r.description} selected={form.role === r.value}
                  onSelect={handleRole} />
              ))}
            </div>
            <p className="su-role-hint">
              Choose <strong>Both</strong> if you want to upload documents and also verify documents from others.
            </p>
          </div>

          {error && <p className="su-role-hint" style={{ color: "#dc2626" }}>{error}</p>}

          <button className="su-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
            <ArrowIcon />
          </button>

          <p className="su-login-row">
            Already have an account?{" "}
            <Link to="/login" className="su-login-link">Log in</Link>
          </p>

        </form>
      </div>
    </div>
  );
}
