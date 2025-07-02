import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

// Create a mock store for testing
const mockStore = configureStore({
  reducer: {
    // Add your reducers here when they exist
    // For now, we'll use a simple reducer
    test: (state = {}, action) => state
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  // Basic test to ensure the app renders without errors
  expect(document.body).toBeInTheDocument();
});

test('app component exists', () => {
  const { container } = renderWithProviders(<App />);
  expect(container.firstChild).toBeTruthy();
});