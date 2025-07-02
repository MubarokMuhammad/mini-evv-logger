import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test component to verify React and testing setup
function SimpleTestComponent() {
  return <div data-testid="simple-component">Test Component</div>;
}

test('renders simple component without crashing', () => {
  render(<SimpleTestComponent />);
  expect(screen.getByTestId('simple-component')).toBeInTheDocument();
});

test('testing library is working correctly', () => {
  const { container } = render(<div>Hello World</div>);
  expect(container).toBeInTheDocument();
  expect(container.textContent).toBe('Hello World');
});