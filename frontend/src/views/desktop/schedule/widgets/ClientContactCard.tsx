import React from 'react';

interface ClientContactCardProps {
  clientEmail: string;
  clientPhone: string;
}

export const ClientContactCard: React.FC<ClientContactCardProps> = ({ clientEmail, clientPhone }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a1a'
      }}>
        Client Contact
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{ fontSize: '20px' }}>✉️</span>
          <span style={{ fontSize: '16px', color: '#666' }}>{clientEmail}</span>
        </div>
      </div>
      
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{ fontSize: '20px' }}>📞</span>
          <span style={{ fontSize: '16px', color: '#666' }}>{clientPhone}</span>
        </div>
      </div>
    </div>
  );
};