"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { getStoredDrives, StoredDrive } from "@/lib/drives";

export default function DrivesPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [drives, setDrives] = useState<StoredDrive[]>([]);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
    if (!isLoading && isAuthenticated && !user?.organisationId) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Load drives from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      setDrives(getStoredDrives());
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="page-loading">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="dash-page">
      <Navbar />

      {/* Header */}
      <div className="dash-header">
        <div className="dash-header-inner">
          <div>
            <h1 className="dash-title">Hiring Drives</h1>
            <p className="dash-sub">
              {drives.length > 0
                ? `${drives.length} drive${drives.length !== 1 ? "s" : ""} in your organisation`
                : "Create your first hiring drive to get started"}
            </p>
          </div>
          <Link href="/dashboard/drive/new" className="btn btn-primary">
            + New Drive
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="dash-body">
        {drives.length === 0 ? (
          <div className="drive-empty">
            <div className="drive-empty-icon">🚀</div>
            <h2 className="drive-empty-h2">No hiring drives yet</h2>
            <p className="drive-empty-p">
              Create a hiring drive for a specific role to start importing
              candidates and running AI interviews.
            </p>
            <Link href="/dashboard/drive/new" className="btn btn-primary btn-lg">
              Create Your First Drive →
            </Link>
          </div>
        ) : (
          <div className="drives-grid">
            {drives.map((drive) => (
              <Link
                key={drive.id}
                href={`/dashboard/drive/${drive.id}`}
                className="drive-card"
              >
                <div className="drive-card-role">{drive.role}</div>
                <div className="drive-card-desc">
                  {drive.description || "No description provided."}
                </div>
                <div className="drive-card-meta">
                  <span className="drive-card-date">
                    {new Date(drive.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="drive-card-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
