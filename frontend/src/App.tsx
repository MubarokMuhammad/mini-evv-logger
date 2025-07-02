import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import HomePage from './views/HomePage.tsx';
import ScheduleDetailsPage from './views/ScheduleDetailsPage.tsx';
import ClockOutPage from './views/ClockOutPage.tsx';
import ProfilePage from './views/ProfilePage.tsx';
import AllSchedulesPage from './views/AllSchedulesPage.tsx';
import DesktopLayout from './components/DesktopLayout.tsx';
import DesktopDashboard from './views/DesktopDashboard.tsx';
import { useDeviceDetection, checkIfMobileSubdomain } from './hooks/useDeviceDetection.ts';
import './index.css';
import './styles/desktop.css';

function AppContent() {
  const { isMobile } = useDeviceDetection();
  const isMobileSubdomain = checkIfMobileSubdomain();
  const shouldShowMobile = isMobile || isMobileSubdomain;

  return (
    <div className={shouldShowMobile ? "App" : "App desktop"}>
      {shouldShowMobile ? (
        // Mobile Routes
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedules" element={<AllSchedulesPage />} />
          <Route path="/schedules/:id" element={<ScheduleDetailsPage />} />
          <Route path="/schedules/clock-out/:id" element={<ClockOutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      ) : (
        // Desktop Routes
        <Routes>
          <Route path="/" element={<DesktopLayout />}>
            <Route index element={<DesktopDashboard />} />
            <Route path="schedules" element={<AllSchedulesPage />} />
            <Route path="schedules/:id" element={<ScheduleDetailsPage />} />
            <Route path="schedules/clock-out/:id" element={<ClockOutPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
