import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/pacman/i);
  expect(titleElement).toBeInTheDocument();
});
