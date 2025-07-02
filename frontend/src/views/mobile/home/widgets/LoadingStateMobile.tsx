import React from 'react';

interface LoadingStateMobileProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingStateMobile: React.FC<LoadingStateMobileProps> = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="app" style={{ paddingBottom: '80px' }}>
        <div className="header">
          <h1 className="welcome-text">Welcome Louis!</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app" style={{ paddingBottom: '80px' }}>
        <div className="header">
          <h1 className="welcome-text">Welcome Louis!</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'red' }}>
          <div>Error: {error}</div>
          <button onClick={onRetry} style={{ marginTop: '10px', padding: '8px 16px' }}>Retry</button>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingStateMobile;