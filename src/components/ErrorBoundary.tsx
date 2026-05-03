import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-resonance-surface border border-resonance-border rounded-2xl">
          <div className="text-6xl mb-6 text-resonance-gold font-display italic">§</div>
          <h2 className="text-2xl font-display text-resonance-cream mb-4">A temporary glitch in the field.</h2>
          <p className="text-resonance-muted font-body mb-8 max-w-md">
            The resonance was interrupted. This often happens during portal shifts or network instability.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-resonance-gold text-resonance-bg rounded-full font-ui font-bold hover:brightness-110 transition-all shadow-lg"
          >
            Re-align Connection
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
