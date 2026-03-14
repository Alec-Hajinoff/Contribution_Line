import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import { loginUser } from "./ApiService";

function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [unverifiedMessage, setUnverifiedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const clearUnverifiedMessageAfterDelay = () => {
    setTimeout(() => {
      setUnverifiedMessage("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setErrorMessage("");
    setUnverifiedMessage("");

    try {
      const data = await loginUser(formData);
      if (data.status === "success") {
        navigate("/UserDashboard");
      } else if (data.status === "unverified") {
        setUnverifiedMessage(data.message);
        clearUnverifiedMessageAfterDelay();
        setFormData({ email: "", password: "" });
      } else {
        setErrorMessage(data.message || "Sign in failed. Please try again.");
        clearErrorMessageAfterDelay();
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      setErrorMessage(error.message);
      clearErrorMessageAfterDelay();
      setFormData({ email: "", password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="row g-2" onSubmit={handleSubmit}>
      {unverifiedMessage && (
        <div className="alert alert-warning" role="alert">
          {unverifiedMessage}
        </div>
      )}

      <div className="form-group">
        <input
          autoComplete="off"
          type="email"
          pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
          className="form-control"
          id="yourEmailLogin"
          name="email"
          required
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          autoComplete="off"
          type="password"
          className="form-control"
          id="yourPasswordLogin"
          name="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div id="error-message-one" className="error" aria-live="polite">
        {errorMessage}
      </div>
      <button type="submit" className="btn btn-secondary" id="loginBtn">
        Login
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          id="spinnerLogin"
          style={{ display: loading ? "inline-block" : "none" }}
        ></span>
      </button>
      <div id="liveAlertPlaceholder"></div>
    </form>
  );
}

export default UserLogin;
