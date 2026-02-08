import React, { useState } from "react";
import "./AddContribution.css";
import { addContribution } from "./ApiService";

const CATEGORY_OPTIONS = [
  "Core Role / Job Performance",
  "Leadership / Ownership",
  "Cross-Team Collaboration",
  "Problem Solving / Innovation",
  "Client / Stakeholder Impact",
  "Process Improvement / Efficiency",
  "Mentoring / Knowledge Sharing",
];

export default function AddContribution() {
  const [form, setForm] = useState({
    title: "",
    what_happened: "",
    why_it_mattered: "",
    outcome_impact: "",
    categories: [],
    contribution_date: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCategoriesChange = (e) => {
    const options = Array.from(e.target.options || []);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setForm((p) => ({ ...p, categories: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      // payload keys match DB column names as requested
      const payload = { ...form };
      // send categories as JSON array; backend may accept this or convert to CSV
      await addContribution(payload);
      setStatus("success");
      setForm({
        title: "",
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        categories: [],
        contribution_date: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="card add-contribution mb-3">
      <div className="card-body">
        <h5 className="card-title">Add Contribution</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">What happened?</label>
            <textarea
              name="what_happened"
              className="form-control"
              value={form.what_happened}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Why it mattered?</label>
            <textarea
              name="why_it_mattered"
              className="form-control"
              value={form.why_it_mattered}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Outcome / impact</label>
            <textarea
              name="outcome_impact"
              className="form-control"
              value={form.outcome_impact}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Category</label>
            <select
              name="categories"
              multiple
              className="form-select"
              value={form.categories}
              onChange={handleCategoriesChange}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="form-text">Hold Ctrl (or Cmd) to select multiple.</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contribution date</label>
            <input
              type="date"
              name="contribution_date"
              className="form-control"
              value={form.contribution_date}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary me-2">
              Save
            </button>
            {status === "saving" && <small>Saving...</small>}
            {status === "success" && <small className="text-success"> Saved.</small>}
            {status === "error" && <small className="text-danger"> Error saving.</small>}
          </div>
        </form>
      </div>
    </div>
  );
}