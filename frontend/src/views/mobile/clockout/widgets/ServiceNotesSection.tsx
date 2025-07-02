import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface ServiceNotesSectionProps {
  schedule: Schedule;
}

const ServiceNotesSection: React.FC<ServiceNotesSectionProps> = ({ schedule }) => {
  return (
    <div className="location-section">
      <h3>Service Notes:</h3>
      <p style={{ fontSize: '14px', lineHeight: '1.5', marginTop: '10px' }}>
        {schedule.serviceNotes}
      </p>
    </div>
  );
};

export default ServiceNotesSection;