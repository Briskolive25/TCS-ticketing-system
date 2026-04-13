import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("userRole");
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const isScoringPage = path.startsWith("/scoring");
  const isAddKpiPage = path.includes("/scoring/kpi");
  const sidebarBg = "#ffffff";
  const sidebarTextColor = "#0f172a";
  const themeColor = "#1a5cff";
  const menuTextColor = "#334155";
  const menuActiveBg = "#1a5cff";
  const menuHoverBg = "rgba(26,92,255,0.08)";
  const dotColor = "#1a5cff";
  const brandBg = "#1a5cff";
  const brandSubColor = "#e0e7ff";

  return (
    <aside style={{ ...sidebarStyle, background: sidebarBg, color: sidebarTextColor }}>
      {/* BRAND */}
      <div style={{ ...brandBox, background: brandBg }}>
        <div style={logoCircle}>BO</div>
        <div>
          <div style={{ ...brandTitle, color: "#ffffff" }}>Brisk Olive</div>
          <div style={{ ...brandSub, color: brandSubColor }}>Scoring System</div>
        </div>
      </div>

      {/* MENU */}
      <nav>
        <ul style={menuStyle}>
          <MenuItem
            to="/scoring/kpi"
            label="KPI"
            theme={{ menuTextColor, menuActiveBg, menuHoverBg, dotColor }}
          />
          <MenuItem
            to="/scoring/targets"
            label="Targets"
            theme={{ menuTextColor, menuActiveBg, menuHoverBg, dotColor }}
          />
        </ul>
      </nav>

      {/* FOOTER */}
      <div style={footerStyle}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>© 2025 Brisk Olive</span>
      </div>
    </aside>
  );
};

const MenuItem = ({ to, label, theme }) => (
  <li style={{ marginBottom: 6 }}>
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 10,
        color: isActive ? "#ffffff" : theme.menuTextColor,
        textDecoration: "none",
        background: isActive ? theme.menuActiveBg : "transparent",
        fontWeight: isActive ? 600 : 500,
        transition: "all .25s ease"
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.className.includes("active"))
          e.currentTarget.style.background = theme.menuHoverBg;
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.className.includes("active"))
          e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ ...dotIcon, background: theme.dotColor }} />
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
  background: "#ffffff",          // ✅ WHITE SIDEBAR
  color: "#0f172a",
  padding: "22px 18px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",   // menu starts from top
  boxShadow: "4px 0 18px rgba(0,0,0,0.08)",
  zIndex: 1000
};


const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 35,
  padding: "12px 14px",
  background: "#1a5cff",      // 🔵 BLUE HEADER
  borderRadius: 12,
  color: "#ffffff"
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
  fontWeight: 600,
  color: "#ffffff"
};

const brandSub = {
  fontSize: 12,
  color: "#e0e7ff"
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
  marginTop: "auto",   // 🔥 PUSHES FOOTER TO BOTTOM
  paddingTop: 20,
  borderTop: "1px solid rgba(0,0,0,0.08)",
  textAlign: "center"
};

export default Sidebar;







