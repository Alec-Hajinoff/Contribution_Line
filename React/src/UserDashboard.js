import React from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";

function UserDashboard() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <h1>Welcome to your dashboard</h1>
    </div>
  );
}

export default UserDashboard;
