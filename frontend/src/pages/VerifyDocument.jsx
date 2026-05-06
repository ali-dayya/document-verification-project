import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders, getMessage } from "../api";
import "./VerifyDocument.css";

/* ─── Icons ─── */
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 24V12M12 18l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 27v1.5A2.5 2.5 0 008.5 31h19a2.5 2.5 0 002.5-2.5V27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 6L10 16v16c0 13.3 9.3 25.7 22 29 12.7-3.3 22-15.7 22-29V16L32 6z"
        fill="rgba(22,163,74,0.12)" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M22 32l7 7 13-13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconWarning() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 8L6 54h52L32 8z" fill="rgba(202,138,4,0.12)" stroke="#ca8a04" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="32" y1="26" x2="32" y2="40" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="47" r="2" fill="#ca8a04"/>
    </svg>
  );
}
function IconNotFound() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="24" fill="rgba(220,38,38,0.1)" stroke="#dc2626" strokeWidth="2"/>
      <path d="M22 22l20 20M42 22L22 42" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconPlaceholder() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="32" fill="rgba(30,58,138,0.06)" stroke="rgba(30,58,138,0.15)" strokeWidth="1.5" strokeDasharray="4 3"/>
      <path d="M36 22L22 29v10c0 8.3 5.8 16 14 18.3 8.2-2.3 14-10 14-18.3V29L36 22z"
        fill="rgba(14,165,164,0.08)" stroke="rgba(14,165,164,0.4)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M30 36l4 4 8-8" stroke="rgba(14,165,164,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polygon points="7,1 8.8,5.2 13.2,5.6 10,8.6 10.9,13 7,10.8 3.1,13 4,8.6 0.8,5.6 5.2,5.2"
        fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <path d="M11 2H5a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V7l-5-5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M11 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 8h16M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 18c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Mock database ─── */
const mockDocs = {
  "TC-2025-001": { status: "valid",    supplier: "Alpha Manufacturing Co.", date: "10 Apr 2025", score: 8.4 },
  "TC-2025-002": { status: "modified", supplier: "Beta Supplies Ltd.",       date: "12 Apr 2025", score: 6.1 },
  "TC-2025-003": { status: "valid",    supplier: "Gamma Exports Inc.",       date: "15 Apr 2025", score: 9.2 },
  "TC-2025-004": { status: "valid",    supplier: "Delta Industries",         date: "18 Apr 2025", score: 7.8 },
};
void mockDocs;

/* ─── Spinner ─── */
function Spinner() {
  return (
    <div className="vd-spinner-wrap">
      <div className="vd-spinner" />
      <p className="vd-spinner-text">Verifying document…</p>
    </div>
  );
}

