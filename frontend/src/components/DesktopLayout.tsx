import React from 'react';
import { Outlet } from 'react-router-dom';
import DesktopHeader from './DesktopHeader';

const DesktopLayout: React.FC = () => {
  return (
    <div className="desktop-layout">
      <DesktopHeader />
      <main className="desktop-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DesktopLayout;