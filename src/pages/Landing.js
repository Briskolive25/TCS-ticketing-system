import React, { useState } from "react";
import logo from "../components/logo.png";
import {
  LayoutDashboard,
  Bell,
  Settings,
  TrendingUp,
  Users,
  UserPlus,
  Briefcase,
  Target,
  ClipboardList,
  DollarSign,
  LineChart,
  Code2,
  Wrench,
  Building2,
  BadgeCheck,
  LogOut,
} from "lucide-react";

export default function Landing() {
  const [activeModule, setActiveModule] = useState("");
  const [showUser, setShowUser] = useState(false);

  const user = {
    name: "Tanisha Sharma",
    email: "dataanalytics.manager@briskolive.com",
    department: "DAA",
    role: "Data Analyst",
  };

  const modules = [
    { name: "Sales", icon: TrendingUp, color: "#3b82f6", desc: "Manage sales pipeline" },
    { name: "HR", icon: Users, color: "#a855f7", desc: "Human resources" },
    { name: "Members", icon: UserPlus, color: "#22c55e", desc: "Team members" },
    { name: "Temp Staffing", icon: Briefcase, color: "#f97316", desc: "Temporary staff" },
    { name: "Recruitment", icon: Target, color: "#ec4899", desc: "Hiring process" },
    { name: "Projects", icon: ClipboardList, color: "#6366f1", desc: "Project tracking" },
    { name: "Admin", icon: Settings, color: "#64748b", desc: "Admin controls" },
    { name: "Accounts", icon: DollarSign, color: "#059669", desc: "Finance & billing" },
    { name: "DAA", icon: LineChart, color: "#06b6d4", desc: "Market analytics" },
    { name: "Engineering", icon: Code2, color: "#8b5cf6", desc: "Development" },
    { name: "Operations", icon: Wrench, color: "#ef4444", desc: "Operations flow" },
  ];

  return (
    <div style={container}>
      {/* ================= TOP BAR ================= */}
      <header style={topbar}>
        <div style={brand}>
          <img src={logo} alt="Brisk Olive" style={logoStyle} />
          <span style={companyName}>Brisk Olive</span>
        </div>

        {/* NAVBAR */}
        <nav style={topNav}>
          <span
            style={{
              ...topNavItem,
              borderBottomColor: !activeModule ? "#22c55e" : "transparent",
            }}
            onClick={() => setActiveModule("")}
          >
            Home
          </span>

          {modules.map((m) => (
            <span
              key={m.name}
              style={{
                ...topNavItem,
                borderBottomColor:
                  activeModule === m.name ? "#22c55e" : "transparent",
              }}
              onClick={() => setActiveModule(m.name)}
            >
              {m.name}
            </span>
          ))}
        </nav>

        {/* USER */}
        <div style={userArea}>
          <div style={userNameBox} onClick={() => setShowUser(!showUser)}>
            {user.name} ▼
          </div>

          {showUser && (
            <div style={userDropdown}>
              <strong>{user.name}</strong>
              <div style={email}>{user.email}</div>

              <div style={divider} />

              <div style={dropdownItem}>
                <Building2 size={14} /> {user.department}
              </div>
              <div style={dropdownItem}>
                <BadgeCheck size={14} /> {user.role}
              </div>

              <div style={divider} />
              <div style={logoutItem}>
                <LogOut size={14} /> Logout
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div style={body}>
        {/* SIDEBAR */}
        <aside style={sidebar}>
          <p style={menuTitle}>
            {activeModule ? `${activeModule.toUpperCase()} MENU` : "MAIN MENU"}
          </p>

          {!activeModule ? (
            <>
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
              <SidebarItem icon={Bell} label="Notifications" />
              <SidebarItem icon={Settings} label="Settings" />
            </>
          ) : (
            <SidebarItem icon={Settings} label="Will update soon" active />
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main style={main}>
          {!activeModule ? (
            <>
              <h1 style={heading}>Welcome to Brisk Olive</h1>
              <p style={subText}>
                Select a module from the top navigation or below.
              </p>

              <div style={grid}>
                {modules.map(({ name, icon: Icon, color, desc }) => (
                  <div
                    key={name}
                    style={card}
                    onClick={() => setActiveModule(name)}
                  >
                    <div style={{ ...iconBox, background: color }}>
                      <Icon color="#fff" />
                    </div>
                    <h3>{name}</h3>
                    <p style={cardDesc}>{desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={dashboardCenter}>
              {activeModule} Dashboard
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */
const SidebarItem = ({ icon: Icon, label, active }) => (
  <div
    style={{
      ...sidebarItem,
      background: active ? "#059669" : "transparent",
      color: active ? "#fff" : "#e5e7eb",
    }}
  >
    <Icon size={16} /> {label}
  </div>
);

/* ================= STYLES ================= */

const container = { 
  height: "100vh", 
  display: "flex", 
  flexDirection: "column",
  overflowY: "scroll",   // ✅ ADD THIS LINE
};

const topbar = {
  height: 80,
  background: "#1f2937",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 32px",
};

const brand = { display: "flex", alignItems: "center", gap: 12 };
const logoStyle = { height: 34 };
const companyName = { fontSize: 20, fontWeight: 700 };

const topNav = {
  display: "flex",
  gap: 16,
  marginLeft: 20,
  flex: 1,
};

/* 🔑 FIXED: border space always reserved */
const topNavItem = {
  cursor: "pointer",
  fontSize: 14,
  padding: "6px 4px",
  fontWeight: 500,
  borderBottom: "3px solid transparent",
};

const userArea = { position: "relative" };
const userNameBox = { cursor: "pointer", fontWeight: 600 };

const userDropdown = {
  position: "absolute",
  right: 0,
  top: 50,
  background: "#fff",
  color: "#111827",
  width: 240,
  borderRadius: 6,
  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  padding: 12,
};

const email = { fontSize: 12, color: "#6b7280" };
const divider = { height: 1, background: "#e5e7eb", margin: "10px 0" };
const dropdownItem = { display: "flex", gap: 8, fontSize: 13 };
const logoutItem = { display: "flex", gap: 8, color: "#dc2626", cursor: "pointer" };

const body = { display: "flex", flex: 1 };
const sidebar = { width: 240, background: "#111827", color: "#fff", padding: 16 };
const menuTitle = { fontSize: 12, color: "#9ca3af", marginBottom: 12 };

const sidebarItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 6,
  cursor: "pointer",
  marginBottom: 6,
};

const main = { flex: 1, background: "#f8fafc", padding: 30 };
const heading = { fontSize: 28, fontWeight: 700, marginBottom: 10 };
const subText = { color: "#6b7280", marginBottom: 30 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
  gap: 20,
}; 

const card = {
  background: "#fff",
  borderRadius: 10,
  padding: 20,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const iconBox = {
  width: 42,
  height: 42,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
};

const cardDesc = { fontSize: 13, color: "#6b7280" };

const dashboardCenter = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 36,
  fontWeight: 700,
};
