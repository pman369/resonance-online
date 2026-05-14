import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { SettingsSection } from './SettingsSection';
import { User, Mail, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AccountSettings() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    timezone: profile?.timezone || 'UTC'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        username: profile.username || '',
        timezone: profile.timezone || 'UTC'
      });
    }
  }, [profile]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await updateProfile(formData);
      setSaveMessage('Profile updated successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/settings/account`,
    });
    if (error) {
      setSaveMessage('Failed to send reset email');
    } else {
      setSaveMessage('Password reset email sent');
    }
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const timezones = typeof (Intl as any).supportedValuesOf === 'function'
    ? (Intl as any).supportedValuesOf('timeZone') as string[]
    : ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave}>
        <SettingsSection icon={User} title="Public Identity" description="How you appear in the collective.">
          <div className="grid gap-6">
            <div className="space-y-1">
              <label htmlFor="display_name" className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">Display Name</label>
              <input
                id="display_name"
                type="text"
                value={formData.display_name}
                onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 font-ui text-sm text-resonance-cream focus:outline-none focus:border-resonance-gold/50 transition-colors"
                placeholder="The Seeker"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="username" className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-resonance-muted">@</span>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  className="w-full bg-resonance-bg border border-resonance-border rounded-xl pl-8 pr-4 py-3 font-ui text-sm text-resonance-cream focus:outline-none focus:border-resonance-gold/50 transition-colors"
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        <div className="mt-8">
          <SettingsSection icon={Mail} title="Security & Access" description="Manage your account credentials.">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-resonance-bg/30 rounded-xl border border-resonance-border">
                <div>
                  <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted mb-1">Email Address</p>
                  <p className="text-sm font-ui text-resonance-cream">{user?.email}</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-[10px] font-ui uppercase tracking-widest text-resonance-gold hover:text-resonance-cream transition-colors"
                  disabled
                >
                  Change Email →
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-resonance-bg/30 rounded-xl border border-resonance-border">
                <div>
                  <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted mb-1">Password</p>
                  <p className="text-sm font-ui text-resonance-cream">••••••••••••</p>
                </div>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="px-4 py-2 border border-resonance-border text-resonance-cream rounded-full font-ui text-[10px] uppercase tracking-widest hover:border-resonance-gold/50 transition-all"
                >
                  Update Password
                </button>
              </div>
            </div>
          </SettingsSection>
        </div>

        <div className="mt-8">
          <SettingsSection icon={Globe} title="Localization" description="Preferences for your temporal experience.">
            <div className="space-y-1">
              <label htmlFor="timezone" className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted">Timezone</label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full bg-resonance-bg border border-resonance-border rounded-xl px-4 py-3 font-ui text-sm text-resonance-cream focus:outline-none focus:border-resonance-gold/50 transition-colors appearance-none"
              >
                {timezones.map((tz: string) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </SettingsSection>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <div aria-live="polite" className="text-xs font-ui text-resonance-gold italic">
            {saveMessage}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-resonance-gold text-resonance-bg rounded-full font-ui text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {isSaving ? 'Synchronizing...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
