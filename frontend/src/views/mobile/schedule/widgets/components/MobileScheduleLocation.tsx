import React from 'react';
import { Schedule } from '../../../../../models/Schedule';

interface MobileScheduleLocationProps {
  schedule: Schedule;
  getLocationText: (schedule: Schedule) => string;
}

const MobileScheduleLocation: React.FC<MobileScheduleLocationProps> = ({ 
  schedule, 
  getLocationText 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      color: '#666',
      fontSize: '12px',
      marginBottom: '6px',
      fontWeight: '500'
    }}>
      <img 
        src="/pinMapCardIcon.png" 
        alt="Location" 
        style={{
          width: '14px',
          height: '14px',
          marginRight: '6px'
        }}
      />
      {getLocationText(schedule)}
    </div>
  );
};

export default MobileScheduleLocation;