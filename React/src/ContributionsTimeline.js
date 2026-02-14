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
                  <div className="d-flex justify-content-between align-items-center mt-3">
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
