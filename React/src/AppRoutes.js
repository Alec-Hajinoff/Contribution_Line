import { Routes, Route } from "react-router-dom";
import MainRegLog from "./MainRegLog";
import RegisteredPage from "./RegisteredPage";
import ContributionsEntry from "./ContributionsEntry";
import LogoutComponent from "./LogoutComponent";
import React from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainRegLog />} />
      <Route path="RegisteredPage" element={<RegisteredPage />} />
      <Route path="ContributionsEntry" element={<ContributionsEntry />} />
      <Route path="LogoutComponent" element={<LogoutComponent />} />
    </Routes>
  );
}
