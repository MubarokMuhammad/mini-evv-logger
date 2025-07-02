import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AllSchedulesHeaderProps {
  title?: string;
  loading?: boolean;
  error?: string | null;
}

const AllSchedulesHeader: React.FC<AllSchedulesHeaderProps> = ({ 
  title = 'All Schedules', 
  loading = false, 
  error = null 
}) => {
  const navigate = useNavigate();

  const getTitle = () => {
    if (loading) return 'Loading...';
    if (error) return `Error: ${error}`;
    return title;
  };

  return (
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
        {getTitle()}
      </h1>
    </div>
  );
};

export default AllSchedulesHeader;