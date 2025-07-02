import { useState, useEffect } from 'react';
import { Schedule } from '../../../../hooks/types';

export const useActiveVisitTimer = (activeVisit: Schedule | null) => {
  const [timer, setTimer] = useState<string>('00:00:00');

  useEffect(() => {
    if (activeVisit && activeVisit.actualStartTime) {
      const interval = setInterval(() => {
        const start = new Date(activeVisit.actualStartTime!);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activeVisit]);

  return timer;
};