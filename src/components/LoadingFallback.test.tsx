import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingFallback from './LoadingFallback';

describe('LoadingFallback', () => {
  it('renders without crashing', () => {
    render(<LoadingFallback />);
    expect(screen.getByText('Resonating...')).toBeInTheDocument();
  });

  it('renders a spinner element', () => {
    const { container } = render(<LoadingFallback />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