/* ─── Result card ─── */
function ResultCard({ result }) {
  if (!result) return null;

  if (result.status === "valid") {
    return (
      <div className="vd-result vd-result--valid">
        <div className="vd-result__glow vd-result__glow--green" />
        <div className="vd-result__icon"><IconShieldCheck /></div>
        <h3 className="vd-result__title">Document Verified</h3>
        <p className="vd-result__sub">This document is authentic and unchanged.</p>
        <div className="vd-result__details">
          <div className="vd-result__detail">
            <span className="vd-result__detail-icon"><IconUser /></span>
            <span className="vd-result__detail-label">Supplier</span>
            <span className="vd-result__detail-value">{result.supplier}</span>
          </div>
          <div className="vd-result__detail">
            <span className="vd-result__detail-icon"><IconCalendar /></span>
            <span className="vd-result__detail-label">Upload Date</span>
            <span className="vd-result__detail-value">{result.date}</span>
          </div>
          <div className="vd-result__detail">
            <span className="vd-result__detail-icon"><IconStar /></span>
            <span className="vd-result__detail-label">Trust Score</span>
            <span className="vd-result__detail-value vd-score">
              {result.score} <span className="vd-score__denom">/ 10</span>
              <div className="vd-score__bar">
                <div className="vd-score__fill" style={{ width: `${result.score * 10}%` }} />
              </div>
            </span>
          </div>
        </div>
        <div className="vd-result__badge vd-result__badge--green">
          ✓ &nbsp;Verified by TrustChain
        </div>
      </div>
    );
  }

  if (result.status === "modified") {
    return (
      <div className="vd-result vd-result--modified">
        <div className="vd-result__glow vd-result__glow--yellow" />
        <div className="vd-result__icon"><IconWarning /></div>
        <h3 className="vd-result__title">Document Modified</h3>
        <p className="vd-result__sub">This document has been changed after it was submitted.</p>
        <div className="vd-result__details">
          <div className="vd-result__detail">
            <span className="vd-result__detail-icon"><IconUser /></span>
            <span className="vd-result__detail-label">Supplier</span>
            <span className="vd-result__detail-value">{result.supplier}</span>
          </div>
          <div className="vd-result__detail">
            <span className="vd-result__detail-icon"><IconCalendar /></span>
            <span className="vd-result__detail-label">Original Date</span>
            <span className="vd-result__detail-value">{result.date}</span>
          </div>
        </div>
        <div className="vd-result__badge vd-result__badge--yellow">
          ⚠ &nbsp;Changes detected — use with caution
        </div>
      </div>
    );
  }

  return (
    <div className="vd-result vd-result--notfound">
      <div className="vd-result__glow vd-result__glow--red" />
      <div className="vd-result__icon"><IconNotFound /></div>
      <h3 className="vd-result__title">Not Found</h3>
      <p className="vd-result__sub">No record found for this document. It may not have been submitted through TrustChain.</p>
      <div className="vd-result__badge vd-result__badge--red">
        ✕ &nbsp;Document not in our records
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function VerifyDocument() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const role      = localStorage.getItem("role") || "Buyer";
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer    = role === "Buyer"    || role === "Both";
  const [navOpen, setNavOpen] = useState(false);

  const [docId,     setDocId]     = useState("");
  const [fileName,  setFileName]  = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [error, setError] = useState("");
  const [dragging,  setDragging]  = useState(false);
  const [hasInput,  setHasInput]  = useState(false);

  // Lock scroll on this page only; restore when leaving
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setSelectedFile(file);
    setDocId("");
    setHasInput(true);
    setResult(null);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleIdChange = (e) => {
    setDocId(e.target.value);
    setFileName("");
    setSelectedFile(null);
    setHasInput(!!e.target.value.trim());
    setResult(null);
    setError("");
  };

  const handleVerify = async () => {
    if (!hasInput) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = new FormData();
      if (docId.trim()) data.append("document_id", docId.trim());
      if (selectedFile) data.append("file", selectedFile);
      const response = await api.post("/documents/verify", data, {
        headers: authHeaders(),
      });
      const apiResult = response.data.data.verification_result;
      const status = apiResult === "Valid" ? "valid" : apiResult === "Modified" ? "modified" : "notfound";
      setResult({
        status,
        supplier: "Stored in TrustChain",
        date: new Date().toLocaleDateString("en-GB"),
        score: status === "valid" ? 8.5 : 5,
      });
    } catch (err) {
      setError(getMessage(err, "Could not verify document."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vd-root">

      {/* ── Navbar ── */}
      <nav className="vd-nav">
        <div className="vd-nav-inner">
          <Link to="/dashboard" className="vd-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="vd-brand-name">TrustChain</span>
          </Link>

          <div className={`vd-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard" className="vd-nav-link">Dashboard</Link>
            {showSupplier && <Link to="/upload"    className="vd-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="vd-nav-link">Documents</Link>}
            {showBuyer    && <Link to="/verify"    className="vd-nav-link vd-nav-active">Verify</Link>}
            {showBuyer    && <Link to="/search"    className="vd-nav-link">Search</Link>}
            {showSupplier && <Link to="/profile"   className="vd-nav-link">Profile</Link>}
          </div>

          <button className="vd-logout-btn" onClick={handleLogout}>
            <IconLogout />
            <span>Logout</span>
          </button>
          <button className="vd-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="vd-main">

        {/* Page header */}
        <div className="vd-page-header">
          <button className="vd-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div>
            <h1 className="vd-page-title">Verify Document</h1>
            <p className="vd-page-subtitle">Check if a document is authentic and unchanged.</p>
          </div>
        </div>

        {/* ── Split layout ── */}
        <div className="vd-split">

          {/* ── LEFT: Input panel ── */}
          <div className="vd-left">
            <div className="vd-card">

              {/* Drop zone */}
              <div
                className={`vd-dropzone ${dragging ? "vd-dropzone--drag" : ""} ${fileName ? "vd-dropzone--filled" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div className="vd-dropzone__icon">
                  {fileName
                    ? <div className="vd-dropzone__doc-icon"><IconDoc /></div>
                    : <IconUpload />
                  }
                </div>
                {fileName ? (
                  <>
                    <p className="vd-dropzone__name">{fileName}</p>
                    <p className="vd-dropzone__hint">Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="vd-dropzone__label">Drop your file here</p>
                    <p className="vd-dropzone__hint">PDF, DOC, DOCX, PNG, JPG · max 20 MB</p>
                    <button className="vd-browse-btn" type="button"
                      onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                      Browse files
                    </button>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="vd-or">
                <div className="vd-or__line" />
                <span className="vd-or__text">or enter a Document ID</span>
                <div className="vd-or__line" />
              </div>

              {/* Document ID input */}
              <div className="vd-id-field">
                <label className="vd-label">Document ID</label>
                <input
                  className="vd-input"
                  type="text"
                  placeholder="e.g. TC-2025-001"
                  value={docId}
                  onChange={handleIdChange}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
                <p className="vd-input-hint">
                  Try: <button className="vd-hint-btn" onClick={() => { setDocId("TC-2025-001"); setHasInput(true); setResult(null); }}>TC-2025-001</button>
                  {" · "}
                  <button className="vd-hint-btn" onClick={() => { setDocId("TC-2025-002"); setHasInput(true); setResult(null); }}>TC-2025-002</button>
                  {" · "}
                  <button className="vd-hint-btn" onClick={() => { setDocId("TC-2025-999"); setHasInput(true); setResult(null); }}>TC-2025-999</button>
                </p>
              </div>

              {/* Verify button */}
              {error && <p className="vd-input-hint" style={{ color: "#dc2626" }}>{error}</p>}

              <button
                className={`vd-verify-btn ${!hasInput ? "vd-verify-btn--disabled" : ""}`}
                onClick={handleVerify}
                disabled={!hasInput || loading}
              >
                {loading ? (
                  <><span className="vd-btn-spinner" /> Verifying…</>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L3 5.5v5c0 4.1 2.9 8 7 9 4.1-1 7-4.9 7-9v-5L10 2z"
                        stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
                      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verify Document
                  </>
                )}
              </button>

            </div>
          </div>

          {/* ── RIGHT: Result panel ── */}
          <div className="vd-right">
            {loading ? (
              <Spinner />
            ) : result ? (
              <ResultCard result={result} />
            ) : (
              <div className="vd-placeholder">
                <div className="vd-placeholder__rings">
                  <div className="vd-placeholder__ring vd-placeholder__ring--1" />
                  <div className="vd-placeholder__ring vd-placeholder__ring--2" />
                  <div className="vd-placeholder__ring vd-placeholder__ring--3" />
                  <div className="vd-placeholder__icon"><IconPlaceholder /></div>
                </div>
                <p className="vd-placeholder__title">Ready to verify</p>
                <p className="vd-placeholder__sub">Upload a document or enter a Document ID to check its authenticity.</p>
                <div className="vd-placeholder__features">
                  <div className="vd-placeholder__feat">
                    <span className="vd-placeholder__feat-dot vd-placeholder__feat-dot--green" />
                    Authentic check
                  </div>
                  <div className="vd-placeholder__feat">
                    <span className="vd-placeholder__feat-dot vd-placeholder__feat-dot--blue" />
                    Supplier info
                  </div>
                  <div className="vd-placeholder__feat">
                    <span className="vd-placeholder__feat-dot vd-placeholder__feat-dot--teal" />
                    Trust score
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="vd-footer">
        <span>© 2025 TrustChain</span>
        <span className="vd-footer-dot">·</span>
        <a href="#" className="vd-footer-link">Privacy</a>
        <span className="vd-footer-dot">·</span>
        <a href="#" className="vd-footer-link">Support</a>
      </footer>

    </div>
  );
}
