import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../hooks/types';
import {
  ScheduleStatusBadge,
  ScheduleProfileSection,
  ScheduleLocationSection,
  ScheduleDateTimeSection,
  ScheduleActionButtons
} from './components';

interface ScheduleCardProps {
  schedule: Schedule;
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onClockIn,
  onClockOut,
  getStatusColor,
  getStatusText
}) => {
  const navigate = useNavigate();

  return (
    <div 
      key={schedule.id} 
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #f5f5f5',
        cursor: 'pointer'
      }} 
      onClick={() => navigate(`/schedules/${schedule.id}`)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <ScheduleStatusBadge
          status={schedule.status}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
        <span style={{
          fontSize: '16px',
          color: '#212121',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
          transition: 'background-color 0.2s'
        }} onClick={(e) => {
          e.stopPropagation();
          navigate(`/schedules/${schedule.id}`);
        }}>⋯</span>
      </div>
      
      <ScheduleProfileSection
        clientName={schedule.clientName}
        serviceName={schedule.serviceName}
      />

      <ScheduleLocationSection schedule={schedule} />

      <ScheduleDateTimeSection
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

export default ScheduleCard;