import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ClockOutHeaderProps {
  timer: string;
}

const ClockOutHeader: React.FC<ClockOutHeaderProps> = ({ timer }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ←
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '600',
          color: '#333'
        }}>
          Clock-Out
        </h1>
      </div>

      {/* Timer */}
      <div style={{
        textAlign: 'center',
        fontSize: '48px',
        fontWeight: '700',
        color: '#333',
        margin: '40px 0',
        letterSpacing: '2px'
      }}>
        {timer}
      </div>
    </>
  );
};

export default ClockOutHeader;