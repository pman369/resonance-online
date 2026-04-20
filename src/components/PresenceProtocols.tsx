import React, { useState, useCallback } from 'react';
import { Heart, Clock, Sun, Moon, Pause } from 'lucide-react';
import { generateIntention } from '../api/client';

interface IntentionData {
  intention: string;
  morning: string;
  midday: string;
  evening: string;
}

const PresenceProtocols: React.FC = () => {
  const [intention, setIntention] = useState<IntentionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const generateDailyIntention = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateIntention() as IntentionData;
      setIntention(result);
    } catch (err) {
      setError('Could not generate intention. Please try again.');
      console.error('Intention error:', err);
    }
    setIsLoading(false);
  }, []);

  // Session timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setSessionActive(true);
    setSessionTime(0);
  };

  const endSession = () => {
    setSessionActive(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-8 h-8 text-pink-600" />
          <h2 className="text-3xl font-bold">Presence Protocols</h2>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Sometimes the most conscious act is closing the app. Generate a daily intention,
          then go live it. This is where the real work happens.
        </p>

        <button
          onClick={generateDailyIntention}
          disabled={isLoading}
          className={`relative overflow-hidden transition-all transform hover:scale-105 ${
            isLoading
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-shimmer'
              : 'bg-pink-600 hover:bg-pink-700'
          } text-white px-8 py-3 rounded-lg shadow-lg`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
            {isLoading ? 'Generating...' : 'Generate Daily Intention'}
          </span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {intention && (
        <div className="space-y-6">
          {/* Core Intention */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-xl border-2 border-pink-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
              <h3 className="text-xl font-bold text-pink-900">Today's Intention</h3>
            </div>
            <p className="text-2xl text-gray-800 leading-relaxed font-light italic">{intention.intention}</p>
          </div>

          {/* Time-based Practices */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Morning */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Sun className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-bold text-amber-900">Morning (3-5 min)</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{intention.morning}</p>
            </div>

            {/* Midday */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">Midday Check-in</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{intention.midday}</p>
            </div>

            {/* Evening */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Moon className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-indigo-900">Evening Reflection</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{intention.evening}</p>
            </div>
          </div>

          {/* Digital Sabbath Timer */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Pause className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-emerald-900">Digital Sabbath</h3>
              </div>
              <div className="text-3xl font-bold text-emerald-600 font-mono">
                {formatTime(sessionTime)}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Close this app. Put your phone away. Be with your intention in the real world.
              We count this differently—less is more. Track your time away from screens, then return when ready.
            </p>

            {!sessionActive ? (
              <button
                onClick={startSession}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Close App & Go Live
              </button>
            ) : (
              <button
                onClick={endSession}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Return to Resonance ({formatTime(sessionTime)})
              </button>
            )}

            {sessionActive && (
              <p className="text-center text-emerald-700 mt-4 text-sm italic">
                You're present. No need to check back. Just be.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresenceProtocols;
