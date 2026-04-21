"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="brand"
        >
          HireMintora
        </Link>

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
