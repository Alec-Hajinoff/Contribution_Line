import React from "react";
import "./ContributionsEntry.css";
import LogoutComponent from "./LogoutComponent";

function ContributionsEntry() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <h1>Welcome to your dashboard</h1>
    </div>
  );
}

export default ContributionsEntry;
