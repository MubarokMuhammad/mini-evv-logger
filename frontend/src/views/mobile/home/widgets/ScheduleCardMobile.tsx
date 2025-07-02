import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../hooks/types';
import ScheduleCardHeader from './ScheduleCardHeader';
import ScheduleClientInfo from './ScheduleClientInfo';
import ScheduleLocationInfo from './ScheduleLocationInfo';
import ScheduleDateTimeInfo from './ScheduleDateTimeInfo';
import ScheduleActionButtons from './ScheduleActionButtons';

interface ScheduleCardMobileProps {
  schedule: Schedule;
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
}

const ScheduleCardMobile: React.FC<ScheduleCardMobileProps> = ({ schedule, onClockIn, onClockOut }) => {
  const navigate = useNavigate();

  return (
    <div 
      key={schedule.id} 
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #f5f5f5',
        cursor: 'pointer'
      }} 
      onClick={() => navigate(`/schedules/${schedule.id}`)}
    >
      <ScheduleCardHeader 
        scheduleId={schedule.id} 
        status={schedule.status} 
      />
      
      <ScheduleClientInfo 
        clientName={schedule.clientName} 
        serviceName={schedule.serviceName} 
      />

      <ScheduleLocationInfo schedule={schedule} />

      <ScheduleDateTimeInfo 
        date={schedule.date}
        startTime={schedule.startTime}
        endTime={schedule.endTime}
      />

      <ScheduleActionButtons 
        schedule={schedule}
        onClockIn={onClockIn}
        onClockOut={onClockOut}
      />
    </div>
  );
};

export default ScheduleCardMobile;