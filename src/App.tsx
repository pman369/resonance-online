import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { checkBackendHealth } from './api/client';
import { useAuth } from './lib/AuthContext';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import LoadingFallback from './components/LoadingFallback';

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

// Types
interface UserData {
  journalEntries: Array<{ text: string; date: Date; analysis: any }>;
  frequency: string | null;
  connections: string[];
  practices: string[];
  shadowWork: any[];
  coherenceContribution: number;
}

interface Analysis {
  frequency: string;
  growthEdges: string[];
  flowTriggers: string[];
  patterns: string;
  nextStep: string;
  error?: string;
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

  // Heartbeat to track active presence
  useEffect(() => {
    if (!user) return;

    const sendHeartbeat = async () => {
      try {
        await supabase.from('user_heartbeats').upsert({
          user_id: user.id,
          last_seen: new Date().toISOString()
        });
      } catch (err) {
        console.error('Heartbeat error:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000); // Every minute
    return () => clearInterval(interval);
  }, [user]);

  // Subscribe to real-time global coherence updates
  useEffect(() => {
    const fetchInitialMetrics = async () => {
      const { data } = await supabase.from('global_metrics').select('*').eq('id', 'current').single();
      if (data) setGlobalCoherence(data.coherence_score);
    };

    fetchInitialMetrics();

    const channel = supabase
      .channel('global_metrics_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_metrics', filter: "id=eq.current" }, (payload) => {
        setGlobalCoherence(payload.new.coherence_score);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAnalysisComplete = useCallback((analysis: Analysis, text: string) => {
    setUserData(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, { text, date: new Date(), analysis }],
      frequency: analysis.frequency
    }));
  }, []);

  return (
    <div className="min-h-screen bg-resonance-bg text-resonance-cream selection:bg-resonance-gold selection:text-resonance-bg">
      <Navigation onSignOut={signOut} userEmail={user?.email} />
      
      <main className="max-w-7xl mx-auto p-6 pt-24 pb-12">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={
              <HomeView 
                globalCoherence={globalCoherence} 
                coherenceContribution={userData.coherenceContribution} 
                onContribute={() => setUserData(prev => ({ ...prev, coherenceContribution: prev.coherenceContribution + 1 }))} 
              />
            } />
            <Route path="/mapping" element={<ConsciousnessMapping onAnalysisComplete={handleAnalysisComplete} />} />
            <Route path="/synchronicity" element={<SynchronicityEngine />} />
            <Route path="/wisdom" element={<AncientWisdom />} />
            <Route path="/coherence" element={<CollectiveCoherence />} />
            <Route path="/shadow" element={<ShadowIntegration />} />
            <Route path="/feed" element={<CollectiveCoherence />} /> 
            <Route path="/history" element={<UserJourneyHistory />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/transparency" element={<RadicalTransparency />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/presence" element={<PresenceProtocols />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
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
