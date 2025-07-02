import React from 'react';

interface HomeHeaderProps {
  userName?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName = 'Louis' }) => {
  return (
    <div className="header">
      <h1 className="welcome-text">Welcome {userName}!</h1>
    </div>
  );
};

export default HomeHeader;