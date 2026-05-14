import { useParams, NavLink } from 'react-router-dom';
import { User, Bell, Shield, Palette, AlertTriangle } from 'lucide-react';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AppearanceSettings from './AppearanceSettings';
import DangerZone from './DangerZone';

export default function SettingsPage() {
  const { tab = 'account' } = useParams<{ tab: string }>();

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
  ];

  const renderTabContent = () => {
    switch (tab) {
      case 'account': return <AccountSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'privacy': return <PrivacySettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'danger': return <DangerZone />;
      default: return <AccountSettings />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 animate-in fade-in duration-700">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 space-y-2">
        <h1 className="text-2xl font-display text-resonance-cream mb-8 px-4">Settings</h1>
        <nav className="space-y-1">
          {tabs.map(item => (
            <NavLink
              key={item.id}
              to={`/settings/${item.id}`}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-ui text-sm transition-all duration-300
                ${isActive 
                  ? 'bg-resonance-gold/10 text-resonance-gold border border-resonance-gold/20' 
                  : item.danger
                    ? 'text-resonance-danger/60 hover:text-resonance-danger hover:bg-resonance-danger/5'
                    : 'text-resonance-muted hover:text-resonance-cream hover:bg-resonance-surface'
                }
              `}
            >
              <item.icon size={18} />
              <span className="uppercase tracking-widest text-[11px] font-bold">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-20">
        <div className="animate-in slide-in-from-right-4 duration-500">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
