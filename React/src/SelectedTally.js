import React from "react";
import "./SelectedTally.css";

const SelectedTally = ({ count, onDisplay, onCancel }) => {
  return (
    <div className="selected-tally-bar">
      <div className="mb-2">{count} selected</div>

      <div className="selected-tally-buttons">
        <button className="btn btn-secondary w-100 mb-2" onClick={onDisplay}>
          Display presentation view
        </button>

        <button className="btn btn-danger w-100" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SelectedTally;
