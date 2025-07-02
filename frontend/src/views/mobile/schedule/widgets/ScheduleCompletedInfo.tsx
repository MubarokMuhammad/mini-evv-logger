import React from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Schedule {
  id: string;
  status: string;
  endLocation?: Location;
  actualEndTime?: string;
}

interface ScheduleCompletedInfoProps {
  schedule: Schedule;
}

const ScheduleCompletedInfo: React.FC<ScheduleCompletedInfoProps> = ({ schedule }) => {
  if (schedule.status !== 'completed' || !schedule.endLocation) {
    return null;
  }

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
        color: '#2e7d32',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>✅</span>
        <span>Visit Completed</span>
      </h3>
      
      {/* Clock-out Location Map */}
      <div style={{
        marginBottom: '16px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}>
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${schedule.endLocation.longitude-0.01},${schedule.endLocation.latitude-0.01},${schedule.endLocation.longitude+0.01},${schedule.endLocation.latitude+0.01}&layer=mapnik&marker=${schedule.endLocation.latitude},${schedule.endLocation.longitude}`}
          width="100%"
          height="200"
          style={{ border: 'none' }}
          title="Clock-out Location"
        />
      </div>
      
      {/* Clock-out Address */}
      <div style={{
        marginBottom: '12px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: '16px' }}>📍</span>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Clock-out Location:
          </span>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.4',
          paddingLeft: '24px'
        }}>
          {schedule.endLocation.address || `${schedule.endLocation.latitude.toFixed(6)}, ${schedule.endLocation.longitude.toFixed(6)}`}
        </p>
      </div>
      
      {/* Clock-out Timestamp */}
      <div style={{
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🕐</span>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Clocked out at:
          </span>
          <span style={{
            fontSize: '14px',
            color: '#666'
          }}>
            {schedule.actualEndTime ? new Date(schedule.actualEndTime).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCompletedInfo;