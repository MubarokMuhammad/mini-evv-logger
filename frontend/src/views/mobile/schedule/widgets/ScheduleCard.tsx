import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../models/Schedule';
import {
  MobileScheduleStatusBadge,
  MobileScheduleMenuButton,
  MobileScheduleClientInfo,
  MobileScheduleLocation,
  MobileScheduleDateTime,
  MobileScheduleActionButtons
} from './components';

interface ScheduleCardProps {
  schedule: Schedule;
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
  getLocationText: (schedule: Schedule) => string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onClockIn,
  onClockOut,
  getLocationText
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f0f0f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={() => navigate(`/schedules/${schedule.id}`)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <MobileScheduleStatusBadge status={schedule.status} />
        <MobileScheduleMenuButton scheduleId={schedule.id} />
      </div>

      <MobileScheduleClientInfo 
        clientName={schedule.clientName} 
        serviceName={schedule.serviceName} 
      />

      <MobileScheduleLocation 
        schedule={schedule} 
        getLocationText={getLocationText} 
      />

      <MobileScheduleDateTime 
        date={schedule.date}
        startTime={schedule.startTime}
        endTime={schedule.endTime}
      />

      <MobileScheduleActionButtons 
        schedule={schedule}
        onClockIn={onClockIn}
        onClockOut={onClockOut}
      />
    </div>
  );
};

export default ScheduleCard;