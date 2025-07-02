import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  showBackButton?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#ff4757',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          !
        </div>
        
        <h3 style={{
          margin: '0 0 12px',
          color: '#333',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Oops! Something went wrong
        </h3>
        
        <p style={{
          margin: '0 0 24px',
          color: '#666',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {error}
        </p>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
              }}
            >
              Try Again
            </button>
          )}
          
          {showBackButton && (
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#545b62';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#6c757d';
              }}
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;