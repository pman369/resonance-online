// src/types/profile.ts
export interface NotificationPrefs {
  email_weekly_digest: boolean;
  email_community_mentions: boolean;
  email_product_updates: boolean;
  push_enabled: boolean;
}

export interface PrivacyPrefs {
  profile_visibility: 'members' | 'private';
  show_journey_history: boolean;
  show_community_activity: boolean;
  allow_coherence_tracking: boolean;
}

export interface FeaturePrefs {
  digital_sabbath_day: 'sunday' | 'saturday' | 'friday' | null;
  intention_reminder_time: string | null; // "HH:MM" format
  theme: 'dark'; // reserved for future light mode
  audio_feedback_enabled: boolean;
  reduce_motion: boolean;
}

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  timezone: string;
  website_url: string | null;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
  notification_prefs: NotificationPrefs;
  privacy_prefs: PrivacyPrefs;
  feature_prefs: FeaturePrefs;
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
