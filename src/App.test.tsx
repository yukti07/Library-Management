import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders Library Management System heading', () => {
    render(<App />);
    expect(screen.getByText('Library Management System')).toBeInTheDocument();
  });

  it('shows Home tab by default', () => {
    render(<App />);
    const homeButton = screen.getByText('Home');
    expect(homeButton).toHaveClass('active');
    expect(screen.getByText('Catalogue')).not.toHaveClass('active');
  });

  it('shows Users tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const usersButton = screen.getByText('Patrons');
    await user.click(usersButton);

    expect(usersButton).toHaveClass('active');
    expect(screen.getByText('Home')).not.toHaveClass('active');
    expect(screen.getByText('Catalogue')).not.toHaveClass('active');
  });
});