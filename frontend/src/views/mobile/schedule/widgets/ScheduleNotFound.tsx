import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          📅
        </div>
        <h2 style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '12px',
          fontWeight: '600'
        }}>
          Schedule Not Found
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          The schedule you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#295C59',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e4340';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#295C59';
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ScheduleNotFound;