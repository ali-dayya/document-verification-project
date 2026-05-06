import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders, getMessage } from "../api";
import "./UploadDocument.css";

/* ─── Navbar ─── */
function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <nav className="ud-nav">
      <div className="ud-nav-inner">
        <Link to="/dashboard" className="ud-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
            <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity=".9"/>
            <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ud-brand-name">TrustChain</span>
        </Link>
        <div className={`ud-nav-links ${open ? "open" : ""}`}>
          <Link to="/dashboard" className="ud-nav-link">Dashboard</Link>
          <Link to="/upload"    className="ud-nav-link ud-nav-active">Upload</Link>
          <Link to="/documents" className="ud-nav-link">Documents</Link>
          <Link to="/profile"   className="ud-nav-link">Profile</Link>
        </div>
        <button className="ud-logout-btn" onClick={() => navigate("/")}>
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
            <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </button>
        <button className="ud-hamburger" onClick={() => setOpen(!open)}>
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}

/* ─── Animated drop zone with floating dots ─── */
function DropZone({ file, dragOver, onDragOver, onDragLeave, onDrop, onClick, onRemove, formatSize }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  /* Particle animation — only when no file selected */
  useEffect(() => {
    if (file) { cancelAnimationFrame(animRef.current); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    const dots = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.35 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > w) d.dx *= -1;
        if (d.y < 0 || d.y > h) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = dragOver
          ? `rgba(14,165,164,${d.alpha + 0.15})`
          : `rgba(30,58,138,${d.alpha})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [file, dragOver]);

  return (
    <div
      className={`ud-dropzone ${dragOver ? "ud-dragover" : ""} ${file ? "ud-has-file" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={!file ? onClick : undefined}
    >
      {!file && (
        <canvas ref={canvasRef} className="ud-dz-canvas" />
      )}

      {file ? (
        /* ── File preview ── */
        <div className="ud-file-preview">
          <div className="ud-file-thumb">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M7 3h10l6 6v16a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                fill="#eef2ff" stroke="#1E3A8A" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M17 3v6h6" stroke="#1E3A8A" strokeWidth="1.3" strokeLinejoin="round"/>
              <line x1="10" y1="14" x2="18" y2="14" stroke="#1E3A8A" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="10" y1="18" x2="15" y2="18" stroke="#1E3A8A" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="ud-file-meta">
            <span className="ud-file-name">{file.name}</span>
            <span className="ud-file-size">{formatSize(file.size)}</span>
          </div>
          <div className="ud-file-ok">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="1"/>
              <path d="M5 8l2 2 4-4" stroke="#0EA5A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button type="button" className="ud-file-remove" onClick={e => { e.stopPropagation(); onRemove(); }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="ud-dz-body">
          <div className={`ud-dz-icon ${dragOver ? "ud-dz-icon-active" : ""}`}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M16 22V10M10 16l6-6 6 6" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 24v1.5A2.5 2.5 0 007.5 28h17a2.5 2.5 0 002.5-2.5V24"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="ud-dz-headline">
            {dragOver ? "Release to upload" : "Drop your file here"}
          </p>
          <p className="ud-dz-sub">PDF, DOC, DOCX, PNG, JPG · max 20 MB</p>
          <button
            type="button"
            className="ud-choose-btn"
            onClick={e => { e.stopPropagation(); onClick(); }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Browse files
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Safety card items ─── */
const SAFETY_BULLET_TEXTS = [
  "Your file is secured",
  "Only you can share access",
  "Others can verify it anytime",
];
void SAFETY_BULLET_TEXTS;

const DOC_TYPES = ["Invoice", "Payment Proof", "Certificate", "Contract", "Other"];

/* ─── Main ─── */
export default function UploadDocument() {
  const navigate    = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile]           = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [docType, setDocType]     = useState("");
  const [factory, setFactory]     = useState("");
  const [error, setError]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const fmt = b => b < 1024 ? `${b} B`
    : b < 1048576 ? `${(b/1024).toFixed(1)} KB`
    : `${(b/1048576).toFixed(1)} MB`;

  const pick = f => { if (f) { setFile(f); setError(""); } };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file)         { setError("Please select a file."); return; }
    if (!docType)      { setError("Please select a document type."); return; }
    const factoryId = localStorage.getItem("factoryId");
    if (!factoryId) { setError("Please save your factory profile first."); return; }
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("document_type", docType);
      data.append("factory_id", factoryId);
      const response = await api.post("/documents/upload", data, {
        headers: authHeaders(),
      });
      localStorage.setItem("lastDocumentId", response.data.data.document_id);
      setSubmitted(true);
    } catch (err) {
      setError(getMessage(err, "Could not upload document."));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null); setDocType(""); setFactory("");
    setSubmitted(false); setError(""); setLoading(false);
  };

  return (
    <div className="ud-root">
      <Navbar />

      <main className="ud-main">

        {/* Page header */}
        <div className="ud-page-header">
          <button className="ud-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 5l-4 3 4 3" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div>
            <h1 className="ud-title">Upload Document</h1>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="ud-layout">

          {/* LEFT: form */}
          <div className="ud-form-col">

            {submitted ? (
              /* ── Success ── */
              <div className="ud-card ud-success-card">
                <div className="ud-success-ring">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="26" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="1.5"/>
                    <circle cx="28" cy="28" r="18" fill="#ccfbf1" opacity=".5"/>
                    <path d="M18 28l7 7 13-13" stroke="#0EA5A4" strokeWidth="2.4"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="ud-success-heading">Document Secured!</h2>
                <p className="ud-success-text">
                  Your document has been uploaded and is now ready for verification.
                </p>
                <div className="ud-success-pill-row">
                  <span className="ud-success-pill">{file.name}</span>
                  <span className="ud-success-pill ud-pill-teal">{docType}</span>
                </div>
                <div className="ud-success-detail">
                  <div className="ud-detail-row">
                    <span>Company</span><span>{factory}</span>
                  </div>
                  <div className="ud-detail-row">
                    <span>Status</span>
                    <span className="ud-status-chip">
                      <span className="ud-status-dot"/>
                      Ready for verification
                    </span>
                  </div>
                  <div className="ud-detail-row">
                    <span>Uploaded</span><span>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                  </div>
                </div>
                <div className="ud-success-actions">
                  <button className="ud-btn-primary" onClick={reset}>Upload Another</button>
                  <Link to="/documents" className="ud-btn-ghost">View Documents →</Link>
                </div>
              </div>
            ) : (
              /* ── Form ── */
              <form className="ud-card ud-form-card" onSubmit={handleSubmit} noValidate>

                {/* Drop zone */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="ud-file-input"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={e => pick(e.target.files?.[0])}
                />
                <DropZone
                  file={file}
                  dragOver={dragOver}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files?.[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  onRemove={() => setFile(null)}
                  formatSize={fmt}
                />

                {/* Fields */}
                <div className="ud-fields-row">
                  <div className="ud-field-group">
                    <label className="ud-label" htmlFor="ud-type">Document Type</label>
                    <div className="ud-select-wrap">
                      <select id="ud-type" className="ud-select" value={docType}
                        onChange={e => { setDocType(e.target.value); setError(""); }}>
                        <option value="">Select type…</option>
                        {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <svg className="ud-select-chev" width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  <div className="ud-field-group">
                    <label className="ud-label" htmlFor="ud-factory">Company / Factory Name</label>
                    <input id="ud-factory" type="text" className="ud-input"
                      placeholder="e.g. Alpha Manufacturing Co."
                      value={factory}
                      onChange={e => { setFactory(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="ud-error">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1"/>
                      <path d="M7 4v3.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="7" cy="10" r=".7" fill="#dc2626"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  className={`ud-btn-primary ud-submit-btn ${loading ? "ud-loading" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="ud-spinner"/>
                      Securing your document…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <path d="M9 2L4 4.5v4c0 3.7 2.4 7.1 5 8 2.6-.9 5-4.3 5-8v-4L9 2z"
                          fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                        <path d="M6.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload &amp; Secure Document
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* RIGHT: safety card */}
          <div className="ud-side-col">

            {/* Trust card */}
            <div className="ud-safety-card">
              <div className="ud-safety-header">
                <div className="ud-safety-shield">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z"
                      fill="white" opacity=".15" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="ud-safety-title">Built for trust</h3>
              </div>
              <div className="ud-safety-bullets">
                <div className="ud-safety-bullet">
                  <div className="ud-bullet-icon">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="9" width="14" height="10" rx="2" fill="#eef2ff" stroke="#1E3A8A" strokeWidth="1.4"/>
                      <path d="M6 9V6a4 4 0 018 0v3" stroke="#1E3A8A" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="10" cy="14" r="1.2" fill="#1E3A8A"/>
                    </svg>
                  </div>
                  <span>Your file is secured</span>
                </div>
                <div className="ud-safety-bullet">
                  <div className="ud-bullet-icon">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3.5" fill="#eef2ff" stroke="#1E3A8A" strokeWidth="1.4"/>
                      <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#1E3A8A" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Only you can share access</span>
                </div>
                <div className="ud-safety-bullet">
                  <div className="ud-bullet-icon">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="7.5" fill="#f0fdfa" stroke="#0EA5A4" strokeWidth="1.4"/>
                      <path d="M7 10l2 2 4-4" stroke="#0EA5A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Others can verify it anytime</span>
                </div>
              </div>
            </div>

            {/* Formats card */}
            <div className="ud-card ud-formats-card">
              <p className="ud-formats-title">Accepted formats</p>
              <div className="ud-formats-wrap">
                {["PDF","DOC","DOCX","PNG","JPG"].map(f => (
                  <span className="ud-fmt-badge" key={f}>{f}</span>
                ))}
              </div>
              <p className="ud-formats-note">Maximum file size: 20 MB</p>
            </div>

          </div>
        </div>
      </main>

      <footer className="ud-footer">
        <span>© 2025 TrustChain</span>
        <span className="ud-footer-dot">·</span>
        <a href="#" className="ud-footer-link">Privacy</a>
        <span className="ud-footer-dot">·</span>
        <a href="#" className="ud-footer-link">Support</a>
      </footer>
    </div>
  );
}
