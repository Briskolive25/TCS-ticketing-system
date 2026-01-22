import React, { useState } from "react";

export default function ManpowerLogin() {
  const [isCoordinator, setIsCoordinator] = useState(false);

  return (
    <div style={container}>
      {/* LEFT SECTION */}
      <div style={leftSection}>
        <div style={overlay}>
          <h1 style={brand}>Brisk Olive</h1>
          <p style={tagline}>
            All Department Dashboard for Streamlined Workflow Management
          </p>

          <ul style={featureList}>
            <li style={featureItem}>
              <span style={bullet}></span>
              <div>
                <span style={featureTitle}>Unified Dashboard</span>
                <div style={featureDesc}>
                  Access all departments from a single, centralized platform
                </div>
              </div>
            </li>
            <li style={featureItem}>
              <span style={bullet}></span>
              <div>
                <span style={featureTitle}>Streamlined Operations</span>
                <div style={featureDesc}>
                  Optimize workflows across all teams and departments
                </div>
              </div>
            </li>
            <li style={featureItem}>
              <span style={bullet}></span>
              <div>
                <span style={featureTitle}>Real-Time Collaboration</span>
                <div style={featureDesc}>
                  Connect departments and enhance cross-functional teamwork
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={rightSection}>
        <div style={loginCard}>
          <h2 style={welcome}>Welcome back</h2>
          <p style={subtitle}>Please enter your credentials to continue</p>

          {/* Email or MobileNumber */}
          <label style={label}>
            {isCoordinator ? "Mobile Number" : "Email Address"}
          </label>
          <input
            type={isCoordinator ? "text" : "email"}
            placeholder={isCoordinator ? "Enter your Mobile number" : "you@example.com"}
            style={input}
          />

          {/* Password */}
          <div style={passwordHeader}>
            <label style={label}>Password</label>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            style={input}
          />

          {/* Remember Me */}
          <div style={remember}>
            <input type="checkbox" />
            <span>Remember me</span>
          </div>

          <button style={loginBtn}>Login</button>

          <div style={divider}></div>

          {/* Coordinator Login Toggle */}
          {!isCoordinator ? (
            <>
              <p style={coordinatorText}>Are you a coordinator?</p>
              <a
                href="#"
                style={coordinatorLink}
                onClick={(e) => {
                  e.preventDefault();
                  setIsCoordinator(true);
                }}
              >
                Coordinator Login →
              </a>
            </>
          ) : (
            <a
              href="#"
              style={coordinatorLink}
              onClick={(e) => {
                e.preventDefault();
                setIsCoordinator(false);
              }}
            >
              ← Back to Brisk Olive Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  height: "100vh",
  fontFamily: "Inter, sans-serif",
};

/* LEFT */
const leftSection = {
  flex: 1,
  backgroundImage:
    "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay = {
  height: "100%",
  background: "rgba(85, 107, 47, 0.75)",
  color: "#fff",
  padding: "80px 70px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const brand = {
  fontSize: 48,
  fontWeight: 900,
  marginBottom: 20,
  lineHeight: 1.1,
  letterSpacing: 1,
};

const tagline = {
  fontSize: 20,
  fontWeight: 500,
  maxWidth: 500,
  marginBottom: 50,
  lineHeight: 1.5,
  color: "#f1f5f9",
};

const featureList = {
  listStyle: "none",
  padding: 0,
  maxWidth: 520,
};

const featureItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 24,
};

const bullet = {
  width: 12,
  height: 12,
  backgroundColor: "#556b2f",
  borderRadius: "50%",
  display: "inline-block",
  marginTop: 6,
};

const featureTitle = {
  fontWeight: 700,
  fontSize: 18,
  color: "#ffffff",
  marginBottom: 4,
};

const featureDesc = {
  fontSize: 15,
  color: "rgba(255,255,255,0.85)",
  lineHeight: 1.6,
};

/* RIGHT */
const rightSection = {
  flex: 1,
  background: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loginCard = {
  width: 500,
  background: "#fff",
  borderRadius: 16,
  padding: 36,
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const welcome = {
  fontSize: 28,
  fontWeight: 700,
};

const subtitle = {
  color: "#475569",
  marginBottom: 20,
};

const label = {
  fontSize: 14,
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  marginTop: 6,
  marginBottom: 16,
  fontSize: 14,
};

const passwordHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const remember = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  marginBottom: 20,
};

const loginBtn = {
  width: "100%",
  padding: 14,
  background: "#556b2f",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const divider = {
  height: 1,
  background: "#e5e7eb",
  margin: "24px 0",
};

const coordinatorText = {
  textAlign: "center",
  color: "#64748b",
};

const coordinatorLink = {
  display: "block",
  textAlign: "center",
  color: "#556b2f",
  fontWeight: 600,
  marginTop: 6,
  cursor: "pointer",
};
