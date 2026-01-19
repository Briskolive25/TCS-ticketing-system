// Operations.js
import React, { useState, useEffect,useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

const ASSIGNEES = ["Anshika", "Harsh", "Akash", "Aditya", "Tanisha", "Laksh"];
const SLA_OPTIONS = ["4 Hours", "24 Hours", "48 Hours", "72 Hours"];
const TAG_OPTIONS = ["Replacement", "Attendance", "Payment"];

export default function Operations() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("Name");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [form, setForm] = useState({
    assignedTo: "",
    status: "",
    slaTimer: "",
    notes: "",
    tags: "",
    resolution: "",
    attachment: "",
  });

  /* ================= FETCH TICKETS ================= */
  const normalizeStatus = (status) =>
  status ? status.trim().toLowerCase() : "open";

const fetchTickets = useCallback(async () => {
  setLoading(true);
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getTickets`);
    const result = await res.json();

    if (result.status === "success") {
      let allTickets = (result.data || []).map((t) => ({
        ...t,
        rawStatus: t.status,
        status: normalizeStatus(t.status),
        rawDate: t.rawDate || t.date,
      }));

      if (userRole === "Executive") {
        allTickets = allTickets.filter((ticket) => {
          const assigned = ticket.allocatedTo?.trim();
          return (
            assigned &&
            assigned.toLowerCase() === userName?.trim().toLowerCase()
          );
        });
      }

      allTickets.sort((a, b) => (b.id || 0) - (a.id || 0));
      setTickets(allTickets);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [userRole, userName]); // ✅ REQUIRED


 useEffect(() => {
  fetchTickets();
}, [fetchTickets]); // ✅ DO NOT change this


  /* ================= OPEN MODAL ================= */
  const openAllocate = (ticket) => {
    setSelectedTicket(ticket);

    const isClosed = ticket.status?.trim() === "closed";
    const viewOnly =
      userRole === "TCS" || isClosed;

    setIsViewOnly(viewOnly);

    setForm({
      assignedTo: ticket.allocatedTo || "",
      status: ticket.rawStatus || "open",
      slaTimer: ticket.slaTimer || "",
      notes: ticket.notes || "",
      tags: ticket.tags || "",
      resolution: ticket.resolution || "",
      attachment: ticket.attachment || "",
    });

    setShowForm(true);
  };
const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
const formatFilterDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
const formatDDMMYYYY = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

  /* ================= SAVE CHANGES ================= */
  const saveAllocation = async () => {
  if (!selectedTicket?.id) {
    alert("No ticket selected");
    return;
  }
  console.log("Form data to save:", form);

  const hasResolution = form.resolution?.trim().length > 0;
  const hasAttachment = form.attachment?.trim().length > 0;

  let finalStatus = form.status;

  // ✅ Admin / Ops can close after confirmation
  if (userRole !== "Executive" && hasResolution && hasAttachment) {
    const confirmClose = window.confirm(
      "Executive has completed the work. Do you want to CLOSE this ticket?"
    );

    if (confirmClose) {
      finalStatus = "closed";

      // 🔥 IMPORTANT: UPDATE FORM STATE ALSO
      setForm((prev) => ({
        ...prev,
        status: "closed",
      }));
    }
  }

  const payload = {
    ticketId: selectedTicket.id,
    assignedTo: form.assignedTo.trim(),
    status:
  finalStatus.charAt(0).toUpperCase() +
  finalStatus.slice(1).toLowerCase(),
    slaTimer: form.slaTimer,
    notes: form.notes,
    tags: form.tags,
    resolution: form.resolution,
    attachment: form.attachment,
  };

  try {
    setSaving(true);

    const res = await fetch(`${SCRIPT_URL}?action=saveAllocation`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: JSON.stringify(payload) }),
    });

    const result = await res.json();

    if (result.status === "success") {
      alert("Ticket updated successfully!");
      setShowForm(false);
      fetchTickets(); // ✅ table refresh now shows Closed
    } else {
      alert("Save failed: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Save error:", err);
    alert("Network error while saving.");
  } finally {
    setSaving(false);
  }
};


    /* ================= KPI COUNTS ================= */
  const totalTickets = tickets.length;

const openTickets = tickets.filter(
  (t) => t.status === "open"
).length;

const closedTickets = tickets.filter(
  (t) => t.status === "closed"
).length;

const inProgressTickets = tickets.filter(
  (t) =>
    t.status !== "closed" &&
    (t.allocatedTo ||
      t.resolution?.trim() ||
      t.attachment?.trim())
).length;

const filteredTickets = tickets.filter((t) => {
  // Date filter applies to ALL roles (including TCS)
  if (fromDate || toDate) {
    const ticketDate = new Date(t.rawDate);
    if (isNaN(ticketDate)) return false;

    if (fromDate && ticketDate < new Date(fromDate)) return false;
    if (toDate && ticketDate > new Date(toDate)) return false;
  }

  // Role-based visibility
  if (userRole === "Executive") {
    const assigned = t.allocatedTo?.trim();
    return (
      assigned &&
      assigned.toLowerCase() === userName?.trim().toLowerCase()
    );
  }

  // TCS & Admin see all (after date filter)
  return true;
});

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

              <div
          style={{
            marginLeft: 260,
            padding: 25,
            width: "calc(100vw - 260px)",
            overflowX: "hidden",
          }}
        >

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
    flexWrap: "wrap",
  }}
>
  <h2>
    {userRole === "TCS"
      ? "TCS – Support Tickets Status"
      : "Operations – Ticket Allocation"}
  </h2>

  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    style={textarea}
  />
  {fromDate && (
    <div style={{ fontSize: 13, color: "#555" }}>
      From Date: <strong>{formatDDMMYYYY(fromDate)}</strong>
    </div>
  )}
</div>

<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    style={textarea}
  />
  {toDate && (
    <div style={{ fontSize: 13, color: "#555" }}>
      To Date: <strong>{formatDDMMYYYY(toDate)}</strong>
    </div>
  )}
</div>


    <button
      style={btnGhost}
      onClick={() => {
        setFromDate("");
        setToDate("");
      }}
    >
      Clear
    </button>

    <button onClick={fetchTickets} style={refreshBtn}>
      Refresh Tickets
    </button>
    {userRole === "TCS" && (
    <button
      style={supportBtn}
      onClick={() => navigate("/support")}
    >
      Raise Ticket
    </button>
    )} 

  </div>
{userRole !== "TCS" && (fromDate || toDate) && (
  <div
    style={{
      marginTop: 6,
      fontSize: 14,
      color: "#555",
    }}
  >
    Showing tickets
    {fromDate && (
      <>
        {" from "}
        <strong>{formatFilterDate(fromDate)}</strong>
      </>
    )}
    {toDate && (
      <>
        {" to "}
        <strong>{formatFilterDate(toDate)}</strong>
      </>
    )}
  </div>
)}
 
</div>

        <div
  style={{
    display: "flex",
    gap: 20,
    marginBottom: 25,
    flexWrap: "wrap",
  }}
>

  <div style={kpiCard}>
    <div style={kpiLabel}>Total Tickets</div>
    <div style={kpiValue}>{totalTickets}</div>
  </div>

  <div style={{ ...kpiCard, borderLeft: "5px solid #ff6b00" }}>
    <div style={kpiLabel}>Open Tickets</div>
    <div style={kpiValue}>{openTickets}</div>
  </div>

  <div style={{ ...kpiCard, borderLeft: "5px solid #1a5cff" }}>
    <div style={kpiLabel}>In Progress</div>
    <div style={kpiValue}>{inProgressTickets}</div>
  </div>

  <div style={{ ...kpiCard, borderLeft: "5px solid #28a745" }}>
    <div style={kpiLabel}>Closed Tickets</div>
    <div style={kpiValue}>{closedTickets}</div>
  </div>
</div>

        {loading ? (
  <p>Loading tickets...</p>
) : tickets.length === 0 ? (
  <p>
    No tickets found.
    {userRole === "Executive" ? " (None assigned to you yet)" : ""}
  </p>
) : (
  /* ✅ CHANGE 1: table wrapped */
  <div style={tableWrapper}>
    <table style={table}>
      <thead style={thead}>
        <tr>
          <th style={th}>ID</th>
          <th style={th}>Email</th>
          <th style={th}>Contact Person</th>
          <th style={th}>Phone</th>
          <th style={th}>Category</th>
          <th style={th}>Sub-category</th>
          <th style={th}>Description</th>
          <th style={th}>Site</th>
          <th style={th}>Date</th>
          <th style={th}>Priority</th>
          <th style={th}>Status</th>

          {userRole !== "TCS" && <th style={th}>Assigned To</th>}
          {userRole !== "TCS" && <th style={th}>Executive Status</th>}

          {userRole !== "TCS" && <th style={th}>Action</th>}

        </tr>
      </thead>
      <tbody>
        {filteredTickets.map((t) => {

          const execDone = t.resolution?.trim() && t.attachment?.trim();

          return (
            <tr key={t.id}>
              <td style={td}>{t.id}</td>
              <td style={td}>{t.email || "—"}</td>
              <td style={td}>{t.contact || "—"}</td>
              <td style={td}>{t.phone || "—"}</td>
              <td style={td}>{t.category}</td>
              <td style={td}>{t.subCategory}</td>
              <td style={td}>{t.description?.slice(0, 50)}...</td>
              <td style={td}>{t.site}</td>
              <td style={td}>{formatDate(t.date)}</td>
              <td style={td}>{t.priority}</td>
              <td style={td}>
                <strong
                  style={{
                    color: t.status === "closed" ? "#28a745" : "#ff6b00", 
                    textTransform: "capitalize",
                  }}
                >
                  {t.status}
                </strong>
              </td>
              {userRole !== "TCS" && (
                <td style={td}>{t.allocatedTo || "—"}</td>
              )}

              {userRole !== "TCS" && (
                <td style={td}>
                  {execDone ? (
                    <span style={{ color: "#28a745", fontWeight: "bold" }}>
                      Completed
                    </span>
                  ) : (
                    <span style={{ color: "#dc3545" }}>Pending</span>
                  )}
                </td>
              )}

              {/* ACTION COLUMN */}
              {userRole !== "TCS" && (
                <td style={td}>
                  <button
                    style={t.status === "closed" ? viewBtn : editBtn}
                    onClick={() => openAllocate(t)}
                  >
                    {t.status === "closed"
                      ? "View"
                      : t.allocatedTo
                      ? execDone
                        ? "Review"
                        : "Update"
                      : "Allocate"}
                  </button>
                </td>
              )}


            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

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
                      <option value="In Progress">In Progress</option>
                      <option value="Reopened">Reopened</option>
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
    <button
      style={{
        ...btnPrimary,
        opacity: saving ? 0.7 : 1,
        cursor: saving ? "not-allowed" : "pointer",
      }}
      onClick={saveAllocation}
      disabled={saving}
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>
  )}
</div>

          </div>          
        </div>
      )}      
      </div>
    </div>
  );
}


const table = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const thead = {
  background: "#1a5cff",
  color: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const th = { padding: "14px 12px", textAlign: "left", fontWeight: 600 };
const td = { padding: "14px 12px", borderBottom: "1px solid #eee" };

const tableWrapper = {
  width: "100%",
  maxHeight: "65vh",   // table scroll height
  overflowX: "auto",
  overflowY: "auto",
};

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
const supportBtn = {
  padding: "10px 18px",
  background: "#1a5cff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
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
const kpiCard = {
  flex: 1,
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  borderLeft: "5px solid #6c757d",
};
const kpiLabel = {
  fontSize: 14,
  color: "#666",
  marginBottom: 8,
  fontWeight: 500,
};

const kpiValue = {
  fontSize: 28,
  fontWeight: 700,
  color: "#222",
};