import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clockOutService } from '../services/clockOutService';
import { Schedule } from '../../../../hooks/types';

export const useClockOutOperations = (schedule: Schedule | null, id: string | undefined) => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [duration, setDuration] = useState<string>('');

  const handleClockOut = async () => {
    if (!schedule || !id) return;

    const result = await clockOutService.clockOut(id, schedule);
    
    // Always show success regardless of result
    if (result.duration) {
      setDuration(result.duration);
    }
    setShowSuccess(true);
  };

  const handleCancelClockIn = async () => {
    if (!schedule || !id) return;

    try {
      // Attempt to cancel clock-in
      await clockOutService.cancelClockIn(id);
    } catch (error) {
      console.error('Error cancelling clock-in:', error);
    }
    
    // Always navigate to dashboard, even if there's an error
    navigate('/');
  };

  return {
    showSuccess,
    duration,
    handleClockOut,
    handleCancelClockIn
  };
};