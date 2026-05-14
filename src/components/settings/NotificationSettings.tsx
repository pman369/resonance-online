import { useProfile } from '../../hooks/useProfile';
import { SettingsSection } from './SettingsSection';
import { Toggle } from './Toggle';
import { Bell } from 'lucide-react';
import { NotificationPrefs } from '../../types/profile';

export default function NotificationSettings() {
  const { profile, updateProfile } = useProfile();

  const handleToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!profile) return;
    const newPrefs = { ...profile.notification_prefs, [key]: value };
    await updateProfile({ notification_prefs: newPrefs });
  };

  const prefs = [
    {
      key: 'email_weekly_digest',
      label: 'Weekly Resonance Digest',
      description: 'A curated summary of your journey and collective field insights, delivered every Sunday.'
    },
    {
      key: 'email_community_mentions',
      label: 'Community Mentions',
      description: 'Notify me when someone resonates with my stories or mentions me in the community.'
    },
    {
      key: 'email_product_updates',
      label: 'Platform Updates',
      description: 'Occasional news about new features and platform changes. We keep this minimal.'
    },
    {
      key: 'push_enabled',
      label: 'Push Notifications',
      description: 'Real-time updates in your browser. Requires permission.',
      disabled: true // Future implementation
    }
  ];

  return (
    <div className="space-y-8">
      <SettingsSection icon={Bell} title="Notification Preferences" description="Control how we reach out to you.">
        <div className="space-y-8">
          {prefs.map(pref => (
            <Toggle
              key={pref.key}
              id={pref.key}
              label={pref.label}
              description={pref.description}
              checked={profile?.notification_prefs?.[pref.key as keyof NotificationPrefs] || false}
              onChange={(val) => handleToggle(pref.key as keyof NotificationPrefs, val)}
              disabled={pref.disabled}
            />
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
