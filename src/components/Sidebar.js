import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isScoringPage = location.pathname.startsWith("/scoring");
  
  return (
    <aside style={sidebarStyle}>
      {/* BLUE TOP HEADER WITH BRAND */}
      <div style={blueHeaderSection}>
        <div style={brandBoxInHeader}>
          <div style={logoCircle}>BO</div>
          <div>
            <div style={brandTitleWhite}>Brisk Olive</div>
            <div style={brandSubWhite}>KPIs and Targets</div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav>
        <ul style={menuStyle}>

{/* SHOW ONLY ON SCORING PAGE */}
{isScoringPage && (
  <>
    <MenuItem to="/scoring/kpi" label="KPI" />
    <MenuItem to="/scoring/targets" label="Targets" />
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
        color: isActive ? "#ffffff" : "#334155",
        textDecoration: "none",
        background: isActive ? "#186FCB" : "transparent",
        fontWeight: isActive ? 600 : 500,
        transition: "all .25s ease"
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.className.includes("active"))
          e.currentTarget.style.background = "rgba(26,92,255,0.08)";
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
  background: "#ffffff",          // ✅ WHITE SIDEBAR
  color: "#0f172a",
  padding: "0px 0px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",   // menu starts from top
  boxShadow: "4px 0 18px rgba(0,0,0,0.08)",
  zIndex: 1000
};

const blueHeaderSection = {
  width: "100%",
  height: "140px",                // Increased blue section height
  background: "#186FCB",
  marginBottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "0px 18px",
  boxSizing: "border-box"
};

const brandBoxInHeader = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  color: "#ffffff"
};

const brandBox = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 35,
  padding: "12px 14px",
  margin: "18px 18px 35px 18px",
  background: "#ffffff",          // WHITE BACKGROUND (removed blue)
  borderRadius: 12,
  color: "#0f172a"
};


const logoCircle = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: "#186FCB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 16,
  color: "#ffffff"
};

const brandTitle = {
  fontSize: 16,
  fontWeight: 600,
  color: "#0f172a"
};

const brandSub = {
  fontSize: 12,
  color: "#64748b"
};

const brandTitleWhite = {
  fontSize: 16,
  fontWeight: 600,
  color: "#ffffff"
};

const brandSubWhite = {
  fontSize: 12,
  color: "#e0e7ff"
};



const menuStyle = {
  listStyle: "none",
  padding: "18px 18px",
  margin: 0,
  marginTop: "20px"
};

const dotIcon = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#186FCB"
};


const footerStyle = {
  marginTop: "auto",   // 🔥 PUSHES FOOTER TO BOTTOM
  paddingTop: 20,
  paddingLeft: 18,
  paddingRight: 18,
  borderTop: "1px solid rgba(0,0,0,0.08)",
  textAlign: "center"
};

export default Sidebar;
