import { useProfile } from '../../hooks/useProfile';
import { SettingsSection } from './SettingsSection';
import { Toggle } from './Toggle';
import { Shield } from 'lucide-react';
import { PrivacyPrefs } from '../../types/profile';

export default function PrivacySettings() {
  const { profile, updateProfile } = useProfile();

  const handleToggle = async (key: keyof PrivacyPrefs, value: any) => {
    if (!profile) return;
    const newPrefs = { ...profile.privacy_prefs, [key]: value };
    await updateProfile({ privacy_prefs: newPrefs });
  };

  return (
    <div className="space-y-8">
      <SettingsSection icon={Shield} title="Privacy & Visibility" description="You own your data. Control how it is shared.">
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <label htmlFor="visibility" className="font-ui text-sm text-resonance-cream block">Who can see your profile</label>
              <p className="font-ui text-xs text-resonance-muted leading-relaxed mt-1">Controls whether other Resonance members can view your profile page.</p>
            </div>
            <select
              id="visibility"
              value={profile?.privacy_prefs?.profile_visibility || 'members'}
              onChange={(e) => handleToggle('profile_visibility', e.target.value)}
              className="bg-resonance-bg border border-resonance-border rounded-lg px-3 py-1.5 font-ui text-xs text-resonance-cream focus:outline-none focus:border-resonance-gold/50 appearance-none"
            >
              <option value="members">Members only</option>
              <option value="private">Only me</option>
            </select>
          </div>

          <Toggle
            id="show_journey_history"
            label="Show journey history on profile"
            description="Allow others to see that you've engaged with consciousness tools (no content is shared)."
            checked={profile?.privacy_prefs?.show_journey_history || false}
            onChange={(val) => handleToggle('show_journey_history', val)}
          />

          <Toggle
            id="show_community_activity"
            label="Show community activity"
            description="Display your stories and resonances on your public profile."
            checked={profile?.privacy_prefs?.show_community_activity || false}
            onChange={(val) => handleToggle('show_community_activity', val)}
          />

          <Toggle
            id="allow_coherence_tracking"
            label="Contribute to global coherence"
            description="Your presence counts toward the collective coherence field. Disable to opt out anonymously."
            checked={profile?.privacy_prefs?.allow_coherence_tracking || false}
            onChange={(val) => handleToggle('allow_coherence_tracking', val)}
          />
        </div>
      </SettingsSection>

      <div className="bg-resonance-gold/5 border border-resonance-gold/20 p-6 rounded-2xl">
        <h4 className="text-xs font-ui uppercase tracking-widest text-resonance-gold mb-2">Radical Transparency</h4>
        <p className="text-xs font-body text-resonance-muted leading-relaxed">
          Resonance encrypts your data at rest and never sells your personal information. 
          We believe privacy is a human right, especially when it comes to your internal state.
          <a href="/transparency" className="ml-1 text-resonance-gold hover:underline">Learn more about our data ethics →</a>
        </p>
      </div>
    </div>
  );
}
