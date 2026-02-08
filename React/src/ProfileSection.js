// ProfileSection.js allows a user to set up their profile.

import React, { useState, useEffect } from "react";
import "./ProfileSection.css";
import { profileSectionGet, profileSectionPost } from "./ApiService";

function ProfileSection() {
  const [profile, setProfile] = useState({ name: "", role: "", company: "" });
  const [original, setOriginal] = useState({ name: "", role: "", company: "" });
  const [editing, setEditing] = useState({
    name: false,
    role: false,
    company: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dbFieldMap = {
    name: "name",
    role: "current_role",
    company: "current_company",
  };

  const labelMap = {
    name: "Name",
    role: "Current Role",
    company: "Current Company",
  };

  const placeholderMap = {
    name: "Add Name",
    role: "Add Current Role",
    company: "Add Current Company",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileSectionGet();

        setProfile({
          name: data.name || "",
          role: data.current_role || "",
          company: data.current_company || "",
        });
        setOriginal({
          name: data.name || "",
          role: data.current_role || "",
          company: data.current_company || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const startEdit = (field) => setEditing((s) => ({ ...s, [field]: true }));
  const cancelEdit = (field) => {
    setProfile((p) => ({ ...p, [field]: original[field] }));
    setEditing((s) => ({ ...s, [field]: false }));
  };

  const handleChange = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const saveField = async (field) => {
    try {
      setError(null);
      const dbField = dbFieldMap[field];
      await profileSectionPost(dbField, profile[field]);
      setOriginal((o) => ({ ...o, [field]: profile[field] }));
      setEditing((s) => ({ ...s, [field]: false }));
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    }
  };

  const clearField = async (field) => {
    try {
      setError(null);
      const dbField = dbFieldMap[field];
      setProfile((p) => ({ ...p, [field]: "" }));
      await profileSectionPost(dbField, "");
      setOriginal((o) => ({ ...o, [field]: "" }));
      setEditing((s) => ({ ...s, [field]: false }));
    } catch (err) {
      console.error(err);
      setError("Failed to clear field.");
    }
  };

  if (loading) {
    return (
      <div className="profile-section">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h3>Profile</h3>
      {error && <div className="alert alert-danger alert-sm">{error}</div>}

      {["name", "role", "company"].map((field) => (
        <div key={field} className="profile-row">
          <label>{labelMap[field]}:</label>

          {editing[field] ? (
            <input
              className="profile-input"
              value={profile[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholderMap[field]}
            />
          ) : (
            <span className="profile-value">
              {profile[field] || <em>{placeholderMap[field]}</em>}
            </span>
          )}

          <div className="profile-actions">
            {editing[field] ? (
              <>
                <button
                  className="btn-icon btn-save"
                  onClick={() => saveField(field)}
                  title="Save"
                >
                  ✓
                </button>
                <button
                  className="btn-icon btn-cancel"
                  onClick={() => cancelEdit(field)}
                  title="Cancel"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-icon btn-edit"
                  onClick={() => startEdit(field)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="btn-icon btn-clear"
                  onClick={() => clearField(field)}
                  title="Clear"
                >
                  ✖
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileSection;
