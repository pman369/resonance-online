import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileStats } from './ProfileStats';
import { Edit2, Save, X, MapPin, Calendar, Link as LinkIcon, Activity, BookOpen, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'reflections' | 'stories'>('activity');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website_url: profile?.website_url || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website_url: profile.website_url || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-resonance-gold font-ui uppercase tracking-widest text-sm">
          Tuning into your frequency...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-resonance-border shadow-2xl bg-resonance-surface">
        <div className="h-48 bg-gradient-to-br from-resonance-surface via-resonance-bg to-resonance-surface border-b border-resonance-border relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_60%)]" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[8rem] text-resonance-border/30 font-display pointer-events-none select-none">
            ✧
          </div>
        </div>

        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <ProfileAvatar
                currentUrl={profile?.avatar_url || null}
                displayName={profile?.display_name || null}
                email={user?.email || null}
                editable={true}
                size="xl"
              />
              <div className="mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                    className="bg-resonance-bg border border-resonance-gold/30 rounded-lg px-3 py-1 text-2xl font-display text-resonance-cream focus:outline-none focus:border-resonance-gold"
                    placeholder="Display Name"
                  />
                ) : (
                  <h1 className="text-3xl font-display text-resonance-cream">
                    {profile?.display_name || user?.email?.split('@')[0]}
                  </h1>
                )}
                <p className="text-resonance-gold/60 font-ui text-sm tracking-wider mt-1">
                  @{profile?.username || user?.id?.slice(0, 8)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-2 border border-resonance-border text-resonance-muted rounded-full font-ui text-xs uppercase tracking-widest hover:text-resonance-cream transition-all"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-resonance-gold text-resonance-bg rounded-full font-ui text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : <><Save size={14} /> Save</>}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 border border-resonance-border text-resonance-cream rounded-full font-ui text-xs uppercase tracking-widest hover:border-resonance-gold/50 transition-all"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">Bio</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      maxLength={300}
                      className="w-full h-32 bg-resonance-bg border border-resonance-border rounded-xl p-4 font-ui text-sm text-resonance-cream focus:outline-none focus:border-resonance-gold/50 resize-none"
                      placeholder="Share your journey..."
                    />
                    <div className="flex justify-end text-[10px] font-ui text-resonance-muted">
                      {formData.bio.length} / 300
                    </div>
                  </div>
                ) : (
                  <p className="font-body text-resonance-cream/80 leading-relaxed max-w-2xl">
                    {profile?.bio || "No bio yet. The silence is profound."}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-6 items-center pt-2">
                <div className="flex items-center gap-2 text-resonance-muted">
                  <MapPin size={14} className="text-resonance-gold/50" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="bg-resonance-bg border border-resonance-border rounded px-2 py-0.5 text-xs font-ui text-resonance-cream"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-xs font-ui uppercase tracking-widest">{profile?.location || "Cosmos"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-resonance-muted">
                  <Calendar size={14} className="text-resonance-gold/50" />
                  <span className="text-xs font-ui uppercase tracking-widest">
                    Joined {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                {(profile?.website_url || isEditing) && (
                  <div className="flex items-center gap-2 text-resonance-muted">
                    <LinkIcon size={14} className="text-resonance-gold/50" />
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.website_url}
                        onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                        className="bg-resonance-bg border border-resonance-border rounded px-2 py-0.5 text-xs font-ui text-resonance-cream"
                        placeholder="https://..."
                      />
                    ) : (
                      <a href={profile?.website_url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs font-ui uppercase tracking-widest hover:text-resonance-gold transition-colors">
                        {profile?.website_url?.replace(/^https?:\/\//, '') || "Website"}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <ProfileStats userId={user?.id || ''} />
      </section>

      {/* Tabs Section */}
      <section className="space-y-6">
        <div className="flex gap-8 border-b border-resonance-border">
          {[
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'reflections', label: 'Reflections', icon: BookOpen },
            { id: 'stories', label: 'Stories', icon: MessageCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 flex items-center gap-2 text-[10px] font-ui uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? 'text-resonance-gold' : 'text-resonance-muted hover:text-resonance-cream'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-resonance-gold" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[200px] flex flex-col items-center justify-center text-resonance-muted py-12 bg-resonance-surface/20 rounded-3xl border border-resonance-border border-dashed">
           <p className="text-xs font-ui uppercase tracking-widest">No {activeTab} yet.</p>
           <p className="text-[10px] italic mt-1">Your journey is just beginning.</p>
        </div>
      </section>
    </div>
  );
}
