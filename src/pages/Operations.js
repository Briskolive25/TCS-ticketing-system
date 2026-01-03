// Operations.js
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

/* ===== DROPDOWN OPTIONS ===== */
const ASSIGNEES = ["Anshika", "Harsh", "Akash", "Aditya", "Tanisha", "Laksh"];
const SLA_OPTIONS = ["4 Hours", "24 Hours", "48 Hours", "72 Hours"];
const TAG_OPTIONS = ["Replacement", "Attendance", "Payment"];

export default function Operations() {
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("Name");

  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [form, setForm] = useState({
    assignedTo: "",
    allocationStatus: "",
    slaTimer: "",
    notes: "",
    tags: "",
    resolution: "",
    attachment: "",
  });

  const [tickets, setTickets] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(`${SCRIPT_URL}?action=getTickets`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          let allTickets = result.data;

          if (userRole === "Executive") {
            allTickets = allTickets.filter(
              (t) =>
                t.allocatedTo &&
                t.allocatedTo.trim().toLowerCase() ===
                  userName?.trim().toLowerCase()
            );
          }

          setTickets(allTickets);
        }
      });
  }, [userRole, userName]);

  /* ================= OPEN MODAL ================= */
  const openAllocate = (ticket, viewOnly = false) => {
    setSelectedTicket(ticket);

    // Executive-specific logic
    let execViewOnly = false;
    if (userRole === "Executive") {
      const execCompleted =
        ticket.resolution?.trim() && ticket.attachment?.trim();
      execViewOnly = execCompleted || viewOnly;
    }

    setIsViewOnly(execViewOnly);

    setForm({
      assignedTo: ticket.allocatedTo || "",
      allocationStatus: ticket.allocationStatus || "Open",
      slaTimer: ticket.slaTimer || "",
      notes: ticket.notes || "",
      tags: ticket.tags || "",
      resolution: ticket.resolution || "",
      attachment: ticket.attachment || "",
    });

    setShowForm(true);
  };

  /* ================= SAVE ================= */
  const saveAllocation = async () => {
    const payload = {
      ticketId: selectedTicket.id,
      assignedTo: form.assignedTo,
      allocationStatus: "Open",
      slaTimer: form.slaTimer,
      notes: form.notes,
      tags: form.tags,
      resolution: form.resolution,
      attachment: form.attachment,
    };

    const res = await fetch(`${SCRIPT_URL}?action=saveAllocation`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: JSON.stringify(payload) }),
    });

    const result = await res.json();

    if (result.status === "success") {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? {
                ...t,
                allocatedTo: form.assignedTo,
                allocationStatus: form.allocationStatus,
                resolution: form.resolution,
                attachment: form.attachment,
                execStatus:
                  form.resolution?.trim() && form.attachment?.trim()
                    ? "Completed"
                    : t.execStatus || "",
              }
            : t
        )
      );
      setShowForm(false);
      alert("Updated successfully");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: 260, padding: 25, width: "100%" }}>
        <h2>Operations – Ticket Allocation</h2>

        <table style={table}>
          <thead style={thead}>
            <tr>
              <th style={th}>Category</th>
              <th style={th}>Sub-category</th>
              <th style={th}>Description</th>
              <th style={th}>Site</th>
              <th style={th}>Date</th>
              <th style={th}>Priority</th>
              <th style={th}>Status</th>
              <th style={th}>Contact</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Executive Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => {
              const hasResolutionAndAttachment =
                t.resolution?.trim() && t.attachment?.trim();

              const isFullyCompleted =
                hasResolutionAndAttachment && t.adminFinalStatus;

              return (
                <tr key={t.id}>
                  <td style={td}>{t.category}</td>
                  <td style={td}>{t.subCategory}</td>
                  <td style={td}>{t.description}</td>
                  <td style={td}>{t.site}</td>
                  <td style={td}>{t.date}</td>
                  <td style={td}>{t.priority}</td>

                  {/* Show status ONLY after allocation */}
                  <td style={td}>{t.allocatedTo ? "Open" : ""}</td>

                  <td style={td}>{t.contact}</td>
                  <td style={td}>{t.email}</td>
                  <td style={td}>{t.phone}</td>
                  <td style={td}>{t.allocationStatus}</td>

                  {/* Executive Status
                  <td style={td}>
                    {hasResolutionAndAttachment ? "Completed" : t.execStatus || ""}
                  </td> */}

                  {/* Action Column */}
                  <td style={td}>
                    {!t.allocatedTo ? (
                      <button
                        style={editBtn}
                        onClick={() => openAllocate(t, false)}
                      >
                        Allocate
                      </button>
                    ) : hasResolutionAndAttachment && !t.adminFinalStatus ? (
                      <button
                        style={editBtn}
                        onClick={() => openAllocate(t, false)}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        style={viewBtn}
                        onClick={() => openAllocate(t, true)}
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={modalTitle}>
              {isViewOnly ? "Ticket Details" : "Update Ticket"}
            </h3>

            <div style={grid}>
              {/* Assigned To */}
              <div style={field}>
                <label style={labelStyle}>Assigned To</label>
                {userRole === "Executive" ? (
                  <div style={viewBox}>{form.assignedTo || "—"}</div>
                ) : isViewOnly ? (
                  <div style={viewBox}>{form.assignedTo || "—"}</div>
                ) : (
                  <select
                    style={textarea}
                    value={form.assignedTo}
                    onChange={(e) =>
                      setForm({ ...form, assignedTo: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {ASSIGNEES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* STATUS (READ-ONLY OPEN) */}
              <div style={field}>
                <label style={labelStyle}>Status</label>
                <input style={textarea} value="Open" disabled />
              </div>

              {/* SLA */}
              <div style={field}>
                <label style={labelStyle}>SLA Timer</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>{form.slaTimer || "—"}</div>
                ) : (
                  <select
                    style={textarea}
                    value={form.slaTimer}
                    onChange={(e) =>
                      setForm({ ...form, slaTimer: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {SLA_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
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
                    onChange={(e) =>
                      setForm({ ...form, tags: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {TAG_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Notes */}
              <div style={field}>
                <label style={labelStyle}>Internal Notes</label>
                {userRole === "Executive" || isViewOnly ? (
                  <div style={viewBox}>{form.notes || "—"}</div>
                ) : (
                  <textarea
                    style={textarea}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                )}
              </div>

              {/* Executive-only fields */}
              <div style={field}>
                <label style={labelStyle}>Resolution Summary</label>
                {isViewOnly && userRole === "Executive" ? (
                  <div style={viewBox}>{form.resolution || "—"}</div>
                ) : (
                  <textarea
                    style={textarea}
                    value={form.resolution}
                    onChange={(e) =>
                      setForm({ ...form, resolution: e.target.value })
                    }
                  />
                )}
              </div>

              <div style={field}>
                <label style={labelStyle}>Closure Attachment</label>
                {isViewOnly && userRole === "Executive" ? (
                  <div style={viewBox}>{form.attachment || "—"}</div>
                ) : (
                  <textarea
                    style={textarea}
                    value={form.attachment}
                    onChange={(e) =>
                      setForm({ ...form, attachment: e.target.value })
                    }
                  />
                )}
              </div>
            </div>

            <div style={footer}>
              <button style={btnGhost} onClick={() => setShowForm(false)}>
                Close
              </button>
              {!isViewOnly && (
                <button style={btnPrimary} onClick={saveAllocation}>
                  Save
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
const table = { width: "100%", borderCollapse: "collapse" };
const thead = { background: "#1a5cff", color: "#fff" };
const th = { padding: 12 };
const td = { padding: 12, borderBottom: "1px solid #ddd" };

const viewBtn = {
  padding: "6px 14px",
  background: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: 4,
};

const editBtn = {
  padding: "6px 14px",
  background: "#1a5cff",
  color: "#fff",
  border: "none",
  borderRadius: 4,
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  width: 640,
  maxHeight: "85vh",
  padding: 24,
  borderRadius: 10,
  overflowY: "auto",
};

const modalTitle = {
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 18,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const field = { display: "flex", flexDirection: "column" };

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
};

const textarea = {
  minHeight: 40,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const viewBox = {
  background: "#f4f6fb",
  padding: 10,
  borderRadius: 6,
  minHeight: 40,
};

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
};

const btnPrimary = {
  background: "#1a5cff",
  color: "#fff",
  padding: "8px 16px",
};

const btnGhost = { padding: "8px 16px" };
