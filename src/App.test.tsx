import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders Library Management System heading', () => {
    render(<App />);
    expect(screen.getByText('Library Management System')).toBeInTheDocument();
  });

  it('shows Books tab by default', () => {
    render(<App />);
    const booksButton = screen.getByText('Books');
    expect(booksButton).toHaveClass('active');
  });

  it('shows Users tab when clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const usersButton = screen.getByText('Users');
    await user.click(usersButton);

    expect(usersButton).toHaveClass('active');
    expect(screen.getByText('Books')).not.toHaveClass('active');
  });
});