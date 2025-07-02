import React from 'react';
import { UserProfile } from '../../../../viewmodels/ProfileViewModel';

interface ProfileContactInfoProps {
  userProfile: UserProfile;
}

const ProfileContactInfo: React.FC<ProfileContactInfoProps> = ({ userProfile }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
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
        Contact Information
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#2c7873',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px'
        }}>
          <span style={{ color: 'white', fontSize: '18px' }}>✉</span>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>
            Email Address
          </p>
          <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '500' }}>
            {userProfile.email}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#2c7873',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px'
        }}>
          <span style={{ color: 'white', fontSize: '18px' }}>👤</span>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>
            Role & Department
          </p>
          <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '500' }}>
            Healthcare Care Provider
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileContactInfo;