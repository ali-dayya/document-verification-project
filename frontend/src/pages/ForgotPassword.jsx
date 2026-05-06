import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function EmailIcon() {
  return (
    <svg className="fp-field-icon" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="#64748b" strokeWidth="1.4" />
      <path d="M1.5 3.5L8 9l6.5-5.5" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" fill="#f0f9ff" stroke="#e0f2fe" strokeWidth="1.5" />
      <path
        d="M24 8L10 14v10c0 8.3 6 16.1 14 18 8-1.9 14-9.7 14-18V14L24 8z"
        fill="rgba(14,165,164,0.08)"
        stroke="#0EA5A4"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M18 24l4 4 8-8"
        stroke="#0EA5A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailSentIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="24" fill="#f0fdfd" stroke="#ccfbf1" strokeWidth="1.5" />
      <rect x="12" y="18" width="28" height="20" rx="3" fill="rgba(14,165,164,0.07)" stroke="#0EA5A4" strokeWidth="1.4" />
      <path d="M12 18.5L26 28l14-9.5" stroke="#0EA5A4" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="37" cy="15" r="5" fill="#0EA5A4" />
      <path d="M34.5 15l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ForgotPassword() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a short network delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="fp-page">
      {/* Decorative blobs */}
      <div className="fp-blob fp-blob-blue" />
      <div className="fp-blob fp-blob-teal" />

      <div className="fp-card">

        {/* Brand */}
        <div className="fp-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="#1E3A8A" />
            <path
              d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z"
              fill="#fff"
              opacity="0.9"
            />
            <path
              d="M13 16.5l2 2 4-4"
              stroke="#1E3A8A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="fp-brand-text">
            <span className="fp-brand-name">TrustChain</span>
            <span className="fp-brand-sub">Secure Business Document Verification</span>
          </div>
        </div>

        {/* ── State: SUCCESS ── */}
        {submitted ? (
          <div className="fp-success">
            <div className="fp-success-icon">
              <MailSentIcon />
            </div>
            <h2 className="fp-success-heading">Check your inbox</h2>
            <p className="fp-success-text">
              If an account exists for <strong>{email}</strong>, you'll receive reset instructions shortly. Check your spam folder if you don't see it.
            </p>
            <Link to="/" className="fp-btn fp-btn-outline">
              Back to Log In
            </Link>
          </div>
        ) : (
          /* ── State: FORM ── */
          <>
            <div className="fp-icon-wrap">
              <ShieldCheckIcon />
            </div>

            <h1 className="fp-heading">Forgot your password?</h1>
            <p className="fp-subtext">
              Enter your email and we'll send reset instructions if the account exists.
            </p>

            <form className="fp-form" onSubmit={handleSubmit}>
              <div className="fp-field-group">
                <label className="fp-label" htmlFor="fp-email">Email Address</label>
                <div className="fp-field-wrap">
                  <EmailIcon />
                  <input
                    id="fp-email"
                    className="fp-input"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className={`fp-btn fp-btn-primary ${loading ? "fp-loading" : ""}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="fp-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 5l4 3-4 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="fp-divider">
              <div className="fp-divider-line" />
              <span className="fp-divider-text">or</span>
              <div className="fp-divider-line" />
            </div>

            <p className="fp-back-row">
              <Link to="/" className="fp-back-link">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M13 8H3M7 5l-4 3 4 3" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Log In
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
