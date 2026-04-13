import React, { useState } from "react";

const AddTargets = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const initialForm = {
    targetId: "",
    assignedDate: today,
    assignedTo: "",
    assignedBy: "Tanisha",
    target: "",
    startDate: "",
    expiryDate: "",
    description: "",
    frequencyType: "",
    deadlineDate: "",
    valueType: "",
    value: "",
    maxMin: "",
    reportingFrequency: "",
    scoringFrequency: "",
    carryOverRule: "",
    triggerDateTime: "",
    leaveApplicable: "",
    status: "",
    cancelReason: "",
    stage: "",
    updatedOn: "",
    actualValue: "",
    updateMethod: "",
    actualSource: "",
    scoringScale: "",
    score: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Target Submitted");
    setShowForm(false);
    setForm(initialForm);
  };

  const rows = [
    {
      target: "Customer Response Time",
      planned: "24 hrs",
      actual: "28 hrs",
      diff: "+4",
      score: "-1",
      targetId: "TGT-001",
      assignedDate: "2026-03-10",
      assignedTo: "Tanisha",
      assignedBy: "Tanisha",
      startDate: "2026-03-10",
      expiryDate: "2026-06-30",
      description: "Reduce response time for customer tickets.",
      frequencyType: "Repetitive",
      deadlineDate: "",
      valueType: "Value",
      value: "24",
      maxMin: "<=",
      reportingFrequency: "Weekly",
      scoringFrequency: "Monthly",
      carryOverRule: "Carried over",
      triggerDateTime: "2026-03-10T10:00",
      leaveApplicable: "Yes",
      status: "Open",
      cancelReason: "",
      stage: "Active",
      updatedOn: "2026-03-12",
      actualValue: "28",
      updateMethod: "Manually",
      actualSource: "Ticketing System",
    },
    {
      target: "Weekly Ticket Closure",
      planned: "120",
      actual: "128",
      diff: "+8",
      score: "+4",
      targetId: "TGT-002",
      assignedDate: "2026-03-01",
      assignedTo: "Shivank",
      assignedBy: "Tanisha",
      startDate: "2026-03-01",
      expiryDate: "",
      description: "Close minimum 120 tickets per week.",
      frequencyType: "Deadline",
      deadlineDate: "2026-03-31",
      valueType: "Value",
      value: "120",
      maxMin: ">=",
      reportingFrequency: "Weekly",
      scoringFrequency: "Weekly",
      carryOverRule: "Expired",
      triggerDateTime: "2026-03-01T09:00",
      leaveApplicable: "No",
      status: "Closed",
      cancelReason: "",
      stage: "Completed",
      updatedOn: "2026-03-08",
      actualValue: "128",
      updateMethod: "Automated",
      actualSource: "Ops Dashboard",
    },
    {
      target: "First Call Resolution",
      planned: "90%",
      actual: "92%",
      diff: "+2%",
      score: "+3",
      targetId: "TGT-003",
      assignedDate: "2026-02-15",
      assignedTo: "Devanshe",
      assignedBy: "Tanisha",
      startDate: "",
      expiryDate: "2026-05-15",
      description: "Improve FCR rate to 90% or higher.",
      frequencyType: "Repetitive",
      deadlineDate: "",
      valueType: "Value",
      value: "90",
      maxMin: ">=",
      reportingFrequency: "Monthly",
      scoringFrequency: "Quarterly",
      carryOverRule: "Carried over",
      triggerDateTime: "2026-02-15T09:30",
      leaveApplicable: "Yes",
      status: "Open",
      cancelReason: "",
      stage: "Active",
      updatedOn: "2026-03-05",
      actualValue: "92",
      updateMethod: "Automated",
      actualSource: "Quality Reports",
    },
  ];

  return (
    <div style={page}>
      <div style={shell}>
        {/* Header */}
        <header style={header}>
          <div>
            <h1 style={title}>Targets Dashboard</h1>
            <div style={subtitle}>Track planned vs actual performance and scoring.</div>
          </div>
          <div style={headerActions}>
            <button style={ghostBtn}>Export</button>
            <button style={primaryBtn} onClick={() => setShowForm(true)}>
              Add Target
            </button>
          </div>
        </header>

        {/* Table */}
        <section style={panel}>
          <div style={panelHeader}>
            <div>
              <div style={panelTitle}>Target Tracker</div>
              <div style={panelHint}>Overview of planned vs actual targets.</div>
            </div>
            <div style={filterRow}>
              <input style={filterInput} placeholder="Search Target" />
              <select style={filterInput}>
                <option>All Departments</option>
                <option>Operations</option>
                <option>Support</option>
                <option>Admin</option>
              </select>
              <select style={filterInput}>
                <option>All Status</option>
                <option>On Track</option>
                <option>At Risk</option>
                <option>Ahead</option>
              </select>
            </div>
          </div>

          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Target</th>
                  <th style={th}>Planned</th>
                  <th style={th}>Actual</th>
                  <th style={th}>Difference</th>
                  <th style={th}>Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.target} style={{ ...tr, cursor: "pointer" }} onClick={() => setViewRow(row)}>
                    <td style={tdStrong}>{row.target}</td>
                    <td style={td}>{row.planned}</td>
                    <td style={td}>{row.actual}</td>
                    <td style={td}>{row.diff}</td>
                    <td style={td}>{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Popup Form */}
        {showForm && (
          <div style={overlay}>
            <div style={modal}>
              <div style={modalBar}>
                <div style={modalTitle}>Add Target</div>
              </div>
              <div style={modalBody}>
                <div style={modalHint}>Fill out the details to create a new target.</div>
                <form onSubmit={handleSubmit} style={formStack}>
                  <section style={section}>
                    <div style={sectionTitle}>Target Form</div>
                    <div style={sectionGrid}>
                      <Field label="Target ID">
                        <input style={input} name="targetId" onChange={handleChange} />
                      </Field>
                      <Field label="Assigned Date">
                        <input
                          style={{ ...input, background: "#eef2ff" }}
                          type="date"
                          name="assignedDate"
                          value={form.assignedDate}
                          readOnly
                        />
                      </Field>
                      <Field label="Assigned To">
                        <select style={input} name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Tanisha">Tanisha</option>
                          <option value="Shivank">Shivank</option>
                          <option value="Devanshe">Devanshe</option>
                          <option value="Shivharsh">Shivharsh</option>
                        </select>
                      </Field>
                      <Field label="Assigned By">
                        <input
                          style={{ ...input, background: "#eef2ff" }}
                          name="assignedBy"
                          value={form.assignedBy}
                          readOnly
                        />
                      </Field>
                      <Field label="Target">
                        <input style={input} name="target" onChange={handleChange} />
                      </Field>
                      <Field
                        label="Start Date (if any)"
                        hint="If Start Date differs from Assigned Date, it applies; otherwise Assigned Date applies."
                      >
                        <input style={input} type="date" name="startDate" onChange={handleChange} />
                      </Field>
                      <Field
                        label="Expiry Date (if any)"
                        hint="Does the target expire after some date? If yes, provide it. Usually for Repetitive targets."
                      >
                        <input style={input} type="date" name="expiryDate" onChange={handleChange} />
                      </Field>
                      <Field label="Target Description">
                        <input style={input} name="description" onChange={handleChange} />
                      </Field>
                      <Field label="Target Frequency Type">
                        <select style={input} name="frequencyType" value={form.frequencyType} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Deadline">Deadline</option>
                          <option value="Repetitive">Repetitive</option>
                        </select>
                      </Field>
                      {form.frequencyType === "Deadline" && (
                        <Field label="Deadline Date" hint="Only for Deadline frequency type.">
                          <input style={input} type="date" name="deadlineDate" onChange={handleChange} />
                        </Field>
                      )}
                      <Field label="Target Value Type">
                        <select style={input} name="valueType" value={form.valueType} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Binary">Binary</option>
                          <option value="Value">Value</option>
                        </select>
                      </Field>
                      <Field label="Target Value">
                        {form.valueType === "Binary" ? (
                          <select style={input} name="value" value={form.value} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          <input style={input} name="value" type="number" onChange={handleChange} />
                        )}
                      </Field>
                      {form.valueType === "Value" && (
                        <Field label="Target Max/Min">
                          <select style={input} name="maxMin" value={form.maxMin} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value=">=">Greater than/Equal to</option>
                            <option value="<=">Less than/Equal to</option>
                            <option value="=">Equal</option>
                          </select>
                        </Field>
                      )}
                      <Field label="Reporting Frequency">
                        <select style={input} name="reportingFrequency" value={form.reportingFrequency} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Annually">Annually</option>
                        </select>
                      </Field>
                      <Field label="Scoring Frequency">
                        <select style={input} name="scoringFrequency" value={form.scoringFrequency} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Annually">Annually</option>
                        </select>
                      </Field>
                      <Field label="Target Carry-Over Rule (For Scoring)">
                        <select style={input} name="carryOverRule" value={form.carryOverRule} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Carried over">Carried over</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </Field>
                      <Field label="Scoring Trigger Date & Time">
                        <input style={input} type="datetime-local" name="triggerDateTime" onChange={handleChange} />
                      </Field>
                      <Field label="Applicable During Leave">
                        <select style={input} name="leaveApplicable" value={form.leaveApplicable} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </Field>
                      <Field label="Target Status">
                        <select style={input} name="status" value={form.status} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </Field>
                      {form.status === "Cancelled" && (
                        <Field label="Reason for Cancelling">
                          <input style={input} name="cancelReason" onChange={handleChange} />
                        </Field>
                      )}
                      <Field label="Target Stage">
                        <input style={input} name="stage" onChange={handleChange} />
                      </Field>
                      <Field label="Updated On">
                        <input style={input} type="date" name="updatedOn" onChange={handleChange} />
                      </Field>
                      <Field label="Actual Value">
                        <input style={input} name="actualValue" onChange={handleChange} />
                      </Field>
                      <Field label="Update Method">
                        <select style={input} name="updateMethod" value={form.updateMethod} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Automated">Automated</option>
                          <option value="Manually">Manually</option>
                        </select>
                      </Field>
                      <Field label="Actual Value Fetched From">
                        <input style={input} name="actualSource" onChange={handleChange} />
                      </Field>
                      <Field label="Score">
                        <input style={input} name="score" onChange={handleChange} />
                      </Field>
                    </div>
                  </section>

                  <div style={formActions}>
                    <button type="button" style={ghostBtn} onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" style={primaryBtn}>Submit Target</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {viewRow && (
          <div style={overlay}>
            <div style={modal}>
              <div style={modalBar}>
                <div style={modalTitle}>Target Details</div>
              </div>
              <div style={modalBody}>
                <div style={modalHint}>Full target details from the selected row.</div>
                <div style={formStack}>
                  <section style={section}>
                    <div style={sectionTitle}>Target Form</div>
                    <div style={sectionGrid}>
                      <Field label="Target ID"><input style={readOnlyInput} value={viewRow.targetId || ""} readOnly /></Field>
                      <Field label="Assigned Date"><input style={readOnlyInput} value={viewRow.assignedDate || ""} readOnly /></Field>
                      <Field label="Assigned To"><input style={readOnlyInput} value={viewRow.assignedTo || ""} readOnly /></Field>
                      <Field label="Assigned By"><input style={readOnlyInput} value={viewRow.assignedBy || ""} readOnly /></Field>
                      <Field label="Target"><input style={readOnlyInput} value={viewRow.target || ""} readOnly /></Field>
                      <Field label="Start Date (if any)"><input style={readOnlyInput} value={viewRow.startDate || ""} readOnly /></Field>
                      <Field label="Expiry Date (if any)"><input style={readOnlyInput} value={viewRow.expiryDate || ""} readOnly /></Field>
                      <Field label="Target Description"><input style={readOnlyInput} value={viewRow.description || ""} readOnly /></Field>
                      <Field label="Target Frequency Type"><input style={readOnlyInput} value={viewRow.frequencyType || ""} readOnly /></Field>
                      <Field label="Deadline Date"><input style={readOnlyInput} value={viewRow.deadlineDate || ""} readOnly /></Field>
                      <Field label="Target Value Type"><input style={readOnlyInput} value={viewRow.valueType || ""} readOnly /></Field>
                      <Field label="Target Value"><input style={readOnlyInput} value={viewRow.value || ""} readOnly /></Field>
                      <Field label="Target Max/Min"><input style={readOnlyInput} value={viewRow.maxMin || ""} readOnly /></Field>
                      <Field label="Reporting Frequency"><input style={readOnlyInput} value={viewRow.reportingFrequency || ""} readOnly /></Field>
                      <Field label="Scoring Frequency"><input style={readOnlyInput} value={viewRow.scoringFrequency || ""} readOnly /></Field>
                      <Field label="Target Carry-Over Rule (For Scoring)"><input style={readOnlyInput} value={viewRow.carryOverRule || ""} readOnly /></Field>
                      <Field label="Scoring Trigger Date & Time"><input style={readOnlyInput} value={viewRow.triggerDateTime || ""} readOnly /></Field>
                      <Field label="Applicable During Leave"><input style={readOnlyInput} value={viewRow.leaveApplicable || ""} readOnly /></Field>
                      <Field label="Target Status"><input style={readOnlyInput} value={viewRow.status || ""} readOnly /></Field>
                      <Field label="Reason for Cancelling"><input style={readOnlyInput} value={viewRow.cancelReason || ""} readOnly /></Field>
                      <Field label="Target Stage"><input style={readOnlyInput} value={viewRow.stage || ""} readOnly /></Field>
                      <Field label="Updated On"><input style={readOnlyInput} value={viewRow.updatedOn || ""} readOnly /></Field>
                      <Field label="Actual Value"><input style={readOnlyInput} value={viewRow.actualValue || ""} readOnly /></Field>
                      <Field label="Update Method"><input style={readOnlyInput} value={viewRow.updateMethod || ""} readOnly /></Field>
                      <Field label="Actual Value Fetched From"><input style={readOnlyInput} value={viewRow.actualSource || ""} readOnly /></Field>
                      <Field label="Score"><input style={readOnlyInput} value={viewRow.score || ""} readOnly /></Field>
                    </div>
                  </section>
                  <div style={formActions}>
                    <button type="button" style={ghostBtn} onClick={() => setViewRow(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <div style={field}>
    <div style={fieldLabel}>{label}</div>
    {hint && <div style={fieldHint}>{hint}</div>}
    {children}
  </div>
);

export default AddTargets;

const page = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, #f1f5ff, #eef2ff 45%, #f8fafc)",
  padding: 24,
  fontFamily: '"Poppins", "Segoe UI", sans-serif',
  color: "#0f172a",
};

const shell = {
  maxWidth: 1200,
  margin: "0 auto",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "22px 26px",
  background: "linear-gradient(120deg, #0f172a, #1e40af)",
  borderRadius: 18,
  color: "#ffffff",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.25)",
};

const title = {
  fontSize: 28,
  fontWeight: 700,
  margin: "6px 0 4px",
};

const subtitle = {
  fontSize: 14,
  opacity: 0.9,
};

const headerActions = {
  display: "flex",
  gap: 12,
};

const panel = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
  marginTop: 20,
};

