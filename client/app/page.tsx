import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Interviews",
    desc: "Real-time conversational AI that adapts to candidate responses for accurate, bias-free first-round screening.",
  },
  {
    icon: "📋",
    title: "Organized Hiring Drives",
    desc: "Create targeted recruitment campaigns per role and track every candidate through the full pipeline.",
  },
  {
    icon: "🔗",
    title: "One-Click Invitations",
    desc: "Generate unique access tokens and dispatch personalized interview links to all candidates instantly.",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    desc: "Invite teammates with unique org codes. Manage access with owner and member role permissions.",
  },
  {
    icon: "🔒",
    title: "Secure Isolated Sessions",
    desc: "Each candidate gets a cryptographically unique token ensuring a private, tamper-proof interview session.",
  },
  {
    icon: "⚡",
    title: "Real-Time Streaming",
    desc: "WebSocket-based architecture delivers instant AI response streaming for a seamless live interview experience.",
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="brand">HireMintora</span>
          <div className="landing-nav-links">
            <Link href="/auth/login" className="btn btn-outline btn-sm">
              Log In
            </Link>
            <Link href="/auth/signup" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-pill">✨ AI-Powered Recruitment Platform</div>
        <h1 className="hero-h1">
          Hire Smarter with
          <br />
          <span className="hero-h1-accent">AI-Powered Interviews</span>
        </h1>
        <p className="hero-sub">
          Automate your recruitment end-to-end — from creating hiring drives and
          importing candidates to running AI interviews and tracking results.
        </p>
        <div className="hero-ctas">
          <Link href="/auth/signup" className="btn btn-primary btn-lg">
            Start Hiring Free →
          </Link>
          <Link href="/auth/login" className="btn btn-outline btn-lg">
            Sign In
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-n">10x</span>
            <span className="hero-stat-l">Faster Screening</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-n">100%</span>
            <span className="hero-stat-l">Automated Interviews</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-n">∞</span>
            <span className="hero-stat-l">Unlimited Candidates</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-head">
            <h2 className="section-h2">Everything You Need to Hire at Scale</h2>
            <p className="section-p">
              One platform replacing first-round interviews, candidate tracking,
              and cross-team coordination overhead.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2 className="cta-h2">Ready to Transform Your Hiring?</h2>
          <p className="cta-p">
            Join teams already saving hundreds of interviewer hours every month.
          </p>
          <Link href="/auth/signup" className="btn btn-primary btn-lg">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="brand" style={{ fontSize: 20 }}>
          HireMintora
        </span>
        <p className="footer-copy">© 2024 HireMintora. All rights reserved.</p>
      </footer>
    </div>
  );
}
