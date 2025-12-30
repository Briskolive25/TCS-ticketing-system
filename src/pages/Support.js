import React, { useState } from "react";
import "./RaiseTicket.css";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRsnyvSnbmwB6MdHqjmQsKpFtoFPZ5nqtDAkrKkmmRWZ07gSWkgy4Jj85grIeMnRwz/exec";

export default function RaiseTicket({ onSubmit }) {
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

  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    description: "",
    site: "",
    date: "",
    priority: "",
    contact: "",
    email: "",
    phone: "",
    attachments: [],
    status: "Open",
  });

  // Function to format date as DD MMM YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options); // e.g., 28 Dec 2025
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "category") {
      setForm({ ...form, category: value, subCategory: "" });
    } else if (name === "attachments") {
      setForm({ ...form, attachments: Array.from(files) });
    } else if (name === "date") {
      setForm({ ...form, date: formatDate(value) }); // format date
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submitForm = async () => {
    try {
      const formData = new FormData();
      formData.append("action", "addTicket");
      formData.append("data", JSON.stringify(form));

      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.status === "success") {
        alert("Ticket Raised Successfully!");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Submission Failed");
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Brisk olive Support</h2>

      <div className="card">
        <div className="form-grid">
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

          <div className="form-group full">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
          </div>

          <div className="form-group">
            <label>Site / Center</label>
            <input name="site" value={form.site} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Date of Issue</label>
            <input type="date" onChange={handleChange} name="date" />
            {form.date && <div style={{ marginTop: "5px" }}>Date: {form.date}</div>}
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

          <div className="form-group">
            <label>Contact Person</label>
            <input name="contact" value={form.contact} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group full">
            <label>Attachments</label>
            <input type="file" multiple name="attachments" onChange={handleChange} />
          </div>
        </div>

        <div className="actions">
          <button className="btn-primary" onClick={submitForm}>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
