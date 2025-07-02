import React from 'react';

const DesktopHeader: React.FC = () => {
  return (
    <header className="desktop-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <img 
              src="/logoDesktop.png" 
              alt="Carevidh" 
              className="logo-image"
            />
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">
              <img 
                src="/defaultPhotoProfileDesktop.png" 
                alt="Admin A" 
                className="avatar-image"
              />
            </div>
            <div className="user-info">
              <span className="user-name">Admin A</span>
              <span className="user-email">Admin@healthcare.io</span>
            </div>
            <div className="dropdown-arrow">▼</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;