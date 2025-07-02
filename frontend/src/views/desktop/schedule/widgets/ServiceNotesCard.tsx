import React from 'react';

interface ServiceNotesCardProps {
  serviceNotes: string;
}

export const ServiceNotesCard: React.FC<ServiceNotesCardProps> = ({ serviceNotes }) => {
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
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a1a'
      }}>
        Service Notes
      </h3>
      <p style={{
        margin: 0,
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.5'
      }}>
        {serviceNotes}
      </p>
    </div>
  );
};