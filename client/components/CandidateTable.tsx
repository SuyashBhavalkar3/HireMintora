/**
 * @file CandidateTable.tsx
 * @description Presentational table component for displaying imported candidates
 * within a specific hiring drive. Shows candidate name, email, invitation status
 * (Pending / Invited), a truncated access token, and the import date.
 *
 * Used in: /dashboard/drive/[id]/page.tsx
 */

"use client";
// ─── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  status: "IMPORTED" | "INVITED";
  token: string;
  createdAt: string;
}

interface Props {
  candidates: Candidate[];
  loading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CandidateTable({ candidates, loading }: Props) {
  if (loading) {
    return (
      <div className="table-wrap">
        <div className="table-empty">
          <span className="spinner" style={{ margin: "0 auto" }} />
          <p style={{ marginTop: 12 }}>Loading candidates…</p>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="table-wrap">
        <div className="table-empty">
          <p style={{ fontSize: 36, marginBottom: 10 }}>👥</p>
          <p>No candidates yet. Import some to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Token</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 600 }}>{c.fullName}</td>
              <td style={{ color: "var(--text-2)" }}>{c.email}</td>
              <td>
                <span
                  className={`badge badge-${c.status.toLowerCase()}`}
                >
                  {c.status === "IMPORTED" ? "Pending" : "Invited"}
                </span>
              </td>
              <td>
                <span className="table-token" title={c.token}>
                  {c.token.slice(0, 8)}•••{c.token.slice(-4)}
                </span>
              </td>
              <td style={{ color: "var(--text-2)", fontSize: 13 }}>
                {new Date(c.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
