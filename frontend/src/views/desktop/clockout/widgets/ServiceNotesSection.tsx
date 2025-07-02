import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface ServiceNotesSectionProps {
  schedule: Schedule;
}

const ServiceNotesSection: React.FC<ServiceNotesSectionProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '16px'
      }}>Service Notes:</h3>
      <p style={{
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#666',
        margin: 0
      }}>
        {schedule.serviceNotes || 'No service notes available.'}
      </p>
    </div>
  );
};

export default ServiceNotesSection;