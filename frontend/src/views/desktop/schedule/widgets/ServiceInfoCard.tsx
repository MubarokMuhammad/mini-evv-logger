import React from 'react';

interface Schedule {
  serviceName: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface ServiceInfoCardProps {
  schedule: Schedule;
}

export const ServiceInfoCard: React.FC<ServiceInfoCardProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    }}>
      <h2 style={{
        margin: '0 0 20px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center'
      }}>
        {schedule.serviceName}
      </h2>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#e0e0e0',
          backgroundImage: 'url(/default-profile.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        <span style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          {schedule.clientName}
        </span>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#e3f2fd',
          padding: '12px 20px',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <img src="/dateCardIcon.png" alt="Date" style={{ width: '20px', height: '20px' }} />
            <span style={{ fontSize: '16px', color: '#1976d2', fontWeight: '600' }}>{schedule.date}</span>
          </div>
          <span style={{ fontSize: '16px', color: '#1976d2', opacity: 0.7 }}>|</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <img src="/timeCardIcon.png" alt="Time" style={{ width: '20px', height: '20px' }} />
            <span style={{ fontSize: '16px', color: '#1976d2', fontWeight: '600' }}>
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};