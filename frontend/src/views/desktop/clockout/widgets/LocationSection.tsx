import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface LocationSectionProps {
  schedule: Schedule;
}

const LocationSection: React.FC<LocationSectionProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px'
      }}>Clock-In Location</h3>
      {schedule.startLocation && schedule.startLocation.latitude && schedule.startLocation.longitude ? (
        <>
          <div style={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${schedule.startLocation.longitude - 0.01},${schedule.startLocation.latitude - 0.01},${schedule.startLocation.longitude + 0.01},${schedule.startLocation.latitude + 0.01}&layer=mapnik&marker=${schedule.startLocation.latitude},${schedule.startLocation.longitude}`}
              width="100%"
              height="300"
              style={{ border: 'none' }}
              title="Clock-in Location Map"
            />
          </div>
          <p style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            margin: '0 0 8px 0'
          }}>
            {schedule.startLocation.address || `${schedule.startLocation.latitude.toFixed(6)}, ${schedule.startLocation.longitude.toFixed(6)}`}
          </p>
          {schedule.startLocation.timestamp && (
            <p style={{
              fontSize: '12px',
              color: '#999',
              textAlign: 'center',
              margin: 0
            }}>
              Clocked in at: {new Date(schedule.startLocation.timestamp).toLocaleString()}
            </p>
          )}
        </>
      ) : (
        <>
          <div style={{
            width: '100%',
            height: '300px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ color: '#666', fontSize: '16px' }}>Location not available</span>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            margin: 0
          }}>
            Location data not captured
          </p>
        </>
      )}
    </div>
  );
};

export default LocationSection;