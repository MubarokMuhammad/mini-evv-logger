import React from 'react';

const ProfileActivityStats: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{
          width: '4px',
          height: '20px',
          backgroundColor: '#2c7873',
          marginRight: '12px',
          borderRadius: '2px'
        }}></span>
        Your Activity
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c7873',
            marginBottom: '4px'
          }}>
            127
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            fontWeight: '500'
          }}>
            Total Visits
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c7873',
            marginBottom: '4px'
          }}>
            98%
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            fontWeight: '500'
          }}>
            Completion Rate
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileActivityStats;