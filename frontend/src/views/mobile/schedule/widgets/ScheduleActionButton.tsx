import React from 'react';

interface ScheduleActionButtonProps {
  status: string;
  clockingIn: boolean;
  onClockIn: () => void;
}

const ScheduleActionButton: React.FC<ScheduleActionButtonProps> = ({ 
  status, 
  clockingIn, 
  onClockIn 
}) => {
  if (status !== 'scheduled') {
    return null;
  }

  return (
    <button
      onClick={onClockIn}
      disabled={clockingIn}
      style={{
        width: '100%',
        backgroundColor: clockingIn ? '#ccc' : '#295C59',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: clockingIn ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!clockingIn) e.currentTarget.style.backgroundColor = '#1e4340';
      }}
      onMouseLeave={(e) => {
        if (!clockingIn) e.currentTarget.style.backgroundColor = '#295C59';
      }}
    >
      {clockingIn ? 'Getting Location...' : 'Clock-In Now'}
    </button>
  );
};

export default ScheduleActionButton;