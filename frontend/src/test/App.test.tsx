import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';

const mockStore = configureStore({
  reducer: {
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
  expect(document.body).toBeInTheDocument();
});

test('app component exists', () => {
  const { container } = renderWithProviders(<App />);
  expect(container.firstChild).toBeTruthy();
});