import { Routes, Route } from "react-router-dom";
import MainRegLog from "./MainRegLog";
import RegisteredPage from "./RegisteredPage";
import UserDashboard from "./UserDashboard";
import LogoutComponent from "./LogoutComponent";
import PresentationView from "./PresentationView"; // New Component
import React from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainRegLog />} />
      <Route path="/RegisteredPage" element={<RegisteredPage />} />
      <Route path="/UserDashboard" element={<UserDashboard />} />
      <Route path="/LogoutComponent" element={<LogoutComponent />} />
      {/* Dynamic route using :id to capture the presentation_view primary key */}
      <Route path="/PresentationView/:id" element={<PresentationView />} />
    </Routes>
  );
}

/*
import { Routes, Route } from "react-router-dom";
import MainRegLog from "./MainRegLog";
import RegisteredPage from "./RegisteredPage";
import UserDashboard from "./UserDashboard";
import LogoutComponent from "./LogoutComponent";
import React from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainRegLog />} />
      <Route path="RegisteredPage" element={<RegisteredPage />} />
      <Route path="UserDashboard" element={<UserDashboard />} />
      <Route path="LogoutComponent" element={<LogoutComponent />} />
    </Routes>
  );
}
*/
