import React from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import AddContribution from "./AddContribution";
import ProfileSection from "./ProfileSection";

function UserDashboard() {
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <h1>Welcome to your dashboard</h1>

      <div className="row mt-4">
        <div className="col-md-4">
          <AddContribution />
          <ProfileSection />
        </div>
        <div className="col-md-8"></div>
      </div>
    </div>
  );
}

export default UserDashboard;
