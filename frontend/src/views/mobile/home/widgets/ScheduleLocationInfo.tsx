import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface ScheduleLocationInfoProps {
  schedule: Schedule;
}

const ScheduleLocationInfo: React.FC<ScheduleLocationInfoProps> = ({ schedule }) => {
  const getLocationAddress = () => {
    if (schedule.status === 'completed' && schedule.endLocation?.address) {
      return schedule.endLocation.address;
    }
    if (schedule.status === 'in-progress' && schedule.startLocation?.address) {
      return schedule.startLocation.address;
    }
    return schedule.location?.address || 'Location not specified';
  };

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
      {getLocationAddress()}
    </div>
  );
};

export default ScheduleLocationInfo;