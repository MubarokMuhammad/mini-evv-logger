import React from 'react';
import '../../../index.css';

// Import widgets
import {
  BottomNavigationMobile,
  LoadingStateMobile,
  HomeHeader,
  HomeContent
} from './widgets';

// Import hooks
import { useHomeData } from './hooks/useHomeData';
import { useTimer } from './hooks/useTimer';

const HomePage: React.FC = () => {
  const {
    schedules,
    stats,
    activeVisit,
    loading,
    error,
    loadData,
    handleClockIn,
    handleClockOut
  } = useHomeData();
  
  const timer = useTimer(activeVisit);

  // Show loading or error state
  const loadingOrErrorComponent = LoadingStateMobile({ loading, error, onRetry: loadData });
  if (loadingOrErrorComponent) {
    return loadingOrErrorComponent;
  }

  return (
    <div className="app" style={{ paddingBottom: '80px' }}>
      <HomeHeader userName="Louis" />
      
      <HomeContent
        activeVisit={activeVisit}
        timer={timer}
        stats={stats}
        schedules={schedules}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
      />

      <BottomNavigationMobile />
    </div>
  );
};

export default HomePage;