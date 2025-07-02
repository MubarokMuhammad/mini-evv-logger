import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleStatusBadge from './ScheduleStatusBadge';

interface ScheduleCardHeaderProps {
  scheduleId: string;
  status: string;
}

const ScheduleCardHeader: React.FC<ScheduleCardHeaderProps> = ({ scheduleId, status }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    }}>
      <ScheduleStatusBadge status={status} />
      <span 
        style={{
          fontSize: '16px',
          color: '#212121',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
          transition: 'background-color 0.2s'
        }} 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/schedules/${scheduleId}`);
        }} 
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'} 
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        ⋯
      </span>
    </div>
  );
};

export default ScheduleCardHeader;