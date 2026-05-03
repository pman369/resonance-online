import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock AuthContext before importing component
const mockUseAuth = vi.fn();

vi.mock('../lib/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the Auth component (it's heavy, we just need a stub)
vi.mock('../components/Auth', () => ({
  default: () => <div data-testid="auth-page">Sign In Page</div>,
}));

import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true, signOut: vi.fn() });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows Auth page when user is not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signOut: vi.fn() });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' },
      loading: false,
      signOut: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('auth-page')).not.toBeInTheDocument();
  });
});
