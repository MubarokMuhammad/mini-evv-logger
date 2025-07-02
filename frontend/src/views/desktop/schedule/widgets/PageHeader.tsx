import React from 'react';

interface PageHeaderProps {
  onBack: () => void;
  title: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onBack, title }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '32px',
      gap: '16px'
    }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        ←
      </button>
      <h1 style={{
        margin: 0,
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a1a'
      }}>
        {title}
      </h1>
    </div>
  );
};