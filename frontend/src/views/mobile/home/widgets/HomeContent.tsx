import React from 'react';
import { Schedule, Stats } from '../../../../hooks/types';
import ActiveScheduleMobile from './ActiveScheduleMobile';
import StatsMobile from './StatsMobile';
import ScheduleListMobile from './ScheduleListMobile';

interface HomeContentProps {
  activeVisit: Schedule | null;
  timer: string;
  stats: Stats | null;
  schedules: Schedule[];
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
  activeVisit,
  timer,
  stats,
  schedules,
  onClockIn,
  onClockOut
}) => {
  return (
    <>
      {activeVisit && (
        <ActiveScheduleMobile activeVisit={activeVisit} timer={timer} />
      )}

      {stats && <StatsMobile stats={stats} />}

      <ScheduleListMobile
        schedules={schedules}
        onClockIn={onClockIn}
        onClockOut={onClockOut}
      />
    </>
  );
};

export default HomeContent;