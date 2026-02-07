import React, { useState, useEffect } from "react";
import "./ProfileSection.css";
import { profileSection } from "./ApiService";

function ProfileSection() {
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    company: "",
  });

  const [editing, setEditing] = useState({
    name: false,
    role: false,
    company: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileSection("GET");
        setProfile({
          name: data.name || "",
          role: data.role || "",
          company: data.company || "",
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle field change
  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle edit mode
  const toggleEdit = (field) => {
    setEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Save field to backend
  const saveField = async (field) => {
    try {
      setError(null);
      await profileSection("POST", { field, value: profile[field] });
      toggleEdit(field);
    } catch (err) {
      setError("Failed to save changes");
      console.error(err);
    }
  };

  // Delete field (clear value)
  const deleteField = async (field) => {
    try {
      setError(null);
      setProfile((prev) => ({
        ...prev,
        [field]: "",
      }));
      await profileSection("POST", { field, value: "" });
      toggleEdit(field);
    } catch (err) {
      setError("Failed to delete field");
      console.error(err);
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

      {/* Name */}
      <div className="profile-row">
        <label>Name:</label>
        {editing.name ? (
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Add name"
            className="profile-input"
          />
        ) : (
          <span className="profile-value">
            {profile.name || <em>Add name</em>}
          </span>
        )}
        <div className="profile-actions">
          {editing.name ? (
            <>
              <button
                className="btn-icon btn-save"
                onClick={() => saveField("name")}
                title="Save"
              >
                ✓
              </button>
              <button
                className="btn-icon btn-cancel"
                onClick={() => {
                  toggleEdit("name");
                  setProfile((prev) => ({
                    ...prev,
                    name: profile.name,
                  }));
                }}
                title="Cancel"
              >
                ✕
              </button>
            </>
          ) : (
            <button
              className="btn-icon btn-edit"
              onClick={() => toggleEdit("name")}
              title="Edit"
            >
              ✎
            </button>
          )}
        </div>
      </div>

      {/* Role */}
      <div className="profile-row">
        <label>Role:</label>
        {editing.role ? (
          <input
            type="text"
            value={profile.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Add role"
            className="profile-input"
          />
        ) : (
          <span className="profile-value">
            {profile.role || <em>Add role</em>}
          </span>
        )}
        <div className="profile-actions">
          {editing.role ? (
            <>
              <button
                className="btn-icon btn-save"
                onClick={() => saveField("role")}
                title="Save"
              >
                ✓
              </button>
              <button
                className="btn-icon btn-cancel"
                onClick={() => {
                  toggleEdit("role");
                  setProfile((prev) => ({
                    ...prev,
                    role: profile.role,
                  }));
                }}
                title="Cancel"
              >
                ✕
              </button>
            </>
          ) : (
            <button
              className="btn-icon btn-edit"
              onClick={() => toggleEdit("role")}
              title="Edit"
            >
              ✎
            </button>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="profile-row">
        <label>Company:</label>
        {editing.company ? (
          <input
            type="text"
            value={profile.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Add company"
            className="profile-input"
          />
        ) : (
          <span className="profile-value">
            {profile.company || <em>Add company</em>}
          </span>
        )}
        <div className="profile-actions">
          {editing.company ? (
            <>
              <button
                className="btn-icon btn-save"
                onClick={() => saveField("company")}
                title="Save"
              >
                ✓
              </button>
              <button
                className="btn-icon btn-cancel"
                onClick={() => {
                  toggleEdit("company");
                  setProfile((prev) => ({
                    ...prev,
                    company: profile.company,
                  }));
                }}
                title="Cancel"
              >
                ✕
              </button>
            </>
          ) : (
            <button
              className="btn-icon btn-edit"
              onClick={() => toggleEdit("company")}
              title="Edit"
            >
              ✎
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;