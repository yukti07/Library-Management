import { render, screen } from '@testing-library/react';
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

  it('shows Users tab when clicked', () => {
    render(<App />);
    const usersButton = screen.getByText('Users');
    usersButton.click();
    expect(usersButton).toHaveClass('active');
  });
});