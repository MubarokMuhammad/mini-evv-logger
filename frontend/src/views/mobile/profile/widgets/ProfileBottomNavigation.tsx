import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileBottomNavigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <button 
        onClick={() => navigate('/')}
        className="nav-item"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <img 
          src="/homeIcon.png" 
          alt="Home" 
          style={{
            width: '24px',
            height: '24px'
          }}
        />
        <span>Home</span>
      </button>
      <button 
        onClick={() => navigate('/profile')}
        className="nav-item"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#2c7873'
        }}
      >
        <img 
          src="/profileIcon.png" 
          alt="Profile" 
          style={{
            width: '24px',
            height: '24px'
          }}
        />
        <span>Profile</span>
      </button>
    </div>
  );
};

export default ProfileBottomNavigation;