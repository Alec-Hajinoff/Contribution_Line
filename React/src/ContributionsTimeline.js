import React, { useEffect, useState } from "react";
import { contributionsTimeline } from "./ApiService";
import "./ContributionsTimeline.css";

const ContributionsTimeline = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading)
    return <div className="text-center mt-5">Loading timeline...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="timeline-container">
      <h2 className="mb-4">Your Contributions</h2>
      {contributions.length === 0 ? (
        <p className="text-muted">No contributions found. Start adding some!</p>
      ) : (
        <div className="timeline">
          {contributions.map((item) => (
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
