"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="brand"
          >
            HireMintora
          </Link>

          {isAuthenticated && (
            <div className="navbar-links" style={{ display: "flex", gap: "24px" }}>
              <Link
                href="/dashboard"
                className={`navbar-link ${isLinkActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/drives"
                className={`navbar-link ${isLinkActive("/dashboard/drives") ? "active" : ""}`}
              >
                Drives
              </Link>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                {user?.fullName?.split(" ")[0] ?? user?.email}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
