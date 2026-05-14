import { useProfile } from '../../hooks/useProfile';
import { SettingsSection } from './SettingsSection';
import { Toggle } from './Toggle';
import { Palette } from 'lucide-react';
import { FeaturePrefs } from '../../types/profile';

export default function AppearanceSettings() {
  const { profile, updateProfile } = useProfile();

  const handleToggle = async (key: keyof FeaturePrefs, value: any) => {
    if (!profile) return;
    const newPrefs = { ...profile.feature_prefs, [key]: value };
    await updateProfile({ feature_prefs: newPrefs });
  };

  return (
    <div className="space-y-8">
      <SettingsSection icon={Palette} title="Appearance & Feedback" description="Customize your visual and auditory experience.">
        <div className="space-y-8">
          <Toggle
            id="audio_feedback_enabled"
            label="Harmonic completion sounds"
            description="Play subtle tones when AI analysis completes."
            checked={profile?.feature_prefs?.audio_feedback_enabled || false}
            onChange={(val) => handleToggle('audio_feedback_enabled', val)}
          />

          <Toggle
            id="reduce_motion"
            label="Reduce motion"
            description="Minimise animations and transitions across the platform. Also respects your OS setting."
            checked={profile?.feature_prefs?.reduce_motion || false}
            onChange={(val) => handleToggle('reduce_motion', val)}
          />

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <label htmlFor="digital_sabbath" className="font-ui text-sm text-resonance-cream block">Digital Sabbath day</label>
              <p className="font-ui text-xs text-resonance-muted leading-relaxed mt-1">We'll gently remind you when this day arrives and honour your offline time.</p>
            </div>
            <select
              id="digital_sabbath"
              value={profile?.feature_prefs?.digital_sabbath_day || ''}
              onChange={(e) => handleToggle('digital_sabbath_day', e.target.value || null)}
              className="bg-resonance-bg border border-resonance-border rounded-lg px-3 py-1.5 font-ui text-xs text-resonance-cream focus:outline-none focus:border-resonance-gold/50 appearance-none"
            >
              <option value="">None</option>
              <option value="sunday">Sunday</option>
              <option value="saturday">Saturday</option>
              <option value="friday">Friday</option>
            </select>
          </div>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <label htmlFor="intention_reminder" className="font-ui text-sm text-resonance-cream block">Daily intention reminder</label>
              <p className="font-ui text-xs text-resonance-muted leading-relaxed mt-1">A gentle nudge to generate your daily intention.</p>
            </div>
            <input
              id="intention_reminder"
              type="time"
              value={profile?.feature_prefs?.intention_reminder_time || ''}
              onChange={(e) => handleToggle('intention_reminder_time', e.target.value || null)}
              className="bg-resonance-bg border border-resonance-border rounded-lg px-3 py-1.5 font-ui text-xs text-resonance-cream focus:outline-none focus:border-resonance-gold/50"
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
