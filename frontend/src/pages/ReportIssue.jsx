import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders, getMessage } from "../api";
import "./ReportIssue.css";

/* ─── Icons ─── */
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 3v14M4 3h11l-3 4.5 3 4.5H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L3 5v5c0 3.7 2.6 7.1 6 8 3.4-.9 6-4.3 6-8V5L9 2z"
        stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M6.5 9l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M15 20V10M10 15l5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 23v1a2 2 0 002 2h16a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
      <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}

const ISSUE_TYPES = [
  "Fake Document",
  "Incorrect Information",
  "Expired Certificate",
  "Suspicious Activity",
  "Other",
];

const STATUS_MAP = {
  "Pending":      { bg: "#fef9c3", color: "#b45309" },
  "Under Review": { bg: "#dbeafe", color: "#1E3A8A" },
  "Resolved":     { bg: "#dcfce7", color: "#16a34a" },
};

/* ─── Component ─── */
export default function ReportIssue() {
  const navigate     = useNavigate();
  const role         = localStorage.getItem("role") || "Buyer";
  const showSupplier = role === "Supplier" || role === "Both";
  const showBuyer    = role === "Buyer"    || role === "Both";
  const [navOpen, setNavOpen] = useState(false);

  const [supplier,    setSupplier]    = useState("");
  const [document,    setDocument]    = useState("");
  const [issueType,   setIssueType]   = useState("");
  const [description, setDescription] = useState("");
  const [fileName,    setFileName]    = useState("");
  const [dragging,    setDragging]    = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/documents", { headers: authHeaders() })
      .then((response) => setDocuments(response.data.data || []))
      .catch(() => setDocuments([]));

    api.get("/disputes", { headers: authHeaders() })
      .then((response) => setReports(response.data.data || []))
      .catch(() => setReports([]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleSupplierChange = (e) => {
    setSupplier(e.target.value);
    setDocument("");
  };

  const handleFile = (file) => {
    if (file) setFileName(file.name);
  };

  const isValid = supplier && issueType && description.trim().length > 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    const documentId = localStorage.getItem("lastDocumentId");
    if (!documentId) {
      setError("Verify or upload a document first so the report can be linked.");
      return;
    }
    setError("");
    try {
      await api.post("/disputes", {
        document_id: documentId,
        reason: `${issueType}: ${description}`,
      }, { headers: authHeaders() });
      setReports((current) => [
        {
          dispute_id: `new-${Date.now()}`,
          document_id: documentId,
          reason: `${issueType}: ${description}`,
          status: "Open",
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
      setSubmitted(true);
      setSupplier(""); setDocument(""); setIssueType("");
      setDescription(""); setFileName("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(getMessage(err, "Could not submit report."));
    }
  };

  const docs = documents.map((doc) => `Document #${doc.document_id} - ${doc.document_type}`);

  return (
    <div className="ri-root">

      {/* ── Navbar ── */}
      <nav className="ri-nav">
        <div className="ri-nav-inner">
          <Link to="/dashboard" className="ri-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#1E3A8A"/>
              <path d="M16 6L8 10v7c0 4.6 3.3 8.9 8 10 4.7-1.1 8-5.4 8-10v-7L16 6z" fill="#fff" opacity="0.9"/>
              <path d="M13 16.5l2 2 4-4" stroke="#1E3A8A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ri-brand-name">TrustChain</span>
          </Link>

          <div className={`ri-nav-links ${navOpen ? "open" : ""}`}>
            <Link to="/dashboard"  className="ri-nav-link">Dashboard</Link>
            {showSupplier && <Link to="/upload"    className="ri-nav-link">Upload</Link>}
            {showSupplier && <Link to="/documents" className="ri-nav-link">Documents</Link>}
            {showBuyer    && <Link to="/verify"    className="ri-nav-link">Verify</Link>}
            {showBuyer    && <Link to="/search"    className="ri-nav-link">Search</Link>}
            {showBuyer    && <Link to="/report"    className="ri-nav-link ri-nav-active">Report</Link>}
            {showSupplier && <Link to="/profile"   className="ri-nav-link">Profile</Link>}
          </div>

          <button className="ri-logout-btn" onClick={handleLogout}>
            <IconLogout /><span>Logout</span>
          </button>
          <button className="ri-hamburger" onClick={() => setNavOpen(!navOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <main className="ri-main">

        {/* Page header */}
        <div className="ri-page-header">
          <div className="ri-page-header__left">
            <button className="ri-back-btn" onClick={() => navigate("/dashboard")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div>
              <div className="ri-title-row">
                <div className="ri-title-icon"><IconFlag /></div>
                <h1 className="ri-page-title">Report an Issue</h1>
              </div>
              <p className="ri-page-subtitle">Submit a concern about a document or supplier activity.</p>
            </div>
          </div>
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="ri-success">
            <IconCheck />
            <div>
              <strong>Report submitted successfully.</strong>
              <span> Our team will review it confidentially within 48 hours.</span>
            </div>
          </div>
        )}

        {error && <div className="ri-success"><span>{error}</span></div>}

        {/* ── Two-column layout ── */}
        <div className="ri-layout">

          {/* LEFT: Form */}
          <div className="ri-left">
            <form className="ri-card" onSubmit={handleSubmit}>
              <div className="ri-card-header">
                <IconFlag />
                <span>Issue Details</span>
              </div>

              <div className="ri-fields">

                {/* Supplier */}
                <div className="ri-field">
                  <label className="ri-label">Supplier Name <span className="ri-req">*</span></label>
                  <input
                    className="ri-input"
                    type="text"
                    placeholder="e.g. Alpha Manufacturing Co."
                    value={supplier}
                    onChange={handleSupplierChange}
                  />
                </div>

                {/* Document */}
                <div className="ri-field">
                  <label className="ri-label">Related Document <span className="ri-opt">(optional)</span></label>
                  <div className="ri-select-wrap">
                    <select className="ri-select" value={document}
                      onChange={e => setDocument(e.target.value)} disabled={!supplier}>
                      <option value="">{supplier ? "Select a document…" : "Select supplier first"}</option>
                      {docs.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <span className="ri-select-arrow"><IconChevron /></span>
                  </div>
                </div>

                {/* Issue type chips */}
                <div className="ri-field ri-field-full">
                  <label className="ri-label">Issue Type <span className="ri-req">*</span></label>
                  <div className="ri-chips">
                    {ISSUE_TYPES.map(t => (
                      <button key={t} type="button"
                        className={`ri-chip ${issueType === t ? "ri-chip--on" : ""}`}
                        onClick={() => setIssueType(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="ri-field ri-field-full">
                  <label className="ri-label">
                    Describe the Issue <span className="ri-req">*</span>
                  </label>
                  <textarea
                    className="ri-textarea"
                    rows={5}
                    placeholder="Please describe what you observed, including any relevant details about the document or supplier…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <span className="ri-char">{description.length} characters</span>
                </div>

                {/* File upload */}
                <div className="ri-field ri-field-full">
                  <label className="ri-label">
                    Attach Evidence <span className="ri-opt">(optional)</span>
                  </label>
                  <div
                    className={`ri-drop ${dragging ? "ri-drop--drag" : ""} ${fileName ? "ri-drop--filled" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => window.document.getElementById("ri-file").click()}
                  >
                    <input id="ri-file" type="file" style={{ display: "none" }}
                      onChange={e => handleFile(e.target.files[0])} />
                    <div className="ri-drop__icon">
                      {fileName ? <IconDoc /> : <IconUpload />}
                    </div>
                    {fileName ? (
                      <p className="ri-drop__name">{fileName}</p>
                    ) : (
                      <>
                        <p className="ri-drop__label">Drop a file or click to browse</p>
                        <p className="ri-drop__hint">PNG, JPG, PDF · max 10 MB</p>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="ri-form-foot">
                <button type="submit"
                  className={`ri-submit ${!isValid ? "ri-submit--off" : ""}`}
                  disabled={!isValid}>
                  <IconFlag />
                  Submit Report
                </button>
                {!isValid && <p className="ri-hint">Fill in the required fields (*) to continue.</p>}
              </div>
            </form>
          </div>

          {/* RIGHT: Info + stats */}
          <aside className="ri-right">

            {/* How it works */}
            <div className="ri-card ri-info">
              <div className="ri-info__top">
                <div className="ri-info__icon"><IconShield /></div>
                <h3 className="ri-info__title">How it works</h3>
              </div>
              <ul className="ri-info__list">
                <li className="ri-info__item">
                  <span className="ri-dot ri-dot--navy" />
                  <div>
                    <strong>Secure Review</strong>
                    <p>All reports are reviewed by our dedicated verification team.</p>
                  </div>
                </li>
                <li className="ri-info__item">
                  <span className="ri-dot ri-dot--teal" />
                  <div>
                    <strong>Confidential</strong>
                    <p>Your identity is never shared with the reported supplier.</p>
                  </div>
                </li>
                <li className="ri-info__item">
                  <span className="ri-dot ri-dot--green" />
                  <div>
                    <strong>Action Taken</strong>
                    <p>Verified issues result in document flags or account suspension.</p>
                  </div>
                </li>
                <li className="ri-info__item">
                  <span className="ri-dot ri-dot--purple" />
                  <div>
                    <strong>You're notified</strong>
                    <p>We'll update you once the investigation is complete.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="ri-card ri-stats">
              <div className="ri-stat">
                <span className="ri-stat__num">98%</span>
                <span className="ri-stat__txt">Reviewed within 48 hours</span>
              </div>
              <div className="ri-stat-sep" />
              <div className="ri-stat">
                <span className="ri-stat__num">100%</span>
                <span className="ri-stat__txt">Submitter identity protected</span>
              </div>
            </div>

          </aside>
        </div>

        {/* ── Recent Reports ── */}
        <div className="ri-card ri-reports">
          <div className="ri-card-header">
            <IconDoc />
            <span>Your Recent Reports</span>
          </div>
          <div className="ri-table-wrap">
            <table className="ri-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Supplier</th>
                  <th>Issue Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.length ? reports.map((r, i) => {
                  const s = STATUS_MAP[r.status] || {};
                  return (
                    <tr key={i} className="ri-tr">
                      <td className="ri-td-id">#{r.dispute_id}</td>
                      <td>Document #{r.document_id}</td>
                      <td className="ri-td-issue">{r.reason}</td>
                      <td>
                        <span className="ri-badge"
                          style={{ background: s.bg, color: s.color }}>{r.status}</span>
                      </td>
                      <td className="ri-td-date">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                }) : (
                  <tr className="ri-tr">
                    <td colSpan="5">No reports submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <footer className="ri-footer">
        <span>© 2025 TrustChain</span>
        <span className="ri-sep">·</span>
        <a href="#" className="ri-flink">Privacy</a>
        <span className="ri-sep">·</span>
        <a href="#" className="ri-flink">Support</a>
      </footer>

    </div>
  );
}
