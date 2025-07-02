import React from 'react';
import { useProfileViewModel } from '../../../viewmodels/ProfileViewModel';
import {
  ProfileHeader,
  ProfileContactInfo,
  ProfileActivityStats,
  ProfileLogoutButton,
  ProfileBottomNavigation
} from './widgets';
import '../../../index.css';

const ProfilePage: React.FC = () => {
  const {
    userProfile,
    isLoggingOut,
    handleLogout
  } = useProfileViewModel();

  return (
    <div className="app" style={{ paddingBottom: '80px' }}>
      <div className="header">
        <h1 className="welcome-text">Profile</h1>
      </div>

      <div style={{ padding: '20px' }}>
        <ProfileHeader userProfile={userProfile} />
        <ProfileContactInfo userProfile={userProfile} />
        <ProfileActivityStats />
        <ProfileLogoutButton 
          isLoggingOut={isLoggingOut} 
          handleLogout={handleLogout} 
        />
      </div>

      <ProfileBottomNavigation />
    </div>
  );
};

export default ProfilePage;