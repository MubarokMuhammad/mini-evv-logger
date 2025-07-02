import React from 'react';
import { UserProfile } from '../../../../viewmodels/ProfileViewModel';

interface ProfileHeaderProps {
  userProfile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px 24px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #2c7873 0%, #295C59 100%)'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0 auto 16px auto',
        border: '3px solid rgba(255,255,255,0.3)'
      }}>
        {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <h2 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '24px', 
        color: 'white',
        fontWeight: '600'
      }}>
        {userProfile.name}
      </h2>
      <p style={{ 
        margin: '0 0 4px 0', 
        color: 'rgba(255,255,255,0.9)', 
        fontSize: '16px',
        fontWeight: '500'
      }}>
        {userProfile.role}
      </p>
      <p style={{ 
        margin: 0, 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: '14px'
      }}>
        Member since {userProfile.joinDate}
      </p>
    </div>
  );
};

export default ProfileHeader;