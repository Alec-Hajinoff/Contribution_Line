import React from "react";
import "./TimelineFilter.css";

const CATEGORY_OPTIONS = [
  "Core Role / Job Performance",
  "Leadership / Ownership",
  "Cross-Team Collaboration",
  "Problem Solving / Innovation",
  "Client / Stakeholder Impact",
  "Process Improvement / Efficiency",
  "Mentoring / Knowledge Sharing",
];

const TimelineFilter = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setFilters((prev) => ({ ...prev, selectedCategories: selected }));
  };

  return (
    <div className="card mb-4 shadow-sm border-primary">
      <div className="card-body">
        <h5 className="card-title h6 mb-3">Filter Contributions</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label small">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control form-control-sm"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control form-control-sm"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small">
              Categories (Select multiple)
            </label>
            <select
              multiple
              className="form-select form-select-sm"
              value={filters.selectedCategories}
              onChange={handleCategoriesChange}
              style={{ height: "80px" }}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-link btn-sm text-muted text-decoration-none"
            onClick={onClear}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineFilter;
