// TopNavbar.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const titles = {
  "/dashboard": "Dashboard",
  "/operations": "Operations Team",
  "/admin-dashboard": "Admin Dashboard",
  "/support": "Support"
};

const TopNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();   // ✅ ADD
  const role = localStorage.getItem("userRole");

  // Example download function
  const handleDownloadTickets = () => {
    // Replace this with your actual download logic
    alert("Downloading tickets...");
  };
  const handleLogout = () => {
  localStorage.clear();      // ✅ clear session
  navigate("/login");        // ✅ redirect
};

  return (
    <header style={navbarStyle}>
      {/* Left: Page Title */}
      <h2 style={titleStyle}>
        {pathname === "/operations" && role === "TCS"
          ? "TCS Team"
          : titles[pathname] || "Brisk Olive"}
      </h2>

      {/* Right: Download Tickets Button */}
      {/* Right: Actions */}
<div style={{ display: "flex", gap: 12 }}>
  <button style={buttonStyle} onClick={handleDownloadTickets}>
    Download Tickets
  </button>

  <button
    style={{
      ...buttonStyle,
      backgroundColor: "#dc3545",
      color: "#ffffff",
    }}
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

    </header>
  );
};

/* ===== STYLES ===== */
const navbarHeight = 64;  // navbar height
const sidebarWidth = 240; // sidebar width

const navbarStyle = {
  height: navbarHeight,
  backgroundColor: "#1a5cff", // 🔵 Blue navbar
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // important to push button right
  padding: "0 24px",
  position: "fixed",
  top: 0,
  left: sidebarWidth, // starts after sidebar
  right: 0,
  zIndex: 900,
  boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
};

const titleStyle = {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 600,
};

const buttonStyle = {
  backgroundColor: "#ffffff",
  color: "#1a5cff",
  border: "none",
  borderRadius: 4,
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.3s",
};

export const navbarDimensions = {
  navbarHeight,
  sidebarWidth
};

export default TopNavbar;
