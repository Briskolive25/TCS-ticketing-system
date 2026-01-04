// Operations.js
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

const ASSIGNEES = ["Anshika", "Harsh", "Akash", "Aditya", "Tanisha", "Laksh"];
const SLA_OPTIONS = ["4 Hours", "24 Hours", "48 Hours", "72 Hours"];
const TAG_OPTIONS = ["Replacement", "Attendance", "Payment"];

export default function Operations() {
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("Name");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [form, setForm] = useState({
    assignedTo: "",
    status: "Open",
    slaTimer: "",
    notes: "",
    tags: "",
    resolution: "",
    attachment: "",
  });

  /* ================= FETCH TICKETS ================= */
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getTickets`);
      const result = await res.json();

      if (result.status === "success") {
        let allTickets = result.data || [];

        // For Executives: only show tickets assigned to them
        if (userRole === "Executive") {
          allTickets = allTickets.filter((ticket) => {
            const assigned = ticket.allocatedTo?.trim();
            return assigned && assigned.toLowerCase() === userName?.trim().toLowerCase();
          });
        }

        // Sort by newest first
        allTickets.sort((a, b) => (b.id || 0) - (a.id || 0));

        setTickets(allTickets);
      } else {
        alert("Error loading tickets: " + (result.message || "Unknown"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to connect to server. Check internet or script URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userRole, userName]);

  /* ================= OPEN MODAL ================= */
  const openAllocate = (ticket) => {
    setSelectedTicket(ticket);

    const isClosed = ticket.status?.trim() === "Closed";
    const viewOnly = userRole === "Executive" ? isClosed : isClosed;

    setIsViewOnly(viewOnly);

    setForm({
      assignedTo: ticket.allocatedTo || "",
      status: ticket.status || "Open",
      slaTimer: ticket.slaTimer || "",
      notes: ticket.notes || "",
      tags: ticket.tags || "",
      resolution: ticket.resolution || "",
      attachment: ticket.attachment || "",
    });

    setShowForm(true);
  };

  /* ================= SAVE CHANGES ================= */
  const saveAllocation = async () => {
    if (!selectedTicket?.id) {
      alert("No ticket selected");
      return;
    }

    const hasResolution = form.resolution?.trim().length > 0;
    const hasAttachment = form.attachment?.trim().length > 0;

    let finalStatus = form.status;

    // Only non-Executive (Admin/Operations) can close the ticket
    if (userRole !== "Executive" && hasResolution && hasAttachment) {
      if (window.confirm("Executive has completed the work. Do you want to CLOSE this ticket?")) {
        finalStatus = "Closed";
      }
    }

    const payload = {
      ticketId: selectedTicket.id,
      assignedTo: form.assignedTo.trim(),
      status: finalStatus,
      slaTimer: form.slaTimer,
      notes: form.notes,
      tags: form.tags,
      resolution: form.resolution,
      attachment: form.attachment,
    };

    try {
      const res = await fetch(`${SCRIPT_URL}?action=saveAllocation`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: JSON.stringify(payload) }),
      });

      const result = await res.json();

      if (result.status === "success") {
        alert("Ticket updated successfully!");
        setShowForm(false);
        fetchTickets(); // Refresh list to show latest data
      } else {
        alert("Save failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error while saving.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: 260, padding: 25, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2>Operations – Ticket Allocation</h2>
          <button onClick={fetchTickets} style={refreshBtn}>
            Refresh Tickets
          </button>
        </div>

        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>
            No tickets found.
            {userRole === "Executive" ? " (None assigned to you yet)" : ""}
          </p>
        ) : (
          <table style={table}>
            <thead style={thead}>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Category</th>
                <th style={th}>Sub-category</th>
                <th style={th}>Description</th>
                <th style={th}>Site</th>
                <th style={th}>Date</th>
                <th style={th}>Priority</th>
                <th style={th}>Status</th>
                <th style={th}>Assigned To</th>
                <th style={th}>Executive Progress</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => {
                const execDone = t.resolution?.trim() && t.attachment?.trim();

                return (
                  <tr key={t.id}>
                    <td style={td}>{t.id}</td>
                    <td style={td}>{t.category}</td>
                    <td style={td}>{t.subCategory}</td>
                    <td style={td}>{t.description?.slice(0, 50)}...</td>
                    <td style={td}>{t.site}</td>
                    <td style={td}>{t.date}</td>
                    <td style={td}>{t.priority}</td>
                    <td style={td}>
                      <strong style={{ color: t.status === "Closed" ? "#28a745" : "#ff6b00" }}>
                        {t.status || "Open"}
                      </strong>
                    </td>
                    <td style={td}>{t.allocatedTo || "—"}</td>
                    <td style={td}>
                      {execDone ? (
                        <span style={{ color: "#28a745", fontWeight: "bold" }}>Completed</span>
                      ) : (
                        <span style={{ color: "#dc3545" }}>Pending</span>
                      )}
                    </td>
                    <td style={td}>
                      {t.status === "Closed" ? (
                        <button style={viewBtn} onClick={() => openAllocate(t)}>
                          View
                        </button>
                      ) : (
                        <button style={editBtn} onClick={() => openAllocate(t)}>
                          {t.allocatedTo ? (execDone ? "Review" : "Update") : "Allocate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={modalTitle}>
              {isViewOnly ? "View Ticket" : "Update Ticket"} #{selectedTicket?.id}
            </h3>

            <div style={grid}>
              {/* Assigned To */}
              <div style={field}>
                <label style={labelStyle}>Assigned To</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>{form.assignedTo || "Not Assigned"}</div>
                ) : (
                  <select
                    style={textarea}
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  >
                    <option value="">Select Executive</option>
                    {ASSIGNEES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Final Status - Only Admin can close */}
              <div style={field}>
                <label style={labelStyle}>Final Status</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>
                    <strong>{form.status}</strong>
                  </div>
                ) : (
                  <div>
                    <select
                      style={textarea}
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      disabled={!form.resolution?.trim() || !form.attachment?.trim()}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <small style={{ color: "#666", fontSize: 12 }}>
                      Can only close after resolution & attachment are filled
                    </small>
                  </div>
                )}
              </div>

              {/* SLA Timer */}
              <div style={field}>
                <label style={labelStyle}>SLA Timer</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>{form.slaTimer || "—"}</div>
                ) : (
                  <select
                    style={textarea}
                    value={form.slaTimer}
                    onChange={(e) => setForm({ ...form, slaTimer: e.target.value })}
                  >
                    <option value="">Select</option>
                    {SLA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Tags */}
              <div style={field}>
                <label style={labelStyle}>Tags</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>{form.tags || "—"}</div>
                ) : (
                  <select
                    style={textarea}
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  >
                    <option value="">Select</option>
                    {TAG_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Internal Notes */}
              <div style={field}>
                <label style={labelStyle}>Internal Notes</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>{form.notes || "—"}</div>
                ) : (
                  <textarea
                    style={textarea}
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Add notes visible only to operations..."
                  />
                )}
              </div>

              {/* Resolution Summary - Executive only */}
              <div style={field}>
                <label style={labelStyle}>Resolution Summary</label>
                {userRole === "Executive" && !isViewOnly ? (
                  <textarea
                    style={{ ...textarea, height: 120 }}
                    value={form.resolution}
                    onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                    placeholder="Describe how the issue was resolved..."
                  />
                ) : (
                  <div style={viewBox}>{form.resolution || "—"}</div>
                )}
              </div>

              {/* Closure Attachment - Executive only */}
              <div style={field}>
                <label style={labelStyle}>Closure Attachment (Link/Proof)</label>
                {userRole === "Executive" && !isViewOnly ? (
                  <textarea
                    style={textarea}
                    rows={3}
                    value={form.attachment}
                    onChange={(e) => setForm({ ...form, attachment: e.target.value })}
                    placeholder="Paste Google Drive link, screenshot URL, etc."
                  />
                ) : form.attachment ? (
                  <div style={viewBox}>
                    <a href={form.attachment} target="_blank" rel="noopener noreferrer">
                      Open Attachment
                    </a>
                  </div>
                ) : (
                  <div style={viewBox}>—</div>
                )}
              </div>
            </div>

            <div style={footer}>
              <button style={btnGhost} onClick={() => setShowForm(false)}>
                Cancel
              </button>
              {!isViewOnly && (
                <button style={btnPrimary} onClick={saveAllocation}>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const table = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const thead = { background: "#1a5cff", color: "#fff" };
const th = { padding: "14px 12px", textAlign: "left", fontWeight: 600 };
const td = { padding: "14px 12px", borderBottom: "1px solid #eee" };

const refreshBtn = {
  padding: "10px 16px",
  background: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const viewBtn = {
  padding: "8px 16px",
  background: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const editBtn = {
  padding: "8px 16px",
  background: "#1a5cff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  width: "90%",
  maxWidth: 900,
  maxHeight: "90vh",
  padding: 32,
  borderRadius: 12,
  overflowY: "auto",
  boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
};

const modalTitle = { fontSize: 24, fontWeight: 600, marginBottom: 24 };
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 };
const field = { display: "flex", flexDirection: "column" };
const labelStyle = { fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#333" };
const textarea = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
  resize: "vertical",
};
const viewBox = {
  background: "#f8f9fa",
  padding: 12,
  borderRadius: 8,
  minHeight: 44,
  border: "1px solid #eee",
  fontSize: 14,
};
const footer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 32,
  paddingTop: 20,
  borderTop: "1px solid #eee",
};
const btnPrimary = {
  padding: "12px 24px",
  background: "#1a5cff",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};
const btnGhost = {
  padding: "12px 24px",
  background: "transparent",
  color: "#666",
  border: "1px solid #ccc",
  borderRadius: 8,
  cursor: "pointer",
};