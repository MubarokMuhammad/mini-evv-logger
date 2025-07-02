import React from 'react';
import { Link } from 'react-router-dom';

const BottomNavigationMobile: React.FC = () => {
  return (
    <div className="bottom-nav">
      <Link to="/schedules" className="nav-item active">
        <img 
          src="/homeIcon.png" 
          alt="Home" 
          style={{
            width: '24px',
            height: '24px'
          }}
        />
        <span>Home</span>
      </Link>
      <Link to="/profile" className="nav-item">
        <img 
          src="/profileIcon.png" 
          alt="Profile" 
          style={{
            width: '24px',
            height: '24px'
          }}
        />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigationMobile;