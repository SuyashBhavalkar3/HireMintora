"use client";

import { useState } from "react";
import { apiImportCandidates, ApiError } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  driveId: string;
  onClose: () => void;
  onImported: () => void;
}

// ─── Parser ────────────────────────────────────────────────────────────────────

function parseCandidates(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      const email = parts[0] ?? "";
      const fullName = parts.slice(1).join(" ").trim() || "Candidate";
      return { email, fullName };
    })
    .filter((c) => c.email.includes("@"));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImportCandidatesModal({ driveId, onClose, onImported }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const parsed = parseCandidates(text);

  const handleImport = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!parsed.length) {
      setError("Please enter at least one valid candidate (email required).");
      return;
    }

    setLoading(true);
    try {
      const res = await apiImportCandidates(driveId, parsed);
      const msg = `✅ ${res.count} candidate${res.count !== 1 ? "s" : ""} imported successfully.${
        res.errors?.length ? ` ${res.errors.length} skipped.` : ""
      }`;
      setSuccessMsg(msg);

      setTimeout(() => {
        onImported();
        onClose();
      }, 1600);
    } catch (err) {
      if (err instanceof ApiError) setError(err.messages.join(" "));
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-head">
          <div>
            <div className="modal-title">Import Candidates</div>
            <div className="modal-sub">
              One per line:{" "}
              <code style={{ background: "var(--bg)", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>
                email, Full Name
              </code>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <div className="field">
            <label className="field-label">Candidate list</label>
            <textarea
              className="input"
              style={{ minHeight: 160, fontFamily: "monospace", fontSize: 13 }}
              placeholder={
                "john@example.com, John Smith\njane@company.com, Jane Doe\nbob@corp.io, Bob Johnson"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
          </div>

          {parsed.length > 0 && (
            <p style={{ fontSize: 13, color: "var(--mint-dark)", fontWeight: 600 }}>
              {parsed.length} candidate{parsed.length !== 1 ? "s" : ""} detected
            </p>
          )}

          <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
            Existing candidates (same email + drive) will have their token refreshed.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={loading || !parsed.length}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Importing…
              </>
            ) : (
              `Import ${parsed.length || ""} Candidate${parsed.length !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
