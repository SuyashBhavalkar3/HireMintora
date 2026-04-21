"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { apiCreateDrive, ApiError } from "@/lib/api";
import { storeDrive } from "@/lib/drives";

export default function NewDrivePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
    if (!isLoading && isAuthenticated && !user?.organisationId) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiCreateDrive({
        role: role.trim(),
        description: description.trim() || undefined,
      });

      // Cache the drive locally for dashboard listing
      storeDrive({
        id: res.drive.id,
        role: res.drive.role,
        description: res.drive.description,
        createdAt: res.drive.createdAt,
        organisationId: res.drive.organisationId,
      });

      router.push(`/dashboard/drive/${res.drive.id}`);
    } catch (err) {
      if (err instanceof ApiError) setError(err.messages.join(" "));
      else setError("Failed to create drive. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="page-loading">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="form-page">
      <Navbar />

      <div className="form-page-body">
        <Link href="/dashboard" className="form-page-back">
          ← Back to Dashboard
        </Link>

        <h1 className="form-page-h1">Create Hiring Drive</h1>
        <p className="form-page-sub">
          A hiring drive lets you manage all candidates for a specific role in
          one place.
        </p>

        <div className="form-card">
          {error && <div className="alert alert-error">{error}</div>}

          <form
            onSubmit={handleCreate}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div className="field">
              <label className="field-label" htmlFor="drive-role">
                Role / Position *
              </label>
              <input
                id="drive-role"
                type="text"
                className="input"
                placeholder="e.g. Senior Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={loading}
              />
              <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>
                This is the job title candidates will be interviewed for.
              </p>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="drive-description">
                Description{" "}
                <span style={{ fontWeight: 400, color: "var(--text-2)" }}>
                  (optional)
                </span>
              </label>
              <textarea
                id="drive-description"
                className="input"
                placeholder="Describe the role, requirements, or any notes for the AI interviewer…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/dashboard" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !role.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Creating…
                  </>
                ) : (
                  "Create Drive →"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
