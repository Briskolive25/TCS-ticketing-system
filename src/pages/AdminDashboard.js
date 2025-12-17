// AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function AdminDashboard() {
  // --- SAMPLE DATA (replace with real data later) ---
  const volumeByCategory = [
    { category: "Technical", volume: 120 },
    { category: "HR", volume: 80 },
    { category: "Finance", volume: 60 },
    { category: "General", volume: 40 },
  ];

  const timeAssignResolve = [
    { name: "Week 1", assign: 4, resolve: 10 },
    { name: "Week 2", assign: 3, resolve: 7 },
    { name: "Week 3", assign: 6, resolve: 9 },
    { name: "Week 4", assign: 2, resolve: 6 },
  ];

  const repeatTickets = [
    { category: "Technical", repeat: 12 },
    { category: "HR", repeat: 4 },
    { category: "Finance", repeat: 7 },
    { category: "General", repeat: 2 },
  ];

  return (
    <div style={root}>
      <Sidebar />

      <div style={page}>
        <h2 style={title}>Admin Dashboard</h2>
        <p style={subtitle}>Operational insights & performance analytics</p>

        {/* KPI CARDS */}
        <div style={kpiGrid}>
          <KpiCard title="SLA Compliance %" value="92%" />
          <KpiCard title="Total Ticket Volume" value="1,248" />
          <KpiCard title="Avg. Time to Assign" value="1.8 hrs" />
          <KpiCard title="Avg. Time to Resolve" value="14.2 hrs" />
        </div>

        {/* ANALYTICS SECTIONS */}
        <div style={sectionGrid}>
          <Section title="Volume by Category">
            <div style={chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Time-to-Assign vs Time-to-Resolve">
            <div style={chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeAssignResolve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="assign" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="resolve" stroke="#6366f1" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Repeat Tickets Analysis">
            <div style={chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repeatTickets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="repeat" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small components ---------- */
const KpiCard = ({ title, value }) => (
  <div style={kpiCard}>
    <p style={kpiTitle}>{title}</p>
    <h3 style={kpiValue}>{value}</h3>
  </div>
);

const Section = ({ title, children }) => (
  <div style={section}>
    <h4 style={sectionTitle}>{title}</h4>
    {children}
  </div>
);

/* ---------- Styles ---------- */
const root = { display: "flex", minHeight: "100vh", background: "#f4f6fa" };

/* leave marginLeft to match Sidebar width (adjust if your Sidebar width is different) */
const page = {
  marginLeft: 220,
  padding: 30,
  width: "100%",
  background: "#f4f6fa",
  minHeight: "100vh",
};

const title = { fontSize: 22, fontWeight: 700 };
const subtitle = { fontSize: 13, color: "#6b7280", marginBottom: 20 };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
  marginBottom: 30,
};

const kpiCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const kpiTitle = { fontSize: 13, color: "#6b7280", marginBottom: 6 };
const kpiValue = { fontSize: 22, fontWeight: 700, color: "#1a5cff" };

const sectionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 20,
};

const section = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const sectionTitle = { fontSize: 14, fontWeight: 600, marginBottom: 10 };

/* wrapper for ResponsiveContainer: keeps height fixed */
const chartBox = { width: "100%", height: 250 };

/* ---------- end ---------- */
