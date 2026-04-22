"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { apiGetOrg } from "@/lib/api";

export default function DashboardOverviewPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [org, setOrg] = useState<any>(null);
  const [fetchingOrg, setFetchingOrg] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
    if (!isLoading && isAuthenticated && !user?.organisationId) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Fetch organisation details
  useEffect(() => {
    async function loadOrg() {
      if (isAuthenticated && user?.organisationId) {
        setFetchingOrg(true);
        try {
          const res = await apiGetOrg();
          setOrg(res.organisation);
        } catch (err) {
          console.error("Failed to fetch org:", err);
        } finally {
          setFetchingOrg(false);
        }
      }
    }
    loadOrg();
  }, [isAuthenticated, user?.organisationId]);

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
            <h1 className="dash-title">Dashboard Overview</h1>
            <p className="dash-sub">Welcome back, {user?.fullName}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="dash-body">
        <div className="dash-body-inner" style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            
            {/* Organisation Card */}
            <div className="card" style={{ 
              background: "white", 
              border: "1.5px solid var(--border)", 
              borderRadius: "var(--r-lg)",
              padding: "32px",
              boxShadow: "var(--sh-sm)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)" }}>Organisation Details</h2>
                <div style={{ 
                  background: "var(--mint-xs)", 
                  color: "var(--mint-dark)", 
                  fontSize: "12px", 
                  fontWeight: 700, 
                  padding: "4px 10px", 
                  borderRadius: "var(--r-full)",
                  border: "1px solid var(--mint-light)"
                }}>
                  {user?.organisationRole || "MEMBER"}
                </div>
              </div>

              {fetchingOrg ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-2)" }}>
                  <span className="spinner" /> Loading details...
                </div>
              ) : org ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</label>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)" }}>{org.name}</div>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Invite Code</label>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      marginTop: "4px",
                      background: "var(--bg)",
                      padding: "10px 14px",
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--border)",
                      fontFamily: "monospace",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--mint-dark)"
                    }}>
                      {org.orgCode}
                      <button 
                        onClick={() => navigator.clipboard.writeText(org.orgCode)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--text-2)" }}
                        title="Copy Code"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                    <div style={{ fontSize: "15px", color: "var(--text)" }}>{org.category || "N/A"}</div>
                  </div>

                  {org.description && (
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
                      <div style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.6 }}>{org.description}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: "var(--error)" }}>Failed to load organisation data.</div>
              )}
            </div>

            {/* Stats Card */}
            <div className="card" style={{ 
              background: "white", 
              border: "1.5px solid var(--border)", 
              borderRadius: "var(--r-lg)",
              padding: "32px",
              boxShadow: "var(--sh-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)", marginBottom: "24px" }}>Quick Stats</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ background: "var(--bg)", padding: "20px", borderRadius: "var(--r-md)", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--mint-dark)" }}>{org?._count?.drives || 0}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 600 }}>Active Drives</div>
                  </div>
                  <div style={{ background: "var(--bg)", padding: "20px", borderRadius: "var(--r-md)", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text)" }}>-</div>
                    <div style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 600 }}>Total Candidates</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "32px" }}>
                <Link href="/dashboard/drives" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                  View All Drives →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
