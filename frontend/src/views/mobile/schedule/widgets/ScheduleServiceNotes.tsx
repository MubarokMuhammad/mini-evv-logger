import React from 'react';

interface ScheduleServiceNotesProps {
  serviceNotes: string;
}

const ScheduleServiceNotes: React.FC<ScheduleServiceNotesProps> = ({ serviceNotes }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #f5f5f5'
    }}>
      <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333'
      }}>
        Service Notes
      </h3>
      <p style={{
        margin: 0,
        fontSize: '13px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        {serviceNotes}
      </p>
    </div>
  );
};

export default ScheduleServiceNotes;