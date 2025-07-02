import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import HomePage from './views/HomePage.tsx';
import ScheduleDetailsPage from './views/ScheduleDetailsPage.tsx';
import ClockOutPage from './views/ClockOutPage.tsx';
import ProfilePage from './views/ProfilePage.tsx';
import AllSchedulesPage from './views/AllSchedulesPage.tsx';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedules" element={<AllSchedulesPage />} />
            <Route path="/schedules/:id" element={<ScheduleDetailsPage />} />
            <Route path="/schedules/clock-out/:id" element={<ClockOutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
