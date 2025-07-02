import React from 'react';

interface ScheduleDateTimeSectionProps {
  date: string;
  startTime: string;
  endTime: string;
}

const ScheduleDateTimeSection: React.FC<ScheduleDateTimeSectionProps> = ({
  date,
  startTime,
  endTime
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      backgroundColor: '#eaf6ff', 
      padding: '10px 14px',
      borderRadius: '10px',
      marginBottom: '12px',
      marginTop: '12px',
      width: '100%',
      border: '1px solid #d0e9ff' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        color: '#334155', 
        fontSize: '12px',
        fontWeight: '600'
      }}>
        <img 
          src="/dateCardIcon.png" 
          alt="Date" 
          style={{
            width: '16px',
            height: '16px',
            marginRight: '10px'
          }}
        />
        {date} 
      </div>

      <div style={{
        width: '1px',
        height: '24px',
        backgroundColor: '#cbd5e1' 
      }} />

      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        color: '#334155', 
        fontSize: '12px',
        fontWeight: '600'
      }}>
        <img 
          src="/timeCardIcon.png"
          alt="Time" 
          style={{
            width: '16px',
            height: '16px',
            marginRight: '10px'
          }}
        />
        {startTime} - {endTime}
      </div>
    </div>
  );
};

export default ScheduleDateTimeSection;