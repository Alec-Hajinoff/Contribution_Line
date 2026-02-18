import React, { useState } from "react";
import "./UserDashboard.css";
import LogoutComponent from "./LogoutComponent";
import AddContribution from "./AddContribution";
import ContributionsTimeline from "./ContributionsTimeline";

/**
 * UserDashboard - Parent component that manages the dashboard layout and state
 * Acts as the coordinator between AddContribution and ContributionsTimeline
 */
function UserDashboard() {
  // State to trigger refresh of the ContributionsTimeline component
  // When this value changes, the ContributionsTimeline component will remount
  // and fetch fresh data from the API
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Callback function passed to AddContribution component
   * Gets called when a new contribution is successfully added
   * Increments the refreshTrigger to force ContributionsTimeline to reload
   */
  const handleContributionAdded = () => {
    // Increment the trigger value - this changes the 'key' prop on ContributionsTimeline
    // React will see the key change and remount the component with fresh data
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <h1>Welcome to your dashboard</h1>

      <div className="row mt-4">
        <div className="col-md-4">
          {/* Pass the callback function as a prop to AddContribution */}
          <AddContribution onContributionAdded={handleContributionAdded} />
        </div>

        <div className="col-md-8">
          {/* 
            The 'key' prop is CRITICAL here:
            - When refreshTrigger changes, the key value changes
            - React detects this and unmounts/remounts the component
            - This triggers a fresh API call in ContributionsTimeline's useEffect
            - The new contribution appears immediately without browser refresh
          */}
          <ContributionsTimeline key={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
