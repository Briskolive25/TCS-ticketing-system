import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <h2 style={titleStyle}>TCS Ticketing System</h2>

      <ul style={menuStyle}>
        <MenuItem to="/dashboard" label="Dashboard" />
        <MenuItem to="/operations" label="Brisk Olive Operations Team" />
        <MenuItem to="/admin-dashboard" label="Admin Dashboard" /> {/* ✅ NEW */}
      </ul>
    </div>
  );
};

const MenuItem = ({ to, label }) => (
  <li style={{ marginBottom: 8 }}>
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 15px",
        borderRadius: 6,
        color: "#fff",
        textDecoration: "none",
        background: isActive ? "#1a5cff" : "transparent",
        fontWeight: isActive ? "600" : "400"
      })}
    >
      {label}
    </NavLink>
  </li>
);

const sidebarStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  width: 220,
  height: "100vh",
  background: "#243447",
  color: "#fff",
  padding: 20,
  boxSizing: "border-box",
  overflowY: "auto",
  overflowX: "hidden",
  zIndex: 1000
};

const titleStyle = {
  marginBottom: 30,
  fontSize: 18,
  fontWeight: 600
};

const menuStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

export default Sidebar;
