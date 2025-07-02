import React from 'react';

interface ProfileLogoutButtonProps {
  isLoggingOut: boolean;
  handleLogout: () => void;
}

const ProfileLogoutButton: React.FC<ProfileLogoutButtonProps> = ({ isLoggingOut, handleLogout }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={handleLogout}
        disabled={isLoggingOut}
        style={{
          backgroundColor: isLoggingOut ? '#6c757d' : '#dc3545',
          color: 'white',
          border: 'none',
          padding: '16px 32px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isLoggingOut ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'all 0.3s ease',
          opacity: isLoggingOut ? 0.7 : 1,
          boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)'
        }}
        onMouseOver={(e) => {
          if (!isLoggingOut) {
            e.currentTarget.style.backgroundColor = '#c82333';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.3)';
          }
        }}
        onMouseOut={(e) => {
          if (!isLoggingOut) {
            e.currentTarget.style.backgroundColor = '#dc3545';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.2)';
          }
        }}
      >
        {isLoggingOut ? 'Logging Out...' : 'Log Out'}
      </button>
    </div>
  );
};

export default ProfileLogoutButton;