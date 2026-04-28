/**
 * @file drive/[id]/page.tsx
 * @description Drive detail page — manage candidates for a specific hiring drive.
 *
 * Features:
 *   - Displays drive metadata (role, description, created date) from localStorage cache.
 *   - Fetches and displays the full candidate list via apiGetCandidates().
 *   - Import Candidates: Opens a modal to bulk-import candidates (CSV-like format).
 *   - Send Invitations: Triggers apiSendLinks() to dispatch interview links to pending candidates.
 *   - Stats bar showing total / invited / pending candidate counts.
 *
 * Data Flow:
 *   - Drive metadata: Read from localStorage cache (instant, no API call).
 *   - Candidate list: Fetched from server on mount and after each import/send operation.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { CandidateTable } from "@/components/CandidateTable";
import { ImportCandidatesModal } from "@/components/ImportCandidatesModal";
import { apiGetCandidates, apiSendLinks, ApiError } from "@/lib/api";
import { getStoredDrives } from "@/lib/drives";

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  status: "IMPORTED" | "INVITED";
  token: string;
  createdAt: string;
}

export default function DriveDetailPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const driveId = params.id as string;

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
    if (!isLoading && isAuthenticated && !user?.organisationId) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Load candidates
  const loadCandidates = useCallback(async () => {
    setCandidatesLoading(true);
    try {
      const res = await apiGetCandidates(driveId);
      setCandidates(res.candidates);
    } catch {
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  }, [driveId]);

  useEffect(() => {
    if (isAuthenticated && driveId) loadCandidates();
  }, [isAuthenticated, driveId, loadCandidates]);

  // Get drive metadata from localStorage cache
  const driveInfo = getStoredDrives().find((d) => d.id === driveId);

  const handleSendLinks = async () => {
    setSendError(null);
    setSendResult(null);
    setSendLoading(true);
    try {
      const res = await apiSendLinks(driveId);
      setSendResult(
        res.count > 0
          ? `✅ Invitations sent to ${res.count} candidate${res.count !== 1 ? "s" : ""}.`
          : "ℹ️ No pending candidates to invite."
      );
      // Refresh candidates to see updated statuses
      await loadCandidates();
    } catch (err) {
      if (err instanceof ApiError) setSendError(err.messages.join(" "));
      else setSendError("Failed to send invitations. Please try again.");
    } finally {
      setSendLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="page-loading">
        <span className="spinner" />
      </div>
    );
  }

  // Candidate stats
  const totalCandidates = candidates.length;
  const invitedCount = candidates.filter((c) => c.status === "INVITED").length;
  const pendingCount = candidates.filter((c) => c.status === "IMPORTED").length;

  return (
    <div className="drivedetail-page">
      <Navbar />

      {/* Header */}
      <div className="drivedetail-header">
        <div className="drivedetail-header-inner">
          <Link href="/dashboard" className="drivedetail-back">
            ← All Drives
          </Link>

          <div className="drivedetail-top">
            <div>
              <h1 className="drivedetail-role">
                {driveInfo?.role ?? "Hiring Drive"}
              </h1>
              {driveInfo?.description && (
                <p className="drivedetail-meta">{driveInfo.description}</p>
              )}
              {driveInfo?.createdAt && (
                <p className="drivedetail-meta" style={{ marginTop: 4 }}>
                  Created{" "}
                  {new Date(driveInfo.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            <div className="drivedetail-actions">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowImport(true);
                  setSendResult(null);
                  setSendError(null);
                }}
              >
                + Import Candidates
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSendLinks}
                disabled={sendLoading || pendingCount === 0}
                title={
                  pendingCount === 0
                    ? "No pending candidates to invite"
                    : undefined
                }
              >
                {sendLoading ? (
                  <>
                    <span className="spinner" />
                    Sending…
                  </>
                ) : (
                  `📨 Send Invitations${pendingCount > 0 ? ` (${pendingCount})` : ""}`
                )}
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="drivedetail-stats">
            <div className="drivedetail-stat">
              <span className="drivedetail-stat-n">{totalCandidates}</span>
              <span className="drivedetail-stat-l">Total Candidates</span>
            </div>
            <div className="drivedetail-stat">
              <span
                className="drivedetail-stat-n"
                style={{ color: "var(--mint-dark)" }}
              >
                {invitedCount}
              </span>
              <span className="drivedetail-stat-l">Invited</span>
            </div>
            <div className="drivedetail-stat">
              <span
                className="drivedetail-stat-n"
                style={{ color: "#92400E" }}
              >
                {pendingCount}
              </span>
              <span className="drivedetail-stat-l">Pending Invite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="drivedetail-body">
        {/* Notifications */}
        {sendResult && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            {sendResult}
          </div>
        )}
        {sendError && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            {sendError}
          </div>
        )}

        {/* Candidates section */}
        <div className="drivedetail-section-head">
          <h2 className="drivedetail-section-title">
            Candidates
            {totalCandidates > 0 && (
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-2)",
                }}
              >
                {totalCandidates}
              </span>
            )}
          </h2>
          {totalCandidates > 0 && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowImport(true)}
            >
              + Import More
            </button>
          )}
        </div>

        <CandidateTable candidates={candidates} loading={candidatesLoading} />
      </div>

      {/* Import Modal */}
      {showImport && (
        <ImportCandidatesModal
          driveId={driveId}
          onClose={() => setShowImport(false)}
          onImported={loadCandidates}
        />
      )}
    </div>
  );
}
