import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface LocationSectionProps {
  schedule: Schedule;
}

const LocationSection: React.FC<LocationSectionProps> = ({ schedule }) => {
  return (
    <div className="location-section">
      <h3>Clock-In Location</h3>
      {schedule.startLocation && schedule.startLocation.latitude && schedule.startLocation.longitude ? (
        <>
          <div className="location-map" style={{
            width: '100%',
            height: '200px',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${schedule.startLocation.longitude - 0.01},${schedule.startLocation.latitude - 0.01},${schedule.startLocation.longitude + 0.01},${schedule.startLocation.latitude + 0.01}&layer=mapnik&marker=${schedule.startLocation.latitude},${schedule.startLocation.longitude}`}
              width="100%"
              height="200"
              style={{ border: 'none' }}
              title="Clock-in Location Map"
            />
          </div>
          <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
            {schedule.startLocation.address || `${schedule.startLocation.latitude.toFixed(6)}, ${schedule.startLocation.longitude.toFixed(6)}`}
          </p>
          {schedule.startLocation.timestamp && (
            <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '5px' }}>
              Clocked in at: {new Date(schedule.startLocation.timestamp).toLocaleString()}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="location-map" style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            marginBottom: '10px'
          }}>
            <span style={{ color: '#666' }}>Location not available</span>
          </div>
          <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
            Location data not captured
          </p>
        </>
      )}
    </div>
  );
};

export default LocationSection;