import React, { useState, useMemo, useEffect } from "react";

/* ---------------- DEPARTMENTS ---------------- */

const departments = [
  "HR",
  "Accounts",
  "Admin",
  "Sales",
  "DAA",
  "Recruitment",
  "Projects",
  "Operations",
  "Marketing"
];

const ProcessDashboard = () => {
  const [selectedDept, setSelectedDept] = useState("All");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const initialFormState = {
    dept: "",
    process: "",
    metric: "",
    mandatory: "",
    frequency: "",
    metricType: "",
    kpiDefinition: "",
    plannedKPI: "",
    kpiType: "",
    kpiDesired: "",
    actualKPI: "",
    primaryRole: "",
    secondaryRole: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    setData([]);
  }, []);

  /* ---------------- EXPORT ---------------- */

  const handleExport = () => {
    if (filteredData.length === 0) return;

    const headers = [
      "Dept","Process","Metric","Mandatory","Frequency","Metric Type",
      "KPI Definition","Planned KPI","KPI Type","KPI Desired",
      "Actual KPI","KPI Score","Final Score","Primary Role","Secondary Role"
    ];

    const rows = filteredData.map((row) => [
      row.dept,row.process,row.metric,row.mandatory,row.frequency,
      row.metricType,row.kpiDefinition,row.plannedKPI,row.kpiType,
      row.kpiDesired,row.actualKPI,row.kpiScore,row.finalScore,
      row.primaryRole,row.secondaryRole
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "KPI_Report.csv";
    link.click();
  };

  /* ---------------- FORM ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ---------------- SCORE LOGIC ---------------- */

  const handleSubmit = () => {
    let score = 0;
    const planned = Number(formData.plannedKPI);
    const actual = Number(formData.actualKPI);

    if (formData.kpiType === "Binary") {
      score = formData.actualKPI === formData.plannedKPI ? 0 : -1;
    } else if (!isNaN(planned) && !isNaN(actual)) {
      if (formData.kpiDesired === "Max") score = actual - planned;
      if (formData.kpiDesired === "Min") score = planned - actual;
      if (formData.kpiDesired === "Equal")
        score = actual === planned ? 0 : -Math.abs(actual - planned);
    }

    const newKPI = {
      ...formData,
      plannedKPI: isNaN(planned) ? formData.plannedKPI : planned,
      actualKPI: isNaN(actual) ? formData.actualKPI : actual,
      kpiScore: score,
      finalScore: score
    };

    setData([...data, newKPI]);

    // ✅ Reset form after save
    setFormData(initialFormState);

    setShowModal(false);
  };

  // ✅ Cancel Handler (NEW)
  const handleCancel = () => {
    setFormData(initialFormState);
    setShowModal(false);
  };

  /* ---------------- FILTER ---------------- */

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchDept =
        selectedDept === "All" || item.dept === selectedDept;

      const matchSearch =
        item.metric?.toLowerCase().includes(search.toLowerCase()) ||
        item.process?.toLowerCase().includes(search.toLowerCase()) ||
        item.primaryRole?.toLowerCase().includes(search.toLowerCase());

      return matchDept && matchSearch;
    });
  }, [data, selectedDept, search]);

  /* ---------------- SUMMARY ---------------- */

  const departmentSummary = useMemo(() => {
    return departments.map((dept) => {
      const deptData = data.filter((d) => d.dept === dept);
      const avg =
        deptData.reduce((sum, d) => sum + (d.finalScore || 0), 0) /
        (deptData.length || 1);

      return { dept, count: deptData.length, avg: avg.toFixed(1) };
    });
  }, [data]);

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={{ margin: 0 }}>KPI Process Dashboard</h1>
          <p style={subtitle}>
            Track and manage department KPIs with role-based processscoring
          </p>
        </div>

        <div style={headerButtons}>
          <button style={btnLight}>View Employees</button>
          <button style={btnDark} onClick={() => setShowModal(true)}>
            + Add KPI
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={cardRow}>
        {departmentSummary.map((item) => (
          <div
            key={item.dept}
            style={cardStyle}
            onClick={() => setSelectedDept(item.dept)}
          >
            <h4>{item.dept}</h4>
            <p>{item.count} KPIs</p>
            <h2>{item.avg}</h2>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ marginTop: 30 }}>
        <div style={searchRow}>
          <input
            type="text"
            placeholder="Search by metric, process, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

          <div style={rightControls}>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={dropdown}
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <button style={btnLight} onClick={handleExport}>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ marginTop: 30, overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "Dept","Process","Metric","Mandatory","Frequency",
                "Metric Type","KPI Definition","Planned KPI",
                "KPI Type","KPI Desired","Actual KPI",
                "KPI Score","Final Score",
                "Primary Role","Secondary Role"
              ].map((head) => (
                <th key={head} style={thStyle}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i}>
                <td style={tdStyle}>{row.dept}</td>
                <td style={tdStyle}>{row.process}</td>
                <td style={tdStyle}>{row.metric}</td>
                <td style={tdStyle}>{row.mandatory}</td>
                <td style={tdStyle}>{row.frequency}</td>
                <td style={tdStyle}>{row.metricType}</td>
                <td style={tdStyle}>{row.kpiDefinition}</td>
                <td style={tdStyle}>{row.plannedKPI}</td>
                <td style={tdStyle}>{row.kpiType}</td>
                <td style={tdStyle}>{row.kpiDesired}</td>
                <td style={tdStyle}>{row.actualKPI}</td>
                <td style={tdStyle}>{row.kpiScore}</td>
                <td style={tdStyle}>{row.finalScore}</td>
                <td style={tdStyle}>{row.primaryRole}</td>
                <td style={tdStyle}>{row.secondaryRole}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD KPI MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>Add KPI</h2>

            <div style={formGrid}>
              <select name="dept" value={formData.dept} onChange={handleChange} style={inputStyle}>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select name="mandatory" value={formData.mandatory} onChange={handleChange} style={inputStyle}>
                <option value="">Mandatory?</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>

              <input name="process" placeholder="Process" value={formData.process} onChange={handleChange} style={inputStyle} />
              <input name="metric" placeholder="Metric" value={formData.metric} onChange={handleChange} style={inputStyle} />

              <select name="frequency" value={formData.frequency} onChange={handleChange} style={inputStyle}>
                <option value="">Select Frequency</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annually</option>
                <option>Event-based</option>
              </select>

              <select name="metricType" value={formData.metricType} onChange={handleChange} style={inputStyle}>
                <option value="">Select Metric Type</option>
                <option>KPI</option>
                <option>Binary</option>
                <option>Hybrid</option>
              </select>

              <textarea name="kpiDefinition" value={formData.kpiDefinition} placeholder="KPI Definition" onChange={handleChange} style={textareaStyle} />

              <input name="plannedKPI" value={formData.plannedKPI} placeholder="Planned KPI" onChange={handleChange} style={inputStyle} />

              <select name="kpiType" value={formData.kpiType} onChange={handleChange} style={inputStyle}>
                <option value="">Select KPI Type</option>
                <option>Number</option>
                <option>Date</option>
                <option>Number of Days</option>
                <option>Binary</option>
                <option>Days/Efficiency</option>
              </select>

              <select name="kpiDesired" value={formData.kpiDesired} onChange={handleChange} style={inputStyle}>
                <option value="">Select Desired</option>
                <option>Min</option>
                <option>Max</option>
                <option>Equal</option> 
              </select>

              <input name="actualKPI" value={formData.actualKPI} placeholder="Actual KPI" onChange={handleChange} style={inputStyle} />
              <input name="primaryRole" value={formData.primaryRole} placeholder="Primary Role" onChange={handleChange} style={inputStyle} />
              <input name="secondaryRole" value={formData.secondaryRole} placeholder="Secondary Role" onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 15 }}>
              <button style={btnDark} onClick={handleSubmit}>
                Save KPI
              </button>

              {/* ✅ NEW CANCEL BUTTON */}
              <button style={btnLight} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- STYLES (UNCHANGED) ---------------- */

const container = { padding: 30, background: "#f6f7fb", minHeight: "100vh" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const subtitle = { color: "#64748b", marginTop: 5 };
const headerButtons = { display: "flex", gap: 15 };
const cardRow = { display: "flex", gap: 20, marginTop: 30 };
const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  width: 220,
  cursor: "pointer" 
};
const searchRow = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 };
const searchInput = { flex: 1, padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const rightControls = { display: "flex", gap: 15 };
const dropdown = { padding: 10, borderRadius: 8, border: "1px solid #ddd" };
const btnLight = { padding: "10px 16px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };
const btnDark = { padding: "10px 16px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse", background: "#fff" };
const thStyle = { padding: 12, borderBottom: "1px solid #ddd", background: "#f1f5f9", textAlign: "left" };
const tdStyle = { padding: 12, borderBottom: "1px solid #eee" };
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};
const modalBox = { background: "#fff", padding: 30, borderRadius: 12, width: 700 };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 20 };
const inputStyle = { padding: 10, borderRadius: 8, border: "1px solid #ddd" };
const textareaStyle = { ...inputStyle, gridColumn: "span 2", height: 80 };

export default ProcessDashboard; 