import { BrowserRouter } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import LandingPage from './components/LandingPage';
import ResonanceApp from './App';

export default function Root() {
  const { user, loading } = useAuth();

  console.log('🔍 Root render:', { loading, user: user?.email || 'null' });

  if (loading) {
    console.log('⏳ Loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-resonance-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-resonance-gold mb-4"></div>
          <p className="text-resonance-cream font-body italic text-lg">Breathing into this...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 Showing Landing Page');
    return <LandingPage />;
  }

  console.log('✅ Showing main app');
  return (
    <BrowserRouter>
      <ResonanceApp />
    </BrowserRouter>
  );
}
