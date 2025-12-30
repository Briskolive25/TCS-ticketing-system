import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("userRole");

  return (
    <aside style={sidebarStyle}>
      {/* BRAND */}
      <div style={brandBox}>
        <div style={logoCircle}>BO</div>
        <div>
          <div style={brandTitle}>Brisk Olive</div>
          <div style={brandSub}>Ticketing System</div>
        </div>
      </div>

      {/* MENU */}
      <nav>
        <ul style={menuStyle}>
          {role !== "Admin" && (
            <>
              <MenuItem to="/dashboard" label="Dashboard" />
              <MenuItem to="/operations" label="Operations Team" />
            </>
          )}
          {role === "Admin" && (
            <>
              <MenuItem to="/operations" label="Operations Team" />
              <MenuItem to="/admin-dashboard" label="Admin Dashboard" />
            </>
          )}
        </ul>
      </nav>

      {/* FOOTER */}
      <div style={footerStyle}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>© 2025 Brisk Olive</span>
      </div>
    </aside>
  );
};

const MenuItem = ({ to, label }) => (
  <li style={{ marginBottom: 6 }}>
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 10,
        color: isActive ? "#1a5cff" : "#cbd5e1",
        textDecoration: "none",
        background: isActive ? "rgba(26,92,255,0.15)" : "transparent",
        fontWeight: isActive ? 600 : 500,
        transition: "all .25s ease"
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.style.background.includes("rgba"))
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.className.includes("active"))
          e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={dotIcon} />
      {label}
    </NavLink>
  </li>
);

/* STYLES */

const sidebarStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  width: 240,
  height: "100vh",
  background: "linear-gradient(180deg,#0f172a,#1e293b)",
  color: "#fff",
  padding: "22px 18px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "4px 0 18px rgba(0,0,0,0.25)",
  zIndex: 1000
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 35
};

const logoCircle = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#1a5cff,#60a5fa)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 16
};

const brandTitle = {
  fontSize: 16,
  fontWeight: 600
};

const brandSub = {
  fontSize: 12,
  color: "#94a3b8"
};

const menuStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const dotIcon = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#1a5cff"
};

const footerStyle = {
  paddingTop: 20,
  borderTop: "1px solid rgba(255,255,255,0.08)",
  textAlign: "center"
};

export default Sidebar;
