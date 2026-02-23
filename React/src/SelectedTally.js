import React from "react";
import "./SelectedTally.css";

const SelectedTally = ({ count, onDisplay }) => {
  return (
    <div className="selected-tally-bar">
      <div className="mb-2">{count} selected</div>
      <button className="btn btn-secondary w-100" onClick={onDisplay}>
        Display presentation view
      </button>
    </div>
  );
};

export default SelectedTally;
