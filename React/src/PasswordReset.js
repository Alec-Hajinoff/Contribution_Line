import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserLogin.css";
import { passwordResetToken, updatePassword } from "./ApiService";

function PasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    checking: true,
    message: "",
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenStatus({
          isValid: false,
          checking: false,
          message:
            "This link may have expired or been used already. For your security, password reset links only work once and for a limited time.\n\nIf you need help, you can reach our support team@contributionline.com.",
        });
        return;
      }

      try {
        const data = await passwordResetToken(token);

        if (data.valid) {
          setTokenStatus({
            isValid: true,
            checking: false,
            message: "",
          });
        } else {
          setTokenStatus({
            isValid: false,
            checking: false,
            message:
              data.message ||
              "This link may have expired or been used already. For your security, password reset links only work once and for a limited time.\n\nIf you need help, you can reach our support team@contributionline.com.",
          });
        }
      } catch (error) {
        setTokenStatus({
          isValid: false,
          checking: false,
          message:
            "This link may have expired or been used already. For your security, password reset links only work once and for a limited time.\n\nIf you need help, you can reach our support team@contributionline.com.",
        });
      }
    };

    verifyToken();
  }, [token]);

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
    }, 5000);
  };

  const clearSuccessMessageAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      clearErrorMessageAfterDelay();
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      clearErrorMessageAfterDelay();
      setLoading(false);
      return;
    }

    try {
      const data = await updatePassword(token, formData.newPassword);

      if (data.success) {
        setSuccessMessage(
          "Your password has been updated.\nYou can now sign in using your new credentials.",
        );
        clearSuccessMessageAfterDelay();

        setFormData({
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setErrorMessage(
          data.message || "Failed to update password. Please try again.",
        );
        clearErrorMessageAfterDelay();
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      clearErrorMessageAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (tokenStatus.checking) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Verifying your link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenStatus.isValid) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div
                  className="alert alert-danger"
                  role="alert"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {tokenStatus.message}
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={handleReturnHome}
                    className="btn btn-secondary"
                  >
                    Return to home page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Reset Your Password</h2>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-3">
                  <input
                    autoComplete="off"
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    required
                    minLength="8"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <input
                    autoComplete="off"
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength="8"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div
                    className="alert alert-success"
                    role="alert"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {successMessage}
                    <div className="mt-3">
                      <button
                        onClick={handleReturnHome}
                        className="btn btn-secondary btn-sm"
                      >
                        Return to home page
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-secondary w-100"
                  disabled={loading || successMessage}
                >
                  Update password
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
