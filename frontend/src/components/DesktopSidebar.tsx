import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DesktopSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: '🏠'
    },
    {
      path: '/schedules',
      label: 'Schedules',
      icon: '📅'
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: '👤'
    }
  ];

  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">Carevidh</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DesktopSidebar;