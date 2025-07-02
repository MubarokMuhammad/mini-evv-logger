import React from 'react';

const DesktopHeader: React.FC = () => {
  return (
    <header className="desktop-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">Dashboard</h1>
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">
              <img 
                src="/default-profile.png" 
                alt="Admin A" 
                className="avatar-image"
              />
            </div>
            <div className="user-info">
              <span className="user-name">Admin A</span>
              <span className="user-role">Administrator</span>
            </div>
            <div className="dropdown-arrow">▼</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;