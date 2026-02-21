import React, { useState, useRef } from "react";
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

/**
 * AddContribution - Form component for adding new contributions
 * @param {Object} props - Component props
 * @param {Function} props.onContributionAdded - Callback function called after successful submission
 *                                               Notifies parent to refresh the timeline
 */
function AddContribution({ onContributionAdded }) {
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    what_happened: "",
    why_it_mattered: "",
    outcome_impact: "",
    categories: [],
    contribution_date: "",
    evidence_link: "",
    current_role: "",
    current_company: "",
  });

  const [status, setStatus] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      if (checked) {
        return { ...prev, categories: [...prev.categories, value] };
      } else {
        return {
          ...prev,
          categories: prev.categories.filter((cat) => cat !== value),
        };
      }
    });
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

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setStatus(null);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    if (!form.current_role.trim()) {
      alert("Please enter your current role.");
      return;
    }

    if (!form.current_company.trim()) {
      alert("Please enter your current company.");
      return;
    }

    setStatus("saving");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("what_happened", form.what_happened);
      formData.append("why_it_mattered", form.why_it_mattered);
      formData.append("outcome_impact", form.outcome_impact);
      formData.append("contribution_date", form.contribution_date);
      formData.append("current_role", form.current_role);
      formData.append("current_company", form.current_company);

      form.categories.forEach((cat) => formData.append("categories[]", cat));

      if (form.evidence_link) {
        formData.append("evidence_link", form.evidence_link);
      }

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
        evidence_link: "",
        current_role: "",
        current_company: "",
      });

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      clearSuccessMessage();

      if (onContributionAdded) {
        onContributionAdded();
      }
    } catch (err) {
      console.error(err);

      setStatus("error");
    }
  };

  return (
    <div className="card add-contribution mb-3">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="mb-2">
            <label className="form-label">Contribution title</label>
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

          <div className="mb-3">
            <label className="form-label d-block">
              Categories
            </label>
            <div className="mt-2">
              {CATEGORY_OPTIONS.map((category) => (
                <div key={category} className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`category-${category.replace(/\s+/g, "-")}`}
                    value={category}
                    checked={form.categories.includes(category)}
                    onChange={handleCategoryCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`category-${category.replace(/\s+/g, "-")}`}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>

            {form.categories.length === 0 && (
              <small className="text-muted">Select at least one category</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Evidence Link (URL)</label>
            <input
              type="url"
              name="evidence_link"
              placeholder="https://..."
              className="form-control"
              value={form.evidence_link}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Supporting file (PDF, JPG, PNG - Max 10MB)
            </label>
            <input
              type="file"
              ref={fileInputRef}
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

          <div className="mb-3">
            <label className="form-label">Current Role</label>
            <input
              type="text"
              name="current_role"
              className="form-control"
              value={form.current_role}
              onChange={handleChange}
              placeholder="e.g., Senior Developer, Product Manager"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Current Company</label>
            <input
              type="text"
              name="current_company"
              className="form-control"
              value={form.current_company}
              onChange={handleChange}
              placeholder="e.g., HSBC Bank"
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
      </div>
    </div>
  );
}

export default AddContribution;
