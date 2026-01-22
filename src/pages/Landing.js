import React from "react";
import logo from "../components/logo.png";
import {
  User,
  Mail,
  Building2,
  BadgeCheck,
  LogOut,
  TrendingUp,
  Users,
  UserPlus,
  Briefcase,
  Target,
  ClipboardList,
  Settings,
  DollarSign,
  LineChart,
  Code2,
  Wrench,
} from "lucide-react";

export default function Landing() {
  const user = {
    name: "Tanisha Sharma",
    email: "dataanalytics.manager@briskolive.com",
    department: "DAA",
    role: "Data Analyst",
  };

  const departments = [
    { name: "Sales", icon: TrendingUp, color: "#2563eb" },
    { name: "HR", icon: Users, color: "#9333ea" },
    { name: "Members", icon: UserPlus, color: "#16a34a" },
    { name: "Temp Staffing", icon: Briefcase, color: "#f97316" },
    { name: "Recruitment", icon: Target, color: "#ec4899" },
    { name: "Projects", icon: ClipboardList, color: "#6366f1" },
    { name: "Admin", icon: Settings, color: "#64748b" },
    { name: "Accounts", icon: DollarSign, color: "#059669" },
    { name: "DAA", icon: LineChart, color: "#0ea5e9" },
    { name: "Engineering", icon: Code2, color: "#8b5cf6" },
    { name: "Operations", icon: Wrench, color: "#ef4444" },
  ];

  return (
    <div style={container}>
      {/* ================= NAVBAR ================= */}
      <header style={topbar}>
        <div style={brand}>
          <img src={logo} alt="Brisk Olive" style={logoStyle} />
          <span style={companyName}>Brisk Olive</span>

          {/* Divider line */}
          <span style={brandDivider}></span>
        </div>

        <nav style={nav}>
          {departments.map((d) => (
            <span key={d.name} style={navItem}>
              {d.name}
            </span>
          ))}
        </nav>

        <button style={logoutBtn}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* ================= BODY ================= */}
      <div style={body}>
        {/* ================= SIDEBAR ================= */}
        <aside style={sidebar}>
          <h3 style={sidebarTitle}>User Details</h3>
          <div style={divider}></div>

          <div style={infoBlock}>
            <User size={16} style={infoIcon} />
            <div>
              <div style={label}>NAME</div>
              <div style={value}>{user.name}</div>
            </div>
          </div>

          <div style={infoBlock}>
            <Mail size={16} style={infoIcon} />
            <div>
              <div style={label}>EMAIL</div>
              <div style={value}>{user.email}</div>
            </div>
          </div>

          <div style={infoBlock}>
            <Building2 size={16} style={infoIcon} />
            <div>
              <div style={label}>DEPARTMENT</div>
              <div style={value}>{user.department}</div>
            </div>
          </div>

          <div style={infoBlock}>
            <BadgeCheck size={16} style={infoIcon} />
            <div>
              <div style={label}>DESIGNATION</div>
              <div style={value}>{user.role}</div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main style={main}>
          <section style={content}>
            <h1 style={heading}>Welcome to Brisk Olive</h1>
            <p style={subText}>
              Select a module from the top navigation or choose from the options
              below to continue.
            </p>

            <div style={grid}>
              {departments.map(({ name, icon: Icon, color }) => (
                <div key={name} style={card}>
                  <div style={{ ...iconBox, background: color }}>
                    <Icon size={22} color="#fff" />
                  </div>
                  <h3 style={cardTitle}>{name}</h3>
                  <p style={cardDesc}>
                    Manage {name.toLowerCase()} operations
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "#f8fafc",
};

/* ---------- NAVBAR ---------- */
const topbar = {
  height: 100,                 // ⬅ increased height (was 78)
  background: "#1f2a44",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "12px",
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const logoStyle = {
  height: 36,
};

const companyName = {
  fontSize: 24,
  fontWeight: 800,
};

const brandDivider = {
  width: 1,
  height: 28,
  background: "rgba(255,255,255,0.4)",
  marginLeft: 12,
};

const nav = {
  display: "flex",
  gap: 22,
  flex: 1,
  marginLeft: 40,
};

const navItem = {
  fontSize: 14,
  cursor: "pointer",
  opacity: 0.95,
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
  display: "flex",
  gap: 6,
  alignItems: "center",
};

/* ---------- BODY ---------- */
const body = {
  display: "flex",
  flex: 1,
};

/* ---------- SIDEBAR ---------- */
const sidebar = {
  width: 300,
  background: "#1f2a44",
  color: "#fff",
  padding: "22px 20px",
};

const sidebarTitle = {
  fontSize: 15,
  fontWeight: 700,
};

const divider = {
  height: 1,
  background: "rgba(255,255,255,0.25)",
  margin: "14px 0 22px",
};

const infoBlock = {
  display: "flex",
  gap: 12,
  marginBottom: 18,
};

const infoIcon = {
  color: "#22c55e",
  marginTop: 3,
};

const label = {
  fontSize: 11,
  color: "#9ca3af",
};

const value = {
  fontSize: 14,
  fontWeight: 600,
  marginTop: 2,
};

/* ---------- MAIN ---------- */
const main = {
  flex: 1,
  overflowY: "auto",
};

const content = {
  padding: 32,
};

const heading = {
  fontSize: 28,
  fontWeight: 700,
};

const subText = {
  color: "#64748b",
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  borderRadius: 12,
  padding: 20,
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

const cardTitle = {
  fontSize: 16,
  fontWeight: 600,
};

const cardDesc = {
  fontSize: 13,
  color: "#64748b",
};
