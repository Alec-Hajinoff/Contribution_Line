import React from "react";
import "./PullReadings.css";
import LogoutComponent from "./LogoutComponent";

function PullReadings() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <h1>Welcome to your dashboard</h1>
    </div>
  );
}

export default PullReadings;
