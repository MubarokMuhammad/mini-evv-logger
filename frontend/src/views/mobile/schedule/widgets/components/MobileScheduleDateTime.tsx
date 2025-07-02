import React from 'react';

interface MobileScheduleDateTimeProps {
  date: string;
  startTime: string;
  endTime: string;
}

const MobileScheduleDateTime: React.FC<MobileScheduleDateTimeProps> = ({ 
  date, 
  startTime, 
  endTime 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f0f9ff',
      padding: '8px 12px',
      borderRadius: '8px',
      marginBottom: '10px',
      gap: '16px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        color: '#0891b2',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        <img 
          src="/dateCardIcon.png" 
          alt="Date" 
          style={{
            width: '14px',
            height: '14px',
            marginRight: '6px'
          }}
        />
        {date}
      </div>
      <div style={{
        width: '1px',
        height: '16px',
        backgroundColor: '#cbd5e1'
      }}></div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        color: '#0891b2',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        <img 
          src="/timeCardIcon.png" 
          alt="Time" 
          style={{
            width: '14px',
            height: '14px',
            marginRight: '6px'
          }}
        />
        {startTime} - {endTime}
      </div>
    </div>
  );
};

export default MobileScheduleDateTime;