import React from 'react';

interface MobileScheduleClientInfoProps {
  clientName: string;
  serviceName: string;
}

const MobileScheduleClientInfo: React.FC<MobileScheduleClientInfoProps> = ({ 
  clientName, 
  serviceName 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px'
    }}>
      <img 
        src="/default-profile.png" 
        alt="Profile" 
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          marginRight: '10px',
          border: '2px solid #f8f8f8',
          objectFit: 'cover'
        }}
      />
      <div>
        <div style={{
          fontWeight: '700',
          fontSize: '14px',
          color: '#1a1a1a',
          marginBottom: '2px',
          lineHeight: '1.2'
        }}>
          {clientName}
        </div>
        <div style={{
          color: '#666',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {serviceName}
        </div>
      </div>
    </div>
  );
};

export default MobileScheduleClientInfo;