"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiOrgSetup, ApiError } from "@/lib/api";

type Action = "CREATE" | "JOIN" | null;

const ORG_CATEGORIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Media & Entertainment",
  "Consulting",
  "Other",
];

export default function OnboardingPage() {
  const { isAuthenticated, isLoading, user, updateUser } = useAuth();
  const router = useRouter();

  const [action, setAction] = useState<Action>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login");
    if (!isLoading && isAuthenticated && user?.organisationId) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action) return;
    setError(null);
    setLoading(true);

    try {
      const body =
        action === "CREATE"
          ? { action, name: name.trim(), description: description.trim(), category }
          : { action, orgCode: orgCode.trim() };

      const res = await apiOrgSetup(body);

      // Update user in context with new organisationId
      if (user) {
        updateUser({
          ...user,
          organisationId: res.organisation.id,
          organisationRole: res.role,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) setError(err.messages.join(" "));
      else setError("Something went wrong. Please try again.");
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
    <div className="onboarding-page">
      <div className="onboarding-box">
        <span className="onboarding-brand">HireMintora</span>

        <h1 className="onboarding-h1">Set up your Organisation</h1>
        <p className="onboarding-sub">
          Create a new organisation or join an existing one to start managing
          hiring drives.
        </p>

        {/* Option cards */}
        <div className="onboarding-options">
          <button
            className={`onboarding-opt${action === "CREATE" ? " selected" : ""}`}
            onClick={() => {
              setAction("CREATE");
              setError(null);
            }}
            type="button"
          >
            <div className="onboarding-opt-icon">🏢</div>
            <div className="onboarding-opt-title">Create Organisation</div>
            <div className="onboarding-opt-desc">
              Start fresh. You&apos;ll be the owner and can invite teammates.
            </div>
          </button>

          <button
            className={`onboarding-opt${action === "JOIN" ? " selected" : ""}`}
            onClick={() => {
              setAction("JOIN");
              setError(null);
            }}
            type="button"
          >
            <div className="onboarding-opt-icon">🤝</div>
            <div className="onboarding-opt-title">Join Organisation</div>
            <div className="onboarding-opt-desc">
              Have an invite code? Join your team as a member.
            </div>
          </button>
        </div>

        {/* Form */}
        {action && (
          <form className="onboarding-form" onSubmit={handleSubmit}>
            <div className="onboarding-form-title">
              {action === "CREATE"
                ? "Organisation details"
                : "Enter your invite code"}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {action === "CREATE" ? (
              <>
                <div className="field">
                  <label className="field-label" htmlFor="org-name">
                    Organisation name *
                  </label>
                  <input
                    id="org-name"
                    type="text"
                    className="input"
                    placeholder="Acme Corp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="org-category">
                    Industry *
                  </label>
                  <select
                    id="org-category"
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">Select industry…</option>
                    {ORG_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="org-description">
                    Description{" "}
                    <span style={{ fontWeight: 400, color: "var(--text-2)" }}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="org-description"
                    className="input"
                    placeholder="A brief description of your organisation…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div className="field">
                <label className="field-label" htmlFor="org-code">
                  Org code *
                </label>
                <input
                  id="org-code"
                  type="text"
                  className="input"
                  placeholder="e.g. 4!ABCDEF"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                  required
                  disabled={loading}
                  style={{ fontFamily: "monospace", letterSpacing: 2 }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-2)",
                    marginTop: 4,
                  }}
                >
                  Ask your organisation owner for this code.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  {action === "CREATE"
                    ? "Creating…"
                    : "Joining…"}
                </>
              ) : action === "CREATE" ? (
                "Create Organisation →"
              ) : (
                "Join Organisation →"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
