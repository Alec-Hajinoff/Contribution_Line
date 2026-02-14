import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { presentationViewGet } from "./ApiService";
import "./PresentationView.css"; // Specialized container and print styles

const PresentationView = () => {
  // useParams extracts the :id defined in AppRoutes.js
  const { id } = useParams(); 
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calls the public API function (without credentials:include)
        const result = await presentationViewGet(id);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading presentation...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5 m-4">{error}</div>;
  }

  if (!data || !data.contributions || data.contributions.length === 0) {
    return <div className="text-center mt-5">No contributions found for this view.</div>;
  }

  return (
    <div className="presentation-container">
      {/* Header section for the Manager/Viewer */}
      <header className="presentation-header">
        <h1 className="presentation-title">
          {data.name || "Contribution Presentation"}
        </h1>
        <div className="presentation-metadata">
          <span>Prepared on: {new Date(data.created_at).toLocaleDateString()}</span>
        </div>
      </header>

      {/* Timeline section using the visual style from ContributionsTimeline.css */}
      <div className="timeline-container">
        {data.contributions.map((item) => (
          <div key={item.id} className="timeline-card card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h3 className="card-title h5 text-primary">{item.title}</h3>
                <span className="badge bg-secondary">
                  {new Date(item.contribution_date).toLocaleDateString()}
                </span>
              </div>

              {/* Displaying categories if they exist in the contribution record */}
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
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Print Action */}
      <div className="text-center mt-5 mb-5 d-print-none">
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => window.print()}
        >
          Download as PDF / Print
        </button>
      </div>
    </div>
  );
};

export default PresentationView;