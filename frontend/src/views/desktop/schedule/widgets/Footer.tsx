import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '40px 20px 20px',
      color: '#666',
      fontSize: '14px',
      borderTop: '1px solid #f0f0f0',
      marginTop: '40px'
    }}>
      @{new Date().getFullYear()} Careviah, Inc. All rights reserved.
    </footer>
  );
};