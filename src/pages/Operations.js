// Operations.js
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

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
          let allTickets = result.data.map((t) => ({
            ...t,
            allocationDetails: {
              assignedTo: t.allocatedTo,
              allocationStatus: t.allocationStatus,
              slaTimer: t.slaTimer,
              notes: t.notes,
              tags: t.tags,
              resolution: t.resolution,
              attachment: t.attachment,
            },
          }));

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
    setIsViewOnly(viewOnly);

    setForm({
      assignedTo: ticket.allocatedTo || "",
      allocationStatus:
        ticket.allocationDetails?.allocationStatus || "Open",
      slaTimer: ticket.allocationDetails?.slaTimer || "",
      notes: ticket.allocationDetails?.notes || "",
      tags: ticket.allocationDetails?.tags || "",
      resolution: ticket.allocationDetails?.resolution || "",
      attachment: ticket.allocationDetails?.attachment || "",
    });

    setShowForm(true);
  };

  /* ================= SAVE ================= */
  const saveAllocation = async () => {
    const payload = {
      ticketId: selectedTicket.id,
      assignedTo: form.assignedTo,
      allocationStatus: form.allocationStatus,
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
                allocationDetails: { ...form },
              }
            : t
        )
      );
      setShowForm(false);
      alert("Updated successfully");
    }
  };

  const statusOptions = [
    "Open",
    "Assigned",
    "In Progress",
    "Waiting for Client Response",
    "Resolved – Pending Client Confirmation",
    "Closed",
    "Reopened",
  ];

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
              const isAdminClosed =
                userRole === "Admin" &&
                t.allocationDetails?.allocationStatus === "Closed";

              return (
                <tr key={t.id}>
                  <td style={td}>{t.category}</td>
                  <td style={td}>{t.subCategory}</td>
                  <td style={td}>{t.description}</td>
                  <td style={td}>{t.site}</td>
                  <td style={td}>{t.date}</td>
                  <td style={td}>{t.priority}</td>
                  <td style={td}>{t.allocationStatus}</td>
                  <td style={td}>{t.contact}</td>
                  <td style={td}>{t.email}</td>
                  <td style={td}>{t.phone}</td>
                  <td style={td}>{t.allocationStatus}</td>

                  <td style={td}>
                    {isAdminClosed ? (
                      <button
                        style={viewBtn}
                        onClick={() => openAllocate(t, true)}
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        style={editBtn}
                        onClick={() => openAllocate(t)}
                      >
                        {t.allocatedTo ? "Edit" : "Allocate"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={modalTitle}>
              {isViewOnly ? "Ticket Details" : "Update Ticket"}
            </h3>

            <div style={grid}>
              {[
                ["Assigned To", "assignedTo"],
                ["Status", "allocationStatus"],
                ["SLA Timer", "slaTimer"],
                ["Tags", "tags"],
                ["Internal Notes", "notes"],
                ["Resolution Summary", "resolution"],
                ["Closure Attachment", "attachment"],
              ].map(([label, key]) => (
                <div key={key} style={field}>
                  <label style={labelStyle}>{label}</label>

                  {/* Assigned To dropdown */}
                  {key === "assignedTo" ? (
                    userRole === "Executive" ? (
                      <div style={viewBox}>{form.assignedTo || "—"}</div>
                    ) : (
                      <select
                        style={textarea}
                        value={form.assignedTo}
                        onChange={(e) =>
                          setForm({ ...form, assignedTo: e.target.value })
                        }
                      >
                        <option value="">Select Executive</option>
                        <option value="Akash">Akash</option>
                        <option value="Anshika">Anshika</option>
                        <option value="Tanisha">Tanisha</option>
                        <option value="Harsh">Harsh</option>
                        <option value="Laksh">Laksh</option>
                        <option value="Satendra Singh">
                          Satendra Singh
                        </option>
                      </select>
                    )
                  ) : key === "slaTimer" ? (
                    userRole === "Executive" ? (
                      <div style={viewBox}>{form.slaTimer || "—"}</div>
                    ) : (
                      <select
                        style={textarea}
                        value={form.slaTimer}
                        onChange={(e) =>
                          setForm({ ...form, slaTimer: e.target.value })
                        }
                      >
                        <option value="">Select SLA</option>
                        <option value="4 Hours">4 Hours</option>
                        <option value="24 Hours">24 Hours</option>
                        <option value="48 Hours">48 Hours</option>
                        <option value="72 Hours">72 Hours</option>
                      </select>
                    )
                  ) : key === "tags" ? (
                    userRole === "Executive" ? (
                      <div style={viewBox}>{form.tags || "—"}</div>
                    ) : (
                      <select
                        style={textarea}
                        value={form.tags}
                        onChange={(e) =>
                          setForm({ ...form, tags: e.target.value })
                        }
                      >
                        <option value="">Select Tag</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Attendance">Attendance</option>
                        <option value="Payment">Payment</option>
                      </select>
                    )
                  ) : userRole === "Executive" &&
                    key !== "resolution" &&
                    key !== "attachment" ? (
                    <div style={viewBox}>{form[key] || "—"}</div>
                  ) : (
                    <textarea
                      style={textarea}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {userRole !== "Executive" && isViewOnly && (
              <div style={confirmBox}>
                <p style={{ marginBottom: 10 }}>Update Ticket Status</p>
                <select
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    width: "100%",
                    border: "1px solid #ccc",
                  }}
                  value={form.allocationStatus}
                  onChange={(e) =>
                    setForm({ ...form, allocationStatus: e.target.value })
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  style={{
                    ...btnPrimary,
                    marginTop: 10,
                    width: "100%",
                  }}
                  onClick={saveAllocation}
                >
                  Save Status
                </button>
              </div>
            )}

            <div style={footer}>
              <button style={btnGhost} onClick={() => setShowForm(false)}>
                Cancel
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
  minHeight: 50,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const viewBox = {
  background: "#f4f6fb",
  padding: 10,
  borderRadius: 6,
  minHeight: 42,
};

const confirmBox = {
  marginTop: 20,
  padding: 15,
  background: "#fff3f3",
  border: "1px solid #ffcfcf",
  borderRadius: 8,
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
