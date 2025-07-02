import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../hooks/types';

interface ScheduleActionButtonsProps {
  schedule: Schedule;
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
}

const ScheduleActionButtons: React.FC<ScheduleActionButtonsProps> = ({ schedule, onClockIn, onClockOut }) => {
  const navigate = useNavigate();

  const buttonBaseStyle = {
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#295C59',
    color: 'white',
    boxShadow: '0 1px 4px rgba(41, 92, 89, 0.2)'
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'transparent',
    color: '#295C59',
    border: '1px solid #295C59'
  };

  if (schedule.status === 'scheduled') {
    return (
      <div className="schedule-actions">
        <button 
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onClockIn(schedule.id);
          }}
          style={{
            ...primaryButtonStyle,
            width: '100%'
          }}
        >
          Clock-In Now
        </button>
      </div>
    );
  }

  if (schedule.status === 'in-progress') {
    return (
      <div className="schedule-actions">
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button 
            className="btn btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/schedules/${schedule.id}`);
            }}
            style={{
              ...secondaryButtonStyle,
              flex: 1
            }}
          >
            View Progress
          </button>
          <button 
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onClockOut(schedule);
            }}
            style={{
              ...primaryButtonStyle,
              flex: 1
            }}
          >
            Clock-Out Now
          </button>
        </div>
      </div>
    );
  }

  if (schedule.status === 'completed') {
    return (
      <div className="schedule-actions">
        <button 
          className="btn btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/schedules/${schedule.id}`);
          }}
          style={{
            ...secondaryButtonStyle,
            width: '100%'
          }}
        >
          View Report
        </button>
      </div>
    );
  }

  return null;
};

export default ScheduleActionButtons;