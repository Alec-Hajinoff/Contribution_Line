import React, { useEffect, useState, useMemo } from "react";
import { contributionsTimeline } from "./ApiService";
import "./ContributionsTimeline.css";
import TimelineFilter from "./TimelineFilter";
import SelectedTally from "./SelectedTally";
import { presentationViewPost } from "./ApiService";

const ContributionsTimeline = () => {
  const [contributions, setContributions] = useState([]);
  const [selectedContributions, setSelectedContributions] = useState([]);
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
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      const dateMatch =
        (!start || itemDate >= start) && (!end || itemDate <= end);

      const itemCats = Array.isArray(item.categories)
        ? item.categories
        : JSON.parse(item.categories || "[]");

      const catMatch =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.some((cat) => itemCats.includes(cat));

      return dateMatch && catMatch;
    });
  }, [contributions, filters]);

  const handleAddToPresentation = (contribution) => {
    if (!selectedContributions.find((c) => c.id === contribution.id)) {
      setSelectedContributions([...selectedContributions, contribution]);
    }
  };

  const handleDisplayPresentation = async () => {
    if (selectedContributions.length === 0) {
      alert("Please select at least one contribution.");
      return;
    }

    try {
      const ids = selectedContributions.map((c) => c.id);
      const data = await presentationViewPost(ids);

      if (data.status === "success") {
        const url = `/PresentationView/${data.id}`;
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Presentation Error:", err);
    }
  };

  const downloadFile = (base64Data, fileName, mimeType) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <TimelineFilter
        filters={filters}
        setFilters={setFilters}
        onClear={handleClearFilters}
      />

      {selectedContributions.length > 0 && (
        <SelectedTally
          count={selectedContributions.length}
          onDisplay={handleDisplayPresentation}
        />
      )}

      {filteredContributions.length === 0 ? (
        <p>No contributions match your filters.</p>
      ) : (
        <div className="timeline-container">
          {filteredContributions.map((item) => (
            <div key={item.id} className="timeline-card card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h3 className="card-title h5 text-primary">{item.title}</h3>
                  <div className="text-end">
                    <span className="badge bg-secondary d-block mb-1">
                      Event:{" "}
                      {new Date(item.contribution_date).toLocaleDateString()}
                    </span>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Logged: {new Date(item.created_at).toLocaleDateString()}
                    </small>
                  </div>
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

                  {item.evidence_links && item.evidence_links.length > 0 && (
                    <div className="mt-3">
                      <h6 className="mb-1">
                        <strong>Links:</strong>
                      </h6>
                      <ul className="list-unstyled mb-0">
                        {item.evidence_links.map((link, idx) => (
                          <li key={idx}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none small"
                            >
                              <span role="img" aria-label="link">
                                🔗
                              </span>{" "}
                              {link.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.files && item.files.length > 0 && (
                    <div className="mt-3">
                      <h6 className="mb-1">
                        <strong>Attachments:</strong>
                      </h6>
                      <div className="d-flex flex-wrap">
                        {item.files.map((file, idx) => (
                          <button
                            key={idx}
                            className="btn btn-link p-0 me-3 text-decoration-none small text-dark"
                            onClick={() =>
                              downloadFile(
                                file.file_data,
                                file.file_name,
                                file.mime_type,
                              )
                            }
                          >
                            <span role="img" aria-label="document">
                              📄
                            </span>{" "}
                            {file.file_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-top">
                    <div className="d-flex gap-3 small text-muted">
                      {item.current_role && (
                        <span>
                          <strong>Role:</strong> {item.current_role}
                        </span>
                      )}
                      {item.current_company && (
                        <span>
                          <strong>Company:</strong> {item.current_company}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div></div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleAddToPresentation(item)}
                    >
                      Add to presentation view
                    </button>
                  </div>
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
