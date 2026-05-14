import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { checkBackendHealth, incrementGlobalCoherence } from './api/client';
import { useAuth } from './lib/AuthContext';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import LoadingFallback from './components/LoadingFallback';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import { WifiOff } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded views
const HomeView = lazy(() => import('./components/Dashboard'));
const ConsciousnessMapping = lazy(() => import('./components/ConsciousnessFeed'));
const Notes = lazy(() => import('./components/Notes'));
const SynchronicityEngine = lazy(() => import('./components/SynchronicityEngine'));
const AncientWisdom = lazy(() => import('./components/AncientWisdom'));
const CollectiveCoherence = lazy(() => import('./components/CollectiveCoherence'));
const ShadowIntegration = lazy(() => import('./components/ShadowIntegration'));
const PresenceProtocols = lazy(() => import('./components/PresenceProtocols'));
const RadicalTransparency = lazy(() => import('./components/RadicalTransparency'));
const CommunityHub = lazy(() => import('./components/CommunityHub'));
const UserJourneyHistory = lazy(() => import('./components/History'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'));

import { Analysis, ShadowData } from './api/client';

// Types
interface UserData {
  journalEntries: Array<{ text: string; date: Date; analysis: Analysis }>;
  frequency: string | null;
  connections: string[];
  practices: string[];
  shadowWork: ShadowData[];
  coherenceContribution: number;
}

// Main App Component
const ResonanceApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    journalEntries: [],
    frequency: null,
    connections: [],
    practices: [],
    shadowWork: [],
    coherenceContribution: 0
  });
  const [globalCoherence, setGlobalCoherence] = useState(73542);

  const [onlineUsersCount, setOnlineUsersCount] = useState(0);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth()
      .then((health) => {
        console.log('✨ Backend connected:', health);
      })
      .catch((err) => {
        console.warn('⚠️  Backend not available. AI features will use fallback mode.', err);
      });
  }, []);

  // Subscribe to real-time global coherence and presence updates
  useEffect(() => {
    const fetchInitialMetrics = async () => {
      const { data } = await supabase.from('global_metrics').select('*').eq('id', 'current').single();
      if (data) {
        setGlobalCoherence(data.coherence_score);
      }
    };

    fetchInitialMetrics();

    const channel = supabase.channel('global_metrics_changes', {
      config: {
        presence: {
          key: user?.id || 'anonymous',
        },
      },
    });

    channel
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'global_metrics', 
        filter: "id=eq.current" 
      }, (payload) => {
        setGlobalCoherence(payload.new.coherence_score);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsersCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            online_at: new Date().toISOString(),
            email: user.email
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAnalysisComplete = useCallback((analysis: Analysis, text: string) => {
    setUserData(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, { text, date: new Date(), analysis }],
      frequency: analysis.frequency
    }));
  }, []);

  const isOnline = useOfflineStatus();

  return (
    <div className="min-h-screen bg-resonance-bg text-resonance-cream selection:bg-resonance-gold selection:text-resonance-bg">
      <Navigation onSignOut={signOut} userEmail={user?.email} />
      
      {!isOnline && (
        <div className="fixed top-20 left-0 right-0 z-50 bg-resonance-danger/90 text-resonance-cream py-2 px-4 flex items-center justify-center gap-3 backdrop-blur-md animate-in slide-in-from-top duration-500">
          <WifiOff size={16} className="animate-pulse" />
          <span className="text-xs font-ui uppercase tracking-widest font-bold">You are currently offline. Some features may be limited.</span>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto p-6 pt-24 pb-12">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="/home" element={
                <HomeView 
                  globalCoherence={globalCoherence} 
                  activeParticipants={onlineUsersCount}
                  coherenceContribution={userData.coherenceContribution} 
                  onContribute={async () => {
                    setUserData(prev => ({ ...prev, coherenceContribution: prev.coherenceContribution + 1 }));
                    try {
                      await incrementGlobalCoherence(1);
                    } catch (err) {
                      console.error('Failed to sync coherence contribution', err);
                    }
                  }}
                />
              } />
              <Route path="/mapping" element={<ConsciousnessMapping onAnalysisComplete={handleAnalysisComplete} />} />
              <Route path="/synchronicity" element={<SynchronicityEngine />} />
              <Route path="/wisdom" element={<AncientWisdom />} />
              <Route path="/coherence" element={<CollectiveCoherence />} />
              <Route path="/shadow" element={<ShadowIntegration />} />
              <Route path="/feed" element={<CommunityHub />} />
              <Route path="/history" element={<UserJourneyHistory />} />
              <Route path="/community" element={<CommunityHub />} />
              <Route path="/transparency" element={<RadicalTransparency />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/presence" element={<PresenceProtocols />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/:tab" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="bg-resonance-surface border-t border-resonance-border p-8 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-resonance-gold font-display text-xl mb-2 italic">
            Resonance exists to amplify human consciousness, not replace it.
          </p>
          <p className="text-resonance-muted font-ui text-sm">
            You are the technology. We're just here to help you remember.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ResonanceApp;
