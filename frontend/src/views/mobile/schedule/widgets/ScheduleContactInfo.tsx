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
  clientEmail?: string;
  clientPhone?: string;
}

interface ScheduleContactInfoProps {
  schedule: Schedule;
}

const ScheduleContactInfo: React.FC<ScheduleContactInfoProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #f5f5f5'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333'
      }}>
        Contact Information
      </h3>
      
      {/* Email */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: '16px' }}>📧</span>
        <span style={{
          fontSize: '14px',
          color: '#666'
        }}>
          {schedule.clientEmail || 'No email provided'}
        </span>
      </div>
      
      {/* Phone */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '16px' }}>📞</span>
        <span style={{
          fontSize: '14px',
          color: '#666'
        }}>
          {schedule.clientPhone || 'No phone provided'}
        </span>
      </div>
      
      {/* Address */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <span style={{ fontSize: '16px', marginTop: '2px' }}>📍</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '4px'
          }}>
            Service Location:
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.4'
          }}>
            {schedule.location.address}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleContactInfo;