// Operations.js
import React, { useState, useEffect } from "react";
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

  const statusOptions = [
    "Open",
    "Assigned",
    "In Progress",
    "Waiting for Client Response",
    "Resolved – Pending Client Confirmation",
    "Closed",
    "Reopened",
  ];

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
                t.allocationDetails?.resolution?.trim() &&
                t.allocationDetails?.attachment?.trim();

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

                  {/* ✅ FINAL ACTION LOGIC */}
                  <td style={td}>
                    {hasResolutionAndAttachment ? (
                      <button
                        style={viewBtn}
                        onClick={() => openAllocate(t, true)}
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        style={editBtn}
                        onClick={() => openAllocate(t, false)}
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
                ["SLA Timer", "slaTimer"],
                ["Tags", "tags"],
                ["Internal Notes", "notes"],
                ["Resolution Summary", "resolution"],
                ["Closure Attachment", "attachment"],
              ].map(([label, key]) => (
                <div key={key} style={field}>
                  <label style={labelStyle}>{label}</label>
                  {isViewOnly ? (
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

            {userRole === "Admin" && isViewOnly && (
              <div style={confirmBox}>
                <label style={labelStyle}>Update Ticket Status</label>
                <select
                  style={textarea}
                  value={form.allocationStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allocationStatus: e.target.value,
                    })
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  style={{ ...btnPrimary, marginTop: 12, width: "100%" }}
                  onClick={saveAllocation}
                >
                  Save Status
                </button>
              </div>
            )}

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
