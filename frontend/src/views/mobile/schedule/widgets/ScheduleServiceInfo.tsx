import React from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Schedule {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: Location;
  status: string;
}

interface ScheduleServiceInfoProps {
  schedule: Schedule;
}

const ScheduleServiceInfo: React.FC<ScheduleServiceInfoProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '16px',
      marginBottom: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #f5f5f5'
    }}>
      <h2 style={{
        margin: '0 0 10px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
      }}>
        {schedule.serviceName}
      </h2>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e0e0e0',
          backgroundImage: 'url(/default-profile.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          {schedule.clientName}
        </span>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#e3f2fd',
          padding: '8px 16px',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <img src="/dateCardIcon.png" alt="Date" style={{ width: '16px', height: '16px' }} />
            <span style={{ fontSize: '14px', color: '#1976d2' }}>{schedule.date}</span>
          </div>
          <span style={{ fontSize: '14px', color: '#1976d2', opacity: 0.7 }}>|</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <img src="/timeCardIcon.png" alt="Time" style={{ width: '16px', height: '16px' }} />
            <span style={{ fontSize: '14px', color: '#1976d2' }}>
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleServiceInfo;