import React from 'react';

interface ActionButtonsProps {
  onCancelClockIn: () => void;
  onClockOut: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancelClockIn, onClockOut }) => {
  return (
    <div className="action-buttons">
      <button className="action-btn btn-cancel" onClick={onCancelClockIn}>
        Cancel Clock-In
      </button>
      <button className="action-btn btn-complete" onClick={onClockOut}>
        Clock-Out
      </button>
    </div>
  );
};

export default ActionButtons;