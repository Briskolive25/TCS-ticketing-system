import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import "./RaiseTicket.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

export default function RaiseTicket() {
  const subCategories = {
    "Attendance / Timesheet Issues": [
      "Incorrect attendance",
      "Missing mandays",
      "Shift mismatch",
    ],
    "Manpower Deployment Issues": [
      "Resource not reporting",
      "Sudden resignation",
      "Replacement request",
    ],
    "Payment / Billing Concerns": [
      "Wrong invoice",
      "Rate mismatch",
      "Extra mandays clarification",
    ],
    "Performance & Conduct Issues": [
      "Behavioural complaint",
      "Not following process",
      "Quality issues",
    ],
    "System / Technical Issues": [
      "Report not received",
      "Portal upload-related",
      "App login issues",
    ],
    Miscellaneous: ["Any ad-hoc concern"],
  };

  const categories = Object.keys(subCategories);
  const priorityOptions = ["Critical", "High", "Medium", "Low"];
  const todayISO = new Date().toISOString().split("T")[0];

  const initialForm = {
    email: "",
    contact: "",
    phone: "",
    date: "",
    category: "",
    subCategory: "",
    priority: "",
    tcCode: "",
    tcName: "",
    city: "",
    state: "",
    site: "",
    description: "",
    attachments: [],
    status: "Open",
  };

  const [form, setForm] = useState(initialForm);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---------- DATE FORMAT: 06 Jan 2025 ---------- */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  /* ---------- AUTO-FILL EMAIL ---------- */
  useEffect(() => {
    const savedEmail = localStorage.getItem("support_email");
    if (savedEmail) setForm((p) => ({ ...p, email: savedEmail }));
  }, []);

  /* ---------- FETCH TC MASTER ---------- */
  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getSites`);
      const data = await res.json();
      if (data.status === "success") {
        setSites(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch sites", err);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  /* ---------- INPUT HANDLER ---------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "category") {
      setForm({ ...form, category: value, subCategory: "" });
    } else if (name === "attachments") {
      setForm({ ...form, attachments: Array.from(files) });
    } else if (name === "date") {
      setForm({ ...form, date: formatDate(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ---------- TC SEARCH SELECT ---------- */
  const handleTcSelect = (option) => {
    if (!option) {
      setForm({
        ...form,
        tcCode: "",
        tcName: "",
        city: "",
        state: "",
        site: "",
      });
      return;
    }

    setForm({
      ...form,
      tcCode: option.value,
      tcName: option.tcName,
      city: option.city,
      state: option.state,
      site: `${option.state} | ${option.city} | ${option.value} | ${option.tcName}`,
    });
  };

  const tcOptions = sites.map((s) => ({
    value: String(s.tcCode),
    label: `${s.tcCode} | ${s.tcName} | ${s.city} | ${s.state}`,
    tcName: s.tcName,
    city: s.city,
    state: s.state,
  }));

  /* ---------- SUBMIT ---------- */
  const submitForm = async () => {
    if (!form.email || !form.tcCode) {
      alert("Email and TC Code are required");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem("support_email", form.email);

      const formData = new FormData();
      formData.append("action", "addTicket");
      formData.append("data", JSON.stringify(form));

      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.status === "success") {
        setSuccess(true);
        setForm(initialForm);
      } else {
        alert(result.message || "Submission failed");
      }
    } catch {
      alert("Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-left">
          <img
            src="https://ik.imagekit.io/wovz8p4ck/Logo%20and%20navbar/image%201.png"
            alt="Brisk Olive"
          />
        </div>
        <div className="nav-right">Support Portal</div>
      </header>

      <main className="page">
        {!success && (
          <div className="card vertical">
            <h2 className="page-title">Raise Support Ticket</h2>

            <div className="form-grid vertical-grid">
              <div className="form-group">
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Contact Person</label>
                <input name="contact" value={form.contact} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Date of Issue</label>
                <input
                  type="date"
                  defaultValue={todayISO}
                  name="date"
                  onChange={handleChange}
                />
                {form.date && <div className="muted">Date: {form.date}</div>}
              </div>

              <div className="form-group">
                <label>TC Code</label>
                <Select
                  options={tcOptions}
                  onChange={handleTcSelect}
                  placeholder="Search TC Code / City / State"
                  isClearable
                  isSearchable
                />
              </div>

              <div className="form-group">
                <label>TC Name</label>
                <input value={form.tcName} disabled />
              </div>

              <div className="form-group">
                <label>City</label>
                <input value={form.city} disabled />
              </div>

              <div className="form-group">
                <label>State</label>
                <input value={form.state} disabled />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sub-category</label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  disabled={!form.category}
                >
                  <option value="">Select</option>
                  {(subCategories[form.category] || []).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="">Select</option>
                  {priorityOptions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  rows="2"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>Attachments</label>
                <input type="file" multiple name="attachments" onChange={handleChange} />
              </div>
            </div>

            <div className="actions">
  <button className="btn-primary" onClick={submitForm} disabled={loading}>
    {loading ? (
      <span className="loader-inline">
        <span className="spinner" />
        Submitting…
      </span>
    ) : (
      "Submit Ticket"
    )}
  </button>
</div>

          </div>
        )}

        {success && (
          <div className="success-box">
            <h3>Please wait…</h3>
            <p>Your ticket has been successfully submitted.</p>
          </div>
        )}
      </main>
    </>
  );
}
