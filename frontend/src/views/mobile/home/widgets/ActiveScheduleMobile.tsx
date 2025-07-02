import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../hooks/types';

interface ActiveScheduleMobileProps {
  activeVisit: Schedule;
  timer: string;
}

const ActiveScheduleMobile: React.FC<ActiveScheduleMobileProps> = ({ activeVisit, timer }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#295C59',
      borderRadius: '16px',
      padding: '16px',
      margin: '12px 0',
      color: 'white',
      position: 'relative'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '12px',
        letterSpacing: '1px'
      }}>
        {timer}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <img 
          src="/default-profile.png" 
          alt="Profile" 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            objectFit: 'cover'
          }}
        />
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '2px'
          }}>
            {activeVisit.clientName}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        fontSize: '12px',
        opacity: 0.9
      }}>
        <img 
          src="/pinMapsIcon.png" 
          alt="Location" 
          style={{
            width: '14px',
            height: '14px',
            marginRight: '6px',
            filter: 'brightness(0) invert(1)'
          }}
        />
        {activeVisit?.startLocation?.address || activeVisit?.location?.address || 'Current location'}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        fontSize: '12px',
        opacity: 0.9
      }}>
        <img 
          src="/timeIcon.png" 
          alt="Time" 
          style={{
            width: '14px',
            height: '14px',
            marginRight: '6px',
            filter: 'brightness(0) invert(1)'
          }}
        />
        {activeVisit.startTime} - {activeVisit.endTime} SGT
      </div>

      <button 
        onClick={() => navigate(`/schedules/clock-out/${activeVisit.id}`)}
        style={{
          backgroundColor: 'white',
          color: '#295C59',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          width: '100%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <img 
          src="/stopWatchIcon.png" 
          alt="Clock Out" 
          style={{
            width: '16px',
            height: '16px'
          }}
        />
        Clock-Out
      </button>
    </div>
  );
};

export default ActiveScheduleMobile;