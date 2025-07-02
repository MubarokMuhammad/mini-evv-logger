import React from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface CompletedStatusCardProps {
  endLocation: Location;
  actualEndTime?: string;
}

export const CompletedStatusCard: React.FC<CompletedStatusCardProps> = ({ endLocation, actualEndTime }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    }}>
      <h3 style={{
        margin: '0 0 24px 0',
        fontSize: '20px',
        fontWeight: '700',
        color: '#2e7d32',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>✅</span>
        <span>Visit Completed</span>
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Clock-out Location Map */}
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${endLocation.longitude-0.01},${endLocation.latitude-0.01},${endLocation.longitude+0.01},${endLocation.latitude+0.01}&layer=mapnik&marker=${endLocation.latitude},${endLocation.longitude}`}
            width="100%"
            height="300"
            style={{ border: 'none' }}
            title="Clock-out Location"
          />
        </div>
        
        <div>
          {/* Clock-out Address */}
          <div style={{
            marginBottom: '16px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>📍</span>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                Clock-out Location:
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5',
              paddingLeft: '32px'
            }}>
              {endLocation.address || `${endLocation.latitude.toFixed(6)}, ${endLocation.longitude.toFixed(6)}`}
            </p>
          </div>
          
          {/* Clock-out Timestamp */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>🕐</span>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                Clocked out at:
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666',
              paddingLeft: '32px'
            }}>
              {actualEndTime ? new Date(actualEndTime).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};