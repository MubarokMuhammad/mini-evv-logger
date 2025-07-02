import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface ActiveVisitCardProps {
  activeVisit: Schedule | null;
  timer: string;
  onClockOut: (schedule: Schedule) => void;
}

const ActiveVisitCard: React.FC<ActiveVisitCardProps> = ({
  activeVisit,
  timer,
  onClockOut
}) => {
  if (!activeVisit) return null;

  return (
    <div className="desktop-active-visit">
      <div className="active-visit-content">
        <div className="timer-section">
          <div className="timer-display">{timer}</div>
        </div>
        <div className="visit-details">
          <div className="client-info">
            <img 
              src="/default-profile.png" 
              alt={activeVisit.clientName} 
              className="client-avatar"
            />
            <span className="client-name">{activeVisit.clientName}</span>
          </div>
          <div className="visit-location">
            <span className="location-icon">📍</span>
            <span className="location-text">
              {activeVisit.startLocation?.address || activeVisit.location?.address || 'Location not specified'}
            </span>
          </div>
          <div className="visit-time">
            <span className="time-icon">🕐</span>
            <span className="time-text">{activeVisit.startTime} - {activeVisit.endTime} SGT</span>
          </div>
        </div>
        <div className="visit-actions">
          <button 
            className="clock-out-btn"
            onClick={() => onClockOut(activeVisit)}
          >
            Clock Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveVisitCard;