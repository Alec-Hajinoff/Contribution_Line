import React, { useEffect, useState, useMemo } from "react";
import { contributionsTimeline } from "./ApiService";
import "./ContributionsTimeline.css";
import TimelineFilter from "./TimelineFilter";

const ContributionsTimeline = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    selectedCategories: [],
  });

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const data = await contributionsTimeline();
        setContributions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      selectedCategories: [],
    });
  };

  const filteredContributions = useMemo(() => {
    return contributions.filter((item) => {
      const itemDate = new Date(item.contribution_date);

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (itemDate < start) return false;
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        if (itemDate > end) return false;
      }

      if (filters.selectedCategories.length > 0) {
        const itemCategories = Array.isArray(item.categories)
          ? item.categories
          : JSON.parse(item.categories || "[]");

        const hasMatch = itemCategories.some((cat) =>
          filters.selectedCategories.includes(cat),
        );
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [contributions, filters]);

  const handleDownload = (fileData, fileName, mimeType) => {
    const linkSource = `data:${mimeType};base64,${fileData}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  if (loading)
    return <div className="text-center mt-5">Loading timeline...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="timeline-container">
      <h2 className="mb-4">Your Contributions</h2>

      <TimelineFilter
        filters={filters}
        setFilters={setFilters}
        onClear={handleClearFilters}
      />

      {filteredContributions.length === 0 ? (
        <p className="text-muted">
          No contributions match your current filters.
        </p>
      ) : (
        <div className="timeline">
          {filteredContributions.map((item) => (
            <div key={item.id} className="timeline-card card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h3 className="card-title h5 text-primary">{item.title}</h3>
                  <span className="badge bg-secondary">
                    {new Date(item.contribution_date).toLocaleDateString()}
                  </span>
                </div>

                {item.categories && (
                  <div className="mb-2">
                    {(Array.isArray(item.categories)
                      ? item.categories
                      : JSON.parse(item.categories || "[]")
                    ).map((cat, idx) => (
                      <span key={idx} className="badge bg-info text-dark me-1">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3">
                  <h6>
                    <strong>What Happened:</strong>
                  </h6>
                  <p className="card-text text-muted">{item.what_happened}</p>

                  <h6>
                    <strong>Why It Mattered:</strong>
                  </h6>
                  <p className="card-text text-muted">{item.why_it_mattered}</p>

                  <h6>
                    <strong>Outcome & Impact:</strong>
                  </h6>
                  <p className="card-text text-muted">{item.outcome_impact}</p>
                </div>

                {item.evidence_links && item.evidence_links.length > 0 && (
                  <div className="mt-3">
                    <h6>
                      <strong>Evidence Links:</strong>
                    </h6>
                    <ul className="list-unstyled">
                      {item.evidence_links.map((link) => (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {link.label || link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.files && item.files.length > 0 && (
                  <div className="mt-3">
                    <h6>
                      <strong>Attached Files:</strong>
                    </h6>
                    <ul className="list-unstyled">
                      {item.files.map((file) => (
                        <li key={file.id}>
                          <button
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={() =>
                              handleDownload(
                                file.file_data,
                                file.file_name,
                                file.mime_type,
                              )
                            }
                          >
                            {file.file_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="card-footer bg-transparent border-0 p-0 mt-3">
                  <small className="text-muted">
                    Created on: {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributionsTimeline;
