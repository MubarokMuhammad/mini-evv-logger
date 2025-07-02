import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import HomePage from './views/mobile/home/HomePage';
import ScheduleDetailsPage from './views/mobile/schedule/ScheduleDetailsPage';
import DesktopScheduleDetailsPage from './views/desktop/schedule/DesktopScheduleDetailsPage';
import ClockOutPage from './views/mobile/clockout/ClockOutPage';
import DesktopClockOutPage from './views/desktop/clockout/DesktopClockOutPage';
import ProfilePage from './views/mobile/profile/ProfilePage';
import AllSchedulesPage from './views/mobile/schedule/AllSchedulesPage';
import DesktopLayout from './components/DesktopLayout';
import DesktopDashboard from './views/desktop/dashboard/DesktopDashboard';
import { useDeviceDetection, checkIfMobileSubdomain } from './hooks/useDeviceDetection';
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
            <Route path="schedules/:id" element={<DesktopScheduleDetailsPage />} />
            <Route path="schedules/clock-out/:id" element={<DesktopClockOutPage />} />
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
