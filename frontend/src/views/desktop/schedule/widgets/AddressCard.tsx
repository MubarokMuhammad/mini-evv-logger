import React from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface AddressCardProps {
  location: Location;
}

export const AddressCard: React.FC<AddressCardProps> = ({ location }) => {
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
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a1a'
      }}>
        Address
      </h3>
      <p style={{
        margin: 0,
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.5'
      }}>
        {location.address}
      </p>
    </div>
  );
};