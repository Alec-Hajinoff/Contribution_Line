import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { presentationViewGet } from "./ApiService";
import "./PresentationView.css";

const PresentationView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await presentationViewGet(id);
        if (result.status === "success") {
          setData(result);
        } else {
          throw new Error(result.message || "Failed to load presentation.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading)
    return <div className="text-center mt-5">Loading presentation...</div>;
  if (error) return <div className="alert alert-danger mt-5 m-4">{error}</div>;

  return (
    <div className="presentation-container">
      <header className="presentation-header">
        <h1 className="presentation-title">
          {data.name || "Contribution Presentation"}
        </h1>
        <div className="presentation-metadata">
          <span>
            Prepared on: {new Date(data.created_at).toLocaleDateString()}
          </span>
        </div>
      </header>

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
                <div className="mt-3 pt-3 border-top">
                  <h6 className="text-dark small uppercase">
                    <strong>Evidence Links:</strong>
                  </h6>
                  <ul className="list-unstyled">
                    {item.evidence_links.map((link, idx) => (
                      <li key={idx} className="mb-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none small"
                        >
                          🔗 {link.label || link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.files && item.files.length > 0 && (
                <div className="mt-2">
                  <h6 className="text-dark small uppercase">
                    <strong>Attached Evidence:</strong>
                  </h6>
                  <div className="d-flex flex-wrap">
                    {item.files.map((file, idx) => (
                      <span
                        key={idx}
                        className="badge border text-secondary me-2 mb-2 p-2"
                      >
                        📄 {file.file_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5 mb-5 d-print-none">
        <button
          className="btn btn-primary px-4 shadow-sm"
          onClick={() => window.print()}
        >
          Print Presentation / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default PresentationView;
