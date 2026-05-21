import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { StoriesFeed } from './community/stories/StoriesFeed';
import { CircleList } from './community/circles/CircleList';
import { DiscussionSection } from './community/discussions/DiscussionSection';

const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'circles' | 'discussions'>('stories');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="w-8 h-8 text-resonance-gold" />
          <h2 className="text-3xl font-display text-resonance-cream">Community Hub</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-resonance-bg rounded-xl border border-resonance-border w-fit">
          {(['stories', 'circles', 'discussions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-ui text-sm transition-all ${
                activeTab === tab
                  ? 'bg-resonance-gold text-resonance-bg font-bold shadow-lg'
                  : 'text-resonance-muted hover:text-resonance-cream'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      <main className="min-h-[60vh]">
        {activeTab === 'stories' && <StoriesFeed />}
        {activeTab === 'circles' && <CircleList />}
        {activeTab === 'discussions' && <DiscussionSection />}
      </main>
    </div>
  );
};

export default CommunityHub;
