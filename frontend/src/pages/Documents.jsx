import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../api";
import "./Documents.css";

const sampleDocuments = [
  { id: 1, name: "National ID Card",          type: "Identity",         uploadDate: "2025-04-10", status: "Verified", size: "1.2 MB", pages: 2,  notes: "Government-issued identity document." },
  { id: 2, name: "Utility Bill – March 2025", type: "Proof of Address", uploadDate: "2025-04-12", status: "Pending",  size: "0.8 MB", pages: 1,  notes: "Awaiting verification by the TrustChain team." },
  { id: 3, name: "Bank Statement Q1",         type: "Financial",        uploadDate: "2025-04-15", status: "Verified", size: "2.1 MB", pages: 5,  notes: "Q1 bank statement, all transactions included." },
  { id: 4, name: "Passport Copy",             type: "Identity",         uploadDate: "2025-04-18", status: "Rejected", size: "0.5 MB", pages: 1,  notes: "Document was rejected due to low image quality." },
  { id: 5, name: "Employment Contract",       type: "Legal",            uploadDate: "2025-04-20", status: "Pending",  size: "1.7 MB", pages: 8,  notes: "Full-time employment contract pending review." },
  { id: 6, name: "Tax Return 2024",           type: "Financial",        uploadDate: "2025-04-22", status: "Verified", size: "3.0 MB", pages: 12, notes: "Annual tax return for fiscal year 2024." },
];

const STATUS_CONFIG = {
  Verified: { className: "badge badge--verified" },
  Pending:  { className: "badge badge--pending"  },
  Rejected: { className: "badge badge--rejected" },
};

const STATUS_ICON = {
  Verified: "✅",
  Pending:  "⏳",
  Rejected: "❌",
};

export default function Documents() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [docs, setDocs]         = useState(sampleDocuments);
  const [deleted, setDeleted]   = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/documents", { headers: authHeaders() })
      .then((response) => {
        const list = response.data.data.map((doc) => ({
          id: doc.document_id,
          name: `Document #${doc.document_id}`,
          type: doc.document_type,
          uploadDate: doc.upload_date,
          status: doc.status === "Valid" ? "Verified" : doc.status,
          size: "-",
          pages: "-",
          notes: `Risk level: ${doc.risk_level}`,
        }));
        setDocs(list);
      })
      .catch(() => {});
  }, []);

  const filtered = docs.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || doc.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    const doc = docs.find((d) => d.id === id);
    setDeleted(doc?.name ?? "Document");
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setTimeout(() => setDeleted(null), 3000);
  };

  const handleDownload = (doc) => {
    // Creates a simple text blob representing the file and triggers download
    const content = `Document: ${doc.name}\nType: ${doc.type}\nStatus: ${doc.status}\nUpload Date: ${formatDate(doc.uploadDate)}\nSize: ${doc.size}\nPages: ${doc.pages}\nNotes: ${doc.notes}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${doc.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });

  return (
    <div className="docs-page">

      {/* Toast */}
      {deleted && (
        <div className="toast">
          <span className="toast__icon">🗑</span>
          <span><strong>{deleted}</strong> was deleted.</span>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header__left">
                <span className="modal-icon">📄</span>
                <div>
                  <h2 className="modal-title">{previewDoc.name}</h2>
                  <span className="modal-type">{previewDoc.type}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Status banner */}
              <div className={`modal-status-banner modal-status-banner--${previewDoc.status.toLowerCase()}`}>
                <span>{STATUS_ICON[previewDoc.status]}</span>
                <span>{previewDoc.status}</span>
              </div>

              {/* Details grid */}
              <div className="modal-details">
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Upload Date</span>
                  <span className="modal-detail-value">{formatDate(previewDoc.uploadDate)}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">File Size</span>
                  <span className="modal-detail-value">{previewDoc.size}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Pages</span>
                  <span className="modal-detail-value">{previewDoc.pages}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Document Type</span>
                  <span className="modal-detail-value">{previewDoc.type}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="modal-notes">
                <span className="modal-detail-label">Notes</span>
                <p className="modal-notes-text">{previewDoc.notes}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn--secondary" onClick={() => setPreviewDoc(null)}>
                Close
              </button>
              <button className="modal-btn modal-btn--primary" onClick={() => { handleDownload(previewDoc); setPreviewDoc(null); }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v10M6 9l4 4 4-4M4 17h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="docs-header">
        <div className="docs-header__left">
          <button className="docs-back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="docs-header__text">
            <h1 className="docs-title">Documents</h1>
            <p className="docs-subtitle">Manage and view your uploaded documents</p>
          </div>
        </div>
        <span className="docs-count">{docs.length} total</span>
      </header>

      {/* Controls */}
      <div className="docs-controls">
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div className="filter-wrap">
          {["All", "Verified", "Pending", "Rejected"].map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? " filter-btn--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="docs-table-wrap">
        {filtered.length === 0 ? (
          <div className="docs-empty">
            <div className="docs-empty__icon">📂</div>
            <p className="docs-empty__msg">No documents match your search.</p>
          </div>
        ) : (
          <table className="docs-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const { className } = STATUS_CONFIG[doc.status];
                return (
                  <tr key={doc.id} className="docs-row">
                    <td>
                      <div className="doc-name-cell">
                        <span className="doc-icon">📄</span>
                        <span className="doc-name">{doc.name}</span>
                      </div>
                    </td>
                    <td className="doc-type">{doc.type}</td>
                    <td className="doc-date">{formatDate(doc.uploadDate)}</td>
                    <td><span className={className}>{doc.status}</span></td>
                    <td>
                      <div className="actions">
                        <button className="action-btn action-btn--view" onClick={() => setPreviewDoc(doc)}>
                          <svg viewBox="0 0 20 20" fill="none">
                            <path d="M1 10s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6z" stroke="currentColor" strokeWidth="1.6"/>
                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
                          </svg>
                          View
                        </button>
                        <button className="action-btn action-btn--download" onClick={() => handleDownload(doc)}>
                          <svg viewBox="0 0 20 20" fill="none">
                            <path d="M10 3v10M6 9l4 4 4-4M4 17h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                          </svg>
                          Download
                        </button>
                        <button className="action-btn action-btn--delete" onClick={() => handleDelete(doc.id)}>
                          <svg viewBox="0 0 20 20" fill="none">
                            <path d="M4 6h12M8 6V4h4v2M7 9v6M13 9v6M5 6l1 10h8l1-10"
                              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="docs-footer-note">
          Showing <strong>{filtered.length}</strong> of <strong>{docs.length}</strong> documents
        </p>
      )}

      {/* Footer */}
      <footer className="docs-footer">
        <span>© 2025 TrustChain</span>
        <span className="docs-footer-dot">·</span>
        <a href="#" className="docs-footer-link">Privacy</a>
        <span className="docs-footer-dot">·</span>
        <a href="#" className="docs-footer-link">Support</a>
      </footer>

    </div>
  );
}