const panelHeader = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 14,
};

const panelTitle = {
  fontSize: 18,
  fontWeight: 700,
};

const panelHint = {
  fontSize: 13,
  color: "#64748b",
};

const filterRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const filterInput = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  fontSize: 13,
  background: "#f8fafc",
  flex: "1 1 140px",
};

const tableWrap = {
  overflowX: "auto",
  borderRadius: 12,
  border: "1px solid #eef2ff",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th = {
  textAlign: "left",
  padding: "12px 14px",
  background: "#0f172a",
  color: "#ffffff",
  fontWeight: 600,
};

const tr = {
  borderBottom: "1px solid #eef2f7",
};

const td = {
  padding: "12px 14px",
  color: "#475569",
};

const tdStrong = {
  padding: "12px 14px",
  fontWeight: 600,
  color: "#0f172a",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
  zIndex: 2000,
};

const modal = {
  width: "min(900px, 94vw)",
  maxHeight: "90vh",
  background: "#ffffff",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 30px 60px rgba(15, 23, 42, 0.25)",
};

const modalBar = {
  background: "#1d4ed8",
  color: "#ffffff",
  padding: "14px 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const modalTitle = {
  fontSize: 18,
  fontWeight: 700,
};

const modalBody = {
  padding: 20,
  overflowY: "auto",
  maxHeight: "calc(90vh - 60px)",
};

const modalHint = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 14,
};

const formStack = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const section = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 14,
  background: "#f8fafc",
};

const sectionTitle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: 10,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const sectionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const fieldLabel = {
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
};

const fieldHint = {
  fontSize: 11,
  color: "#94a3b8",
  marginTop: -2,
};

const input = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  fontSize: 13,
};

const readOnlyInput = {
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: 13,
  color: "#475569",
};

const formActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const primaryBtn = {
  background: "linear-gradient(120deg, #2563eb, #1d4ed8)",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 10px 18px rgba(37, 99, 235, 0.25)",
};

const ghostBtn = {
  background: "#ffffff",
  color: "#1e293b",
  border: "1px solid #e2e8f0",
  padding: "10px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
};
