import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks.ts';
import { addNotification } from '../store/slices/uiSlice.ts';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  joinDate: string;
}

export const useProfileViewModel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Mock user data - in a real app, this would come from authentication state
  const userProfile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Care Provider',
    joinDate: 'January 2024'
  };

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear any stored authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Show success notification
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: 'Successfully logged out'
      }));
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Failed to logout. Please try again.'
      }));
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate, dispatch]);

  const handleEditProfile = useCallback(() => {
    // In a real app, this would navigate to edit profile page
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'info',
      message: 'Edit profile feature coming soon'
    }));
  }, [dispatch]);

  const handleChangePassword = useCallback(() => {
    // In a real app, this would navigate to change password page
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'info',
      message: 'Change password feature coming soon'
    }));
  }, [dispatch]);

  return {
    userProfile,
    isLoggingOut,
    handleLogout,
    handleEditProfile,
    handleChangePassword
  };
};