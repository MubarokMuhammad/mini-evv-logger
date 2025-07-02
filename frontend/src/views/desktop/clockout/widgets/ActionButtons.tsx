import React from 'react';

interface ActionButtonsProps {
  onCancelClockIn: () => void;
  onClockOut: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancelClockIn, onClockOut }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginTop: '40px'
    }}>
      <button 
        onClick={onCancelClockIn}
        style={{
          padding: '16px 32px',
          borderRadius: '12px',
          border: '2px solid #dc3545',
          backgroundColor: 'white',
          color: '#dc3545',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '160px'
        }}
        onMouseEnter={e => {
          (e.target as HTMLElement).style.backgroundColor = '#dc3545';
          (e.target as HTMLElement).style.color = 'white';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.backgroundColor = 'white';
          (e.target as HTMLElement).style.color = '#dc3545';
        }}
      >
        Cancel Clock-In
      </button>
      <button 
        onClick={onClockOut}
        style={{
          padding: '16px 32px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: '#2c7873',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '160px'
        }}
        onMouseEnter={e => (e.target as HTMLElement).style.backgroundColor = '#1e5f5a'}
        onMouseLeave={e => (e.target as HTMLElement).style.backgroundColor = '#2c7873'}
      >
        Clock-Out
      </button>
    </div>
  );
};

export default ActionButtons;