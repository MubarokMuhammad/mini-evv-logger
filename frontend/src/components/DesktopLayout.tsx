import React from 'react';
import { Outlet } from 'react-router-dom';
import DesktopSidebar from './DesktopSidebar.tsx';
import DesktopHeader from './DesktopHeader.tsx';

const DesktopLayout: React.FC = () => {
  return (
    <div className="desktop-layout">
      <DesktopSidebar />
      <div className="desktop-main">
        <DesktopHeader />
        <main className="desktop-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;