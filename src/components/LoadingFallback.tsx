import React from 'react';

const LoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-resonance-gold mb-4 opacity-50"></div>
      <p className="text-resonance-muted font-display italic text-sm tracking-widest">Resonating...</p>
    </div>
  </div>
);

export default LoadingFallback;
