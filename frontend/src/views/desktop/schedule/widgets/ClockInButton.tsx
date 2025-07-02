import React from 'react';

interface ClockInButtonProps {
  onClockIn: () => void;
  clockingIn: boolean;
}

export const ClockInButton: React.FC<ClockInButtonProps> = ({ onClockIn, clockingIn }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '32px'
    }}>
      <button
        onClick={onClockIn}
        disabled={clockingIn}
        style={{
          backgroundColor: clockingIn ? '#ccc' : '#295C59',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 48px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: clockingIn ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
          minWidth: '200px'
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
    </div>
  );
};