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

function AddContribution() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    what_happened: "",
    why_it_mattered: "",
    outcome_impact: "",
    categories: [],
    contribution_date: "",
    evidence_links: [{ url: "", label: "" }],
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setForm((prev) => ({ ...prev, categories: selected }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        e.target.value = null;
        return;
      }

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF, JPG, and PNG files are allowed.");
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...form.evidence_links];
    updatedLinks[index][field] = value;
    setForm({ ...form, evidence_links: updatedLinks });
  };

  const addLinkField = () => {
    setForm({
      ...form,
      evidence_links: [...form.evidence_links, { url: "", label: "" }],
    });
  };

  const removeLinkField = (index) => {
    const updatedLinks = form.evidence_links.filter((_, i) => i !== index);
    setForm({ ...form, evidence_links: updatedLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("what_happened", form.what_happened);
      formData.append("why_it_mattered", form.why_it_mattered);
      formData.append("outcome_impact", form.outcome_impact);
      formData.append("contribution_date", form.contribution_date);

      form.categories.forEach((cat) => formData.append("categories[]", cat));

      formData.append("evidence_links", JSON.stringify(form.evidence_links));

      if (file) {
        formData.append("file", file);
      }

      await addContribution(formData);
      setStatus("success");

      setForm({
        title: "",
        what_happened: "",
        why_it_mattered: "",
        outcome_impact: "",
        categories: [],
        contribution_date: "",
        evidence_links: [{ url: "", label: "" }],
      });
      setFile(null);

      setTimeout(() => setIsOpen(false), 1500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const toggleForm = () => setIsOpen(!isOpen);

  return (
    <div className="card add-contribution mb-3">
      <div className="card-body">
        <button
          type="button"
          className="btn btn-outline-primary toggle-button"
          onClick={toggleForm}
        >
          {isOpen ? "▼ Hide Form" : "▶ Add a contribution"}
        </button>

        {isOpen && (
          <form onSubmit={handleSubmit} className="form-container">
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                type="text"
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
                required
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
            </div>

            <div className="mb-3">
              <label className="form-label">Evidence Links</label>
              {form.evidence_links.map((link, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="url"
                    placeholder="URL (https://...)"
                    className="form-control"
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Label (optional)"
                    className="form-control"
                    value={link.label}
                    onChange={(e) =>
                      handleLinkChange(index, "label", e.target.value)
                    }
                  />
                  {form.evidence_links.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeLinkField(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={addLinkField}
              >
                + Add another link
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Support File (PDF, JPG, PNG - Max 10MB)
              </label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contribution date</label>
              <input
                type="date"
                name="contribution_date"
                className="form-control"
                value={form.contribution_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary me-2">
                Save
              </button>
              {status === "saving" && <small>Saving...</small>}
              {status === "success" && (
                <small className="text-success"> Saved successfully.</small>
              )}
              {status === "error" && (
                <small className="text-danger"> Error saving.</small>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddContribution;
