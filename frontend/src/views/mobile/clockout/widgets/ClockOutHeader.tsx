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
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            position: 'absolute',
            left: '16px'
          }}
        >
          ←
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#333'
        }}>
          Clock-Out
        </h1>
      </div>

      {/* Timer */}
      <div style={{
        textAlign: 'center',
        fontSize: '32px',
        fontWeight: '700',
        color: '#333',
        margin: '30px 0',
        letterSpacing: '1px'
      }}>
        {timer}
      </div>
    </>
  );
};

export default ClockOutHeader;