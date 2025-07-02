import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../../models/Schedule';

interface MobileScheduleActionButtonsProps {
  schedule: Schedule;
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
}

const MobileScheduleActionButtons: React.FC<MobileScheduleActionButtonsProps> = ({
  schedule,
  onClockIn,
  onClockOut
}) => {
  const navigate = useNavigate();

  const renderActionButtons = () => {
    switch (schedule.status) {
      case 'scheduled':
        return (
          <button 
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onClockIn(schedule.id);
            }}
            style={{
              backgroundColor: '#295C59',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 4px rgba(41, 92, 89, 0.2)'
            }}
          >
            Clock-In Now
          </button>
        );
      
      case 'in-progress':
        return (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button 
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/schedules/${schedule.id}`);
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#295C59',
                border: '1px solid #295C59',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                flex: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
                backgroundColor: '#295C59',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                flex: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 4px rgba(41, 92, 89, 0.2)'
              }}
            >
              Clock-Out Now
            </button>
          </div>
        );
      
      case 'completed':
        return (
          <button 
            className="btn btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/schedules/${schedule.id}`);
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#295C59',
              border: '1px solid #295C59',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            View Report
          </button>
        );
      
      case 'missed':
        return (
          <button 
            className="btn btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/schedules/${schedule.id}`);
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#295C59',
              border: '1px solid #295C59',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            View Details
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="schedule-actions">
      {renderActionButtons()}
    </div>
  );
};

export default MobileScheduleActionButtons;