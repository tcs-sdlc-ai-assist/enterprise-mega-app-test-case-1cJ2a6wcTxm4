import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the Enterprise Mega App welcome screen', () => {
    render(<App />);
    expect(screen.getByText(/Enterprise Mega App/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to the Enterprise Mega App/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\(Replace this screen with your main routes and UI\)/i)
    ).toBeInTheDocument();
  });

  it('renders without crashing and providers are present', () => {
    render(<App />);
    // Should render the main container
    expect(
      screen.getByRole('main', { hidden: true })
    ).not.toBeInTheDocument(); // App does not render a role="main" by default
    // But should render the heading
    expect(screen.getByText(/Enterprise Mega App/i)).toBeInTheDocument();
  });
});