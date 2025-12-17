// Operations.js — self-contained, no external UI libs (uses only Sidebar)
import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Operations() {
  // dropdown options
  const statusOptions = ["Open", "Assigned", "In Progress", "Closed"];
  const siteOptions = ["Gurgaon", "Bangalore", "Mumbai", "Hyderabad"];
  const slaOptions = ["Breached", "At Risk", "Normal"];
  const teamOptions = ["Riya", "Suresh", "Arjun", "Neha"];
  const trendOptions = ["Daily", "Weekly", "Monthly"];

  // form state (your original)
  const [form, setForm] = useState({
    assignedTo: "",
    status: "Open",
    slaTimer: "",
    tags: "",
    internalNotes: "",
    resolutionSummary: "",
    closureAttachments: [],
  });

  // sample entries so table isn't empty
  const [entries, setEntries] = useState([
    {
      id: 1,
      assignedTo: "Riya",
      status: "Open",
      slaTimer: "24 Hours",
      tags: "Replacement",
      internalNotes: "Site waiting for replacement staff",
      resolutionSummary: "",
      closureAttachments: [],
      site: "Gurgaon",
      coordinator: "Riya",
      date: "2025-12-01",
    },
    {
      id: 2,
      assignedTo: "Suresh",
      status: "Assigned",
      slaTimer: "48 Hours",
      tags: "Payment",
      internalNotes: "Pending invoice",
      resolutionSummary: "",
      closureAttachments: [],
      site: "Mumbai",
      coordinator: "Suresh",
      date: "2025-12-04",
    },
    {
      id: 3,
      assignedTo: "Arjun",
      status: "In Progress",
      slaTimer: "72 Hours",
      tags: "SLA Issue",
      internalNotes: "Investigating SLA breach",
      resolutionSummary: "",
      closureAttachments: [],
      site: "Bangalore",
      coordinator: "Arjun",
      date: "2025-12-08",
    },
    {
      id: 4,
      assignedTo: "Neha",
      status: "Closed",
      slaTimer: "4 Hours",
      tags: "Attendance",
      internalNotes: "Resolved and confirmed",
      resolutionSummary: "Replaced resource",
      closureAttachments: [],
      site: "Hyderabad",
      coordinator: "Neha",
      date: "2025-11-28",
    },
  ]);

  // UI modal + filter states
  const [activeModal, setActiveModal] = useState(null); // 'status'|'site'|'sla'|'team'|'trend'|'export'|null
  const [filters, setFilters] = useState({
    status: "",
    site: "",
    sla: "",
    coordinator: "",
    trend: "",
    from: "",
    to: "",
  });

  // basic change handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "closureAttachments") {
      setForm((s) => ({ ...s, closureAttachments: Array.from(files || []) }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!form.assignedTo.trim()) {
      alert("Please enter Assigned To.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...form,
      site: form.site || "Gurgaon",
      coordinator: form.assignedTo,
      date: new Date().toISOString().slice(0, 10),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setForm({
      assignedTo: "",
      status: "Open",
      slaTimer: "",
      tags: "",
      internalNotes: "",
      resolutionSummary: "",
      closureAttachments: [],
    });
  };

  const handleCancel = () => {
    setForm({
      assignedTo: "",
      status: "Open",
      slaTimer: "",
      tags: "",
      internalNotes: "",
      resolutionSummary: "",
      closureAttachments: [],
    });
  };

  const viewAttachments = (files) => {
    if (!files || files.length === 0) return;
    files.forEach((file) => {
      try {
        const url = URL.createObjectURL(file);
        window.open(url, "_blank");
      } catch (err) {
        console.error("Cannot open file", err);
      }
    });
  };

  // Apply a single filter quickly (used by card modals)
  const applyQuickFilter = (type, value) => {
    setFilters((f) => ({ ...f, [type]: value }));
    setActiveModal(null);
  };

  // Filtered entries derived from entries + filters
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (filters.status && e.status !== filters.status) return false;
      if (filters.site && e.site !== filters.site) return false;
      if (filters.sla && e.slaTimer !== filters.sla) return false;
      if (filters.coordinator && e.coordinator !== filters.coordinator) return false;
      if (filters.from && e.date < filters.from) return false;
      if (filters.to && e.date > filters.to) return false;
      return true;
    });
  }, [entries, filters]);

  // Export CSV (works as Excel)
  const exportCSV = (rows) => {
    if (!rows || rows.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = [
      "Assigned To",
      "Status",
      "SLA",
      "Tags",
      "Internal Notes",
      "Resolution Summary",
      "Site",
      "Coordinator",
      "Date",
    ];
    const csvRows = [headers.join(",")];
    rows.forEach((r) => {
      const vals = [
        `"${r.assignedTo || ""}"`,
        `"${r.status || ""}"`,
        `"${r.slaTimer || ""}"`,
        `"${r.tags || ""}"`,
        `"${(r.internalNotes || "").replace(/\"/g, '""')}"`,
        `"${(r.resolutionSummary || "").replace(/\"/g, '""')}"`,
        `"${r.site || ""}"`,
        `"${r.coordinator || ""}"`,
        `"${r.date || ""}"`,
      ];
      csvRows.push(vals.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "operations_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to "PDF" by opening print window (simple fallback)
  const exportPDF = (rows) => {
    const html = [
      "<html><head><title>Operations Export</title>",
      "<style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}</style>",
      "</head><body>",
      "<h2>Operations Export</h2>",
      "<table>",
      "<thead><tr><th>Assigned To</th><th>Status</th><th>SLA</th><th>Tags</th><th>Site</th><th>Coordinator</th><th>Date</th></tr></thead>",
      "<tbody>",
    ];
    rows.forEach((r) => {
      html.push(
        `<tr><td>${r.assignedTo || ""}</td><td>${r.status || ""}</td><td>${r.slaTimer || ""}</td><td>${r.tags || ""}</td><td>${r.site || ""}</td><td>${r.coordinator || ""}</td><td>${r.date || ""}</td></tr>`
      );
    });
    html.push("</tbody></table></body></html>");
    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup blocked — allow popups to export PDF");
      return;
    }
    w.document.write(html.join(""));
    w.document.close();
    w.print();
  };

  // small helper to clear filters
  const clearFilters = () => setFilters({ status: "", site: "", sla: "", coordinator: "", trend: "", from: "", to: "" });

  // ---- styles (kept inline so file runs out-of-the-box) ----
  const styles = {
    layout: { display: "flex", minHeight: "100vh", background: "#f4f7ff" },
    contentWrapper: { flex: 1, paddingLeft: 260, boxSizing: "border-box" },
    container: { maxWidth: 1200, margin: "0 auto", padding: 28, boxSizing: "border-box" },
    title: { margin: 0, fontSize: 22, fontWeight: 700 },
    subtitle: { margin: 0, color: "#6b7280", marginTop: 6, fontSize: 13 },
    dashboardGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 18 },
    dashCard: { background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 6px 20px rgba(17,24,39,0.06)", border: "1px solid #eef2ff", cursor: "pointer" },
    dashHead: { margin: 0, marginBottom: 12, fontSize: 15, fontWeight: 700 },
    dashRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#374151" },
    alertBox: { background: "#fee2e2", padding: "10px 14px", borderRadius: 8, color: "#b91c1c", fontWeight: 600, textAlign: "center" },
    filterModal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
    modalCard: { width: 380, background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.2)" },
    modalTitle: { margin: 0, marginBottom: 10, fontSize: 16, fontWeight: 700 },
    modalRow: { display: "flex", gap: 8, marginTop: 10 },
    input: { width: "100%", height: 44, padding: "8px 12px", borderRadius: 8, border: "1px solid #e6e9ef", fontSize: 14 },
    btnPrimary: { background: "#1a5cff", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
    btnGhost: { background: "transparent", color: "#1a5cff", border: "1px solid #cfe0ff", padding: "8px 12px", borderRadius: 8, cursor: "pointer" },
    tableWrap: { marginTop: 12 },
    tableContainer: { width: "100%", background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)", border: "1px solid #eef2ff" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 14px", fontSize: 13, background: "#f8fafc", color: "#374151", borderBottom: "1px solid #eef2ff" },
    td: { padding: "12px 14px", fontSize: 13, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  };

  return (
    <div style={styles.layout}>
      <Sidebar />

      <div style={styles.contentWrapper}>
        <div style={styles.container}>
          <h1 style={styles.title}>Brisk Olive Operations Dashboard</h1>
          <p style={styles.subtitle}>Quick snapshot of ticket activities — click cards to filter</p>

          {/* DASHBOARD */}
          <div style={styles.dashboardGrid}>
            <div style={styles.dashCard} onClick={() => setActiveModal("status")}>
              <h3 style={styles.dashHead}>Tickets by Status</h3>
              {Object.entries(
                { Open: 12, Assigned: 6, "In Progress": 9, Closed: 31 }
              ).map(([k, v]) => (
                <div key={k} style={styles.dashRow}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>

            <div style={styles.dashCard} onClick={() => setActiveModal("site")}>
              <h3 style={styles.dashHead}>Tickets by Site</h3>
              {Object.entries({ Gurgaon: 18, Bangalore: 10, Mumbai: 20, Hyderabad: 8 }).map(([k, v]) => (
                <div key={k} style={styles.dashRow}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>

            <div style={styles.dashCard} onClick={() => setActiveModal("sla")}>
              <h3 style={styles.dashHead}>SLA Breach Alerts</h3>
              <div style={styles.alertBox}>4 Breaches</div>
            </div>
          </div>

          {/* second row of cards */}
          <div style={{ ...styles.dashboardGrid, marginTop: 8 }}>
            <div style={styles.dashCard} onClick={() => setActiveModal("team")}>
              <h3 style={styles.dashHead}>Team Performance</h3>
              {Object.entries({ Riya: 12, Suresh: 15, Arjun: 9, Neha: 17 }).map(([k, v]) => (
                <div key={k} style={styles.dashRow}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>

            <div style={styles.dashCard} onClick={() => setActiveModal("trends")}>
              <h3 style={styles.dashHead}>Ticket Trends</h3>
              <div style={styles.dashRow}><span>Daily</span><strong>5</strong></div>
              <div style={styles.dashRow}><span>Weekly</span><strong>28</strong></div>
              <div style={styles.dashRow}><span>Monthly</span><strong>110</strong></div>
            </div>

            <div style={styles.dashCard} onClick={() => setActiveModal("export")}>
              <h3 style={styles.dashHead}>Export</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={styles.btnPrimary} onClick={() => exportCSV(filteredEntries)}>Export Excel</button>
                <button style={styles.btnGhost} onClick={() => exportPDF(filteredEntries)}>Export PDF</button>
              </div>
            </div>
          </div>

          {/* Filter chips + clear */}
          <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
            {filters.status && <div style={{ padding: "6px 10px", background: "#eef2ff", borderRadius: 999 }}>{filters.status}</div>}
            {filters.site && <div style={{ padding: "6px 10px", background: "#ede9fe", borderRadius: 999 }}>{filters.site}</div>}
            {filters.sla && <div style={{ padding: "6px 10px", background: "#fee2e2", borderRadius: 999 }}>{filters.sla}</div>}
            {(filters.status || filters.site || filters.sla || filters.coordinator) && (
              <button style={styles.btnGhost} onClick={clearFilters}>Clear filters</button>
            )}
          </div>

          {/* FORM CARD (UNCHANGED) */}
          <div style={{ marginTop: 18, background: "#fff", padding: 18, borderRadius: 12, boxShadow: "0 10px 30px rgba(17,24,39,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0 }}>Brisk Olive Operations</h2>
                <div style={{ color: "#6b7280", marginTop: 6 }}>Ticket handling, SLA tracking & closure management</div>
              </div>
              <div style={{ minWidth: 180, textAlign: "right" }}>
                <div style={{ color: "#6b7280", fontSize: 12 }}>Quick actions</div>
                <div style={{ marginTop: 8 }}>
                  <button style={styles.btnGhost} onClick={() => setEntries([])}>Clear Table</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8 }}>Assigned To</label>
                  <input name="assignedTo" value={form.assignedTo} placeholder="Enter assignee name or email" onChange={handleChange} style={styles.input} />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8 }}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8 }}>SLA Timer</label>
                  <select name="slaTimer" value={form.slaTimer} onChange={handleChange} style={styles.input}>
                    <option value="">Select SLA</option>
                    {["4 Hours","24 Hours","48 Hours","72 Hours"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8 }}>Tags</label>
                  <select name="tags" value={form.tags} onChange={handleChange} style={styles.input}>
                    <option value="">Select Tag</option>
                    {["Replacement","Attendance","Payment","SLA Issue","Escalation","General"].map((t)=> <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: "1 / span 2" }}>
                  <label style={{ display: "block", marginBottom: 8 }}>Internal Notes</label>
                  <textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} placeholder="Add internal notes..." style={{ width: "100%", minHeight: 84, padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                </div>

                <div style={{ gridColumn: "1 / span 2" }}>
                  <label style={{ display: "block", marginBottom: 8 }}>Resolution Summary</label>
                  <textarea name="resolutionSummary" value={form.resolutionSummary} onChange={handleChange} placeholder="Summary of resolution..." style={{ width: "100%", minHeight: 84, padding: 10, borderRadius: 8, border: "1px solid #e6e9ef" }} />
                </div>

                <div style={{ gridColumn: "1 / span 2" }}>
                  <label style={{ display: "block", marginBottom: 8 }}>Closure Attachments</label>
                  <div style={{ padding: 12, borderRadius: 10, border: "1px dashed #c7d2fe", background: "#fbfcff" }}>
                    <input type="file" name="closureAttachments" multiple onChange={handleChange} style={{ cursor: "pointer" }} />
                    <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>Upload multiple files (screenshots, docs).</div>
                    {form.closureAttachments.length > 0 && <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>{form.closureAttachments.map((f, idx) => <div key={idx} style={{ background: "#eef2ff", color: "#1a5cff", padding: "6px 10px", borderRadius: 999 }}>{f.name}</div>)}</div>}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button style={{ background: "#f3f4f6", color: "#111827", border: "none", padding: "10px 18px", borderRadius: 10, cursor: "pointer" }} onClick={handleCancel}>Cancel</button>
                <button style={{ background: "#1a5cff", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer" }} onClick={handleSave}>Save Update</button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: "8px 0 12px 0" }}>Operations Log</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Assigned To</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>SLA</th>
                    <th style={styles.th}>Tags</th>
                    <th style={styles.th}>Internal Notes</th>
                    <th style={styles.th}>Resolution Summary</th>
                    <th style={styles.th}>Site</th>
                    <th style={styles.th}>Coordinator</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Attachments</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>No operation entries match the filters.</td>
                    </tr>
                  ) : (
                    filteredEntries.map((e) => (
                      <tr key={e.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                        <td style={styles.td}>{e.assignedTo}</td>
                        <td style={styles.td}>{e.status}</td>
                        <td style={styles.td}>{e.slaTimer}</td>
                        <td style={styles.td}>{e.tags}</td>
                        <td style={styles.td}>{e.internalNotes}</td>
                        <td style={styles.td}>{e.resolutionSummary}</td>
                        <td style={styles.td}>{e.site}</td>
                        <td style={styles.td}>{e.coordinator}</td>
                        <td style={styles.td}>{e.date}</td>
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          {e.closureAttachments?.length > 0 ? (
                            <button onClick={() => viewAttachments(e.closureAttachments)} style={{ background: "#1a5cff", color: "#fff", padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                              View ({e.closureAttachments.length})
                            </button>
                          ) : (
                            <span style={{ color: "#6b7280" }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FILTER MODALS (overlay) */}
        {activeModal && (
          <div style={styles.filterModal} onClick={() => setActiveModal(null)}>
            <div style={styles.modalCard} onClick={(ev) => ev.stopPropagation()}>
              <h4 style={styles.modalTitle}>
                {activeModal === "status" && "Filter: Tickets by Status"}
                {activeModal === "site" && "Filter: Tickets by Site"}
                {activeModal === "sla" && "Filter: SLA Breach Alerts"}
                {activeModal === "team" && "Filter: Team Performance"}
                {activeModal === "trends" && "Filter: Trends"}
                {activeModal === "export" && "Export Options"}
              </h4>

              {/* status */}
              {activeModal === "status" && (
                <>
                  <div style={{ display: "grid", gap: 8 }}>
                    {statusOptions.map((s) => (
                      <button key={s} style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef", background: filters.status === s ? "#e6f0ff" : "#fff", textAlign: "left" }} onClick={() => applyQuickFilter("status", s)}>{s}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={styles.btnGhost} onClick={() => setActiveModal(null)}>Close</button>
                  </div>
                </>
              )}

              {/* site */}
              {activeModal === "site" && (
                <>
                  <div style={{ display: "grid", gap: 8 }}>
                    {siteOptions.map((s) => (
                      <button key={s} style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef", background: filters.site === s ? "#f3eaff" : "#fff", textAlign: "left" }} onClick={() => applyQuickFilter("site", s)}>{s}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={styles.btnGhost} onClick={() => setActiveModal(null)}>Close</button>
                  </div>
                </>
              )}

              {/* sla */}
              {activeModal === "sla" && (
                <>
                  <div style={{ display: "grid", gap: 8 }}>
                    {slaOptions.map((s) => (
                      <button key={s} style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef", background: filters.sla === s ? "#fff0f0" : "#fff", textAlign: "left" }} onClick={() => applyQuickFilter("sla", s)}>{s}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={styles.btnGhost} onClick={() => setActiveModal(null)}>Close</button>
                  </div>
                </>
              )}

              {/* team */}
              {activeModal === "team" && (
                <>
                  <div style={{ display: "grid", gap: 8 }}>
                    {teamOptions.map((t) => (
                      <button key={t} style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef", background: filters.coordinator === t ? "#edffef" : "#fff", textAlign: "left" }} onClick={() => applyQuickFilter("coordinator", t)}>{t}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={styles.btnGhost} onClick={() => setActiveModal(null)}>Close</button>
                  </div>
                </>
              )}

              {/* trends */}
              {activeModal === "trends" && (
                <>
                  <div style={{ display: "grid", gap: 8 }}>
                    {trendOptions.map((t) => (
                      <button key={t} style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e9ef", background: filters.trend === t ? "#fff9e6" : "#fff", textAlign: "left" }} onClick={() => applyQuickFilter("trend", t)}>{t}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={styles.btnGhost} onClick={() => setActiveModal(null)}>Close</button>
                  </div>
                </>
              )}

              {/* export */}
              {activeModal === "export" && (
                <>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnPrimary} onClick={() => { exportCSV(filteredEntries); setActiveModal(null); }}>Export Excel</button>
                    <button style={styles.btnGhost} onClick={() => { exportPDF(filteredEntries); setActiveModal(null); }}>Export PDF</button>
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={styles.btnGhost} onClick={() => setActiveModal(null)}>Close</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
