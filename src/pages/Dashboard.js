import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [viewRow, setViewRow] = useState(null);

  const subCategories = {
    "Attendance / Timesheet Issues": ["Incorrect attendance", "Missing mandays", "Shift mismatch"],
    "Manpower Deployment Issues": ["Resource not reporting", "Sudden resignation", "Replacement request"],
    "Payment / Billing Concerns": ["Wrong invoice", "Rate mismatch", "Extra mandays clarification"],
    "Performance & Conduct Issues": ["Behavioural complaint", "Not following process", "Quality issues"],
    "System / Technical Issues": ["Report not received", "Portal upload-related", "App login issues"],
    Miscellaneous: ["Any ad-hoc concern"],
  };

  const categories = Object.keys(subCategories);
  const priorityOptions = ["Critical", "High", "Medium", "Low"];
  const statusOptions = ["Open", "In Progress", "Resolved"];

  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    description: "",
    site: "",
    date: "",
    priority: "",
    status: "Open",
    attachments: [],
    contact: "",
    email: "",
  });

  /* DATE FORMAT → 25/Dec/2025 */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "category") return setForm({ ...form, category: value, subCategory: "" });
    if (name === "attachments") return setForm({ ...form, attachments: Array.from(files) });
    setForm({ ...form, [name]: value });
  };

  const submitForm = () => {
    setTickets([...tickets, { ...form }]);
    setShowForm(false);
    alert("Ticket Added Successfully!");
    setForm({
      category: "", subCategory: "", description: "", site: "",
      date: "", priority: "", status: "Open",
      attachments: [], contact: "", email: "",
    });
  };

  const openTickets = tickets.filter(t => t.status === "Open").length;
  const inProgressTickets = tickets.filter(t => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;

  const downloadLogs = () => {
    if (!tickets.length) return alert("No ticket logs available");

    const headers = [
      "Category","Sub Category","Description","Site","Date",
      "Priority","Status","Contact","Email","Attachments"
    ];

    const rows = tickets.map(t =>
      [
        t.category,
        t.subCategory,
        t.description,
        t.site,
        formatDate(t.date),
        t.priority,
        t.status,
        t.contact,
        t.email,
        t.attachments.map(f => f.name).join(" | ")
      ].join(",")
    );

    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ticket_logs.csv";
    a.click();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 25, width: "100%", background: "#f5f7fa", marginLeft: 260 }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 25 }}>
          <h2>TCS Dashboard</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={downloadLogs} style={downloadBtn}>⬇ Download Logs</button>
            <button style={buttonBlue} onClick={() => setShowForm(true)}>+ Raise New Ticket</button>
          </div>
        </div>

        {/* DASHBOARD */}
        <div style={cardGrid}>
          <Card title="Total Tickets Raised" value={tickets.length} color="#2563eb" />
          <Card title="Open Tickets" value={openTickets} color="#f59e0b" />
          <Card title="In Progress Tickets" value={inProgressTickets} color="#fb923c" />
          <Card title="Resolved Tickets" value={resolvedTickets} color="#16a34a" />
        </div>

        {/* FORM */}
        {showForm && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h3>Raise New Ticket</h3>

              <div style={formGrid}>
                <FormSelect label="Category" name="category" value={form.category} options={categories} onChange={handleChange} />
                <FormSelect label="Sub-category" name="subCategory" value={form.subCategory}
                  options={form.category ? subCategories[form.category] : []}
                  onChange={handleChange} disabled={!form.category} />

                <div style={{ gridColumn: "span 2" }}>
                  <label>Description</label>
                  <textarea name="description" onChange={handleChange} style={inputStyle} />
                </div>

                <FormField label="Site / Center" name="site" onChange={handleChange} />
                <FormField label="Date of Issue" name="date" type="date" onChange={handleChange} />
                <FormSelect label="Priority" name="priority" value={form.priority} options={priorityOptions} onChange={handleChange} />
                <FormSelect label="Status" name="status" value={form.status} options={statusOptions} onChange={handleChange} />
                <FormField label="Contact Person" name="contact" onChange={handleChange} />
                <FormField label="Email / Phone" name="email" onChange={handleChange} />

                <div style={{ gridColumn: "span 2" }}>
                  <label>Attachments</label>
                  <input type="file" multiple name="attachments" onChange={handleChange} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button style={buttonGrey} onClick={() => setShowForm(false)}>Cancel</button>
                <button style={buttonGreen} onClick={submitForm}>Submit Ticket</button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <h3 style={{ marginTop: 40 }}>Raised Tickets</h3>
        <table style={tableContainer}>
          <thead style={theadStyle}>
            <tr>
              {["Category","Sub-category","Description","Site","Date","Priority","Status","Contact","Email","Attachments"]
                .map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr><td colSpan="10" style={emptyRow}>No Tickets Raised Yet</td></tr>
            ) : tickets.map((t, i) => (
              <tr key={i} style={rowStyle}>
                <td style={tdStyle}>{t.category}</td>
                <td style={tdStyle}>{t.subCategory}</td>
                <td style={tdStyle}>{t.description}</td>
                <td style={tdStyle}>{t.site}</td>
                <td style={tdStyle}>{formatDate(t.date)}</td>
                <td style={tdStyle}><span style={priorityBadge(t.priority)}>{t.priority}</span></td>
                <td style={tdStyle}>{t.status}</td>
                <td style={tdStyle}>{t.contact}</td>
                <td style={tdStyle}>{t.email}</td>

                <td style={tdStyle}>
                  {t.attachments.length === 0 ? "No File" : (
                    <>
                      <span
                        onClick={() => setViewRow(viewRow === i ? null : i)}
                        style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
                      >
                        View
                      </span>

                      {viewRow === i && (
                        <div style={attachmentPopup}>
                          <b>Attachments</b>
                          {t.attachments.map((f, idx) => (
                            <div key={idx}>
                              <a href={URL.createObjectURL(f)} target="_blank" rel="noreferrer">
                                📎 {f.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* COMPONENTS */
const FormField = ({ label, name, type="text", onChange }) => (
  <div style={formRow}>
    <label>{label}</label>
    <input type={type} name={name} onChange={onChange} style={inputStyle} />
  </div>
);

const FormSelect = ({ label, name, value, options, onChange, disabled }) => (
  <div style={formRow}>
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange} disabled={disabled} style={inputStyle}>
      <option value="">-- Select --</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

/* ENHANCED CARD */
const Card = ({ title, value, color }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 14,
      padding: "22px 26px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      borderLeft: `6px solid ${color}`,
      transition: "all .25s ease",
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 700 }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
      {title}
    </div>
  </div>
);

/* STYLES */
const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 22,
};

const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalBox = { background: "#fff", padding: 25, borderRadius: 10, width: 900 };
const formGrid = { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 };
const formRow = { display: "flex", flexDirection: "column" };
const inputStyle = { padding: 8, borderRadius: 6, border: "1px solid #ccc" };
const tableContainer = { width: "100%", background: "#fff", borderCollapse: "collapse", marginTop: 10 };
const theadStyle = { background: "#1a5cff", color: "#fff" };
const thStyle = { padding: 14 };
const rowStyle = { borderBottom: "1px solid #e5e7eb" };
const tdStyle = { padding: 12, verticalAlign: "top", position: "relative" };
const emptyRow = { textAlign: "center", padding: 20 };

const attachmentPopup = {
  position: "absolute",
  background: "#fff",
  border: "1px solid #ccc",
  padding: 10,
  borderRadius: 6,
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  marginTop: 6,
  zIndex: 100,
};

const priorityBadge = p => ({
  padding: "4px 10px",
  borderRadius: 8,
  fontWeight: "bold",
  background:
    p === "Critical" ? "#ffb3b3" :
    p === "High" ? "#ffd6cc" :
    p === "Medium" ? "#fff3cd" : "#d1ffd1",
});

const buttonBlue = { background: "#1a5cff", color: "#fff", padding: "12px 25px", borderRadius: 8, border: "none" };
const buttonGrey = { background: "#ccc", padding: "10px 20px", borderRadius: 8, marginRight: 10 };
const buttonGreen = { background: "green", color: "#fff", padding: "10px 20px", borderRadius: 8 };
const downloadBtn = { background: "linear-gradient(135deg,#2563eb,#1e40af)", color: "#fff", padding: "12px 22px", borderRadius: 10, border: "none", fontWeight: 600 };
