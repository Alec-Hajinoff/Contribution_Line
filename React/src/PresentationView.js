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

  const downloadFile = (base64Data, fileName, mimeType) => {
    try {
      if (!base64Data) {
        console.error("No file data available");
        alert("File data is missing");
        return;
      }

      const byteCharacters = atob(base64Data); // atob() decodes base64 to binary, but represented as a string.
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i); // charCodeAt() returns a character at a given location.
      }

      const byteArray = new Uint8Array(byteNumbers); // Uint8Array() converts to byte array to work with Blobs.
      const blob = new Blob([byteArray], {
        // Blob() is a browser API to handle BLOB data.
        type: mimeType || "application/octet-stream", // Here we tell the browser what type of file this is.
      });

      const url = window.URL.createObjectURL(blob); // Create a temporary URL.
      const link = document.createElement("a"); // Create a download link.
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

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
          <span>Prepared on: {new Date().toLocaleDateString()}</span>
        </div>
      </header>

      <div className="timeline-container">
        {data.contributions.map((item) => (
          <div key={item.id} className="timeline-card card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h3 className="card-title h5 text-primary">{item.title}</h3>
                <div className="text-end">
                  <span className="badge bg-secondary d-block mb-1">
                    Event:{" "}
                    {new Date(item.contribution_date).toLocaleDateString()}
                  </span>

                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
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
              </div>

              {item.evidence_links && item.evidence_links.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-dark small">
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
                  <h6 className="text-dark small">
                    <strong>Attached Evidence (Click to download):</strong>
                  </h6>
                  <div className="d-flex flex-wrap">
                    {item.files.map((file, idx) => (
                      <button
                        key={idx}
                        className="btn btn-link p-0 me-3 text-decoration-none small text-dark d-flex align-items-center"
                        style={{ textAlign: "left" }}
                        onClick={() =>
                          downloadFile(
                            file.file_data,
                            file.file_name,
                            file.mime_type,
                          )
                        }
                      >
                        <span className="badge border text-secondary p-2">
                          <span role="img" aria-label="document">
                            📄
                          </span>{" "}
                          {file.file_name}
                        </span>
                      </button>
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
