import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, Brain, Zap, BookOpen, Globe, Moon, Heart, Newspaper, MessageCircle, Eye, Clock, User, Settings } from 'lucide-react';
import brandIcon from '../assets/brand-icon.png';
import { useProfile } from '../hooks/useProfile';

interface NavigationProps {
  onSignOut: () => void;
  userEmail?: string | null;
}

const Navigation: React.FC<NavigationProps> = ({ onSignOut, userEmail }) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [tooltip, setTooltip] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.user-menu-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  const navItems = [
    { id: 'home', icon: Sparkles, label: 'Home', path: '/home', tooltip: 'Return to center' },
    { id: 'feed', icon: Newspaper, label: 'Feed', path: '/feed', tooltip: 'Live field insights' },
    { id: 'mapping', icon: Brain, label: 'Consciousness', path: '/mapping', tooltip: 'Map your frequency' },
    { id: 'synchronicity', icon: Zap, label: 'Synchronicity', path: '/synchronicity', tooltip: 'Find what\'s waiting' },
    { id: 'wisdom', icon: BookOpen, label: 'Wisdom', path: '/wisdom', tooltip: 'Ancient teachings' },
    { id: 'coherence', icon: Globe, label: 'Coherence', path: '/coherence', tooltip: 'Collective field' },
    { id: 'history', icon: Clock, label: 'History', path: '/history', tooltip: 'Your journey archived' },
    { id: 'shadow', icon: Moon, label: 'Shadow', path: '/shadow', tooltip: 'Shadow integration' },
    { id: 'community', icon: MessageCircle, label: 'Community', path: '/community', tooltip: 'Community hub' },
    { id: 'transparency', icon: Eye, label: 'Transparency', path: '/transparency', tooltip: 'How we work' },
    { id: 'presence', icon: Heart, label: 'Presence', path: '/presence', tooltip: 'Go live' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile', tooltip: 'Your presence' }
  ];

  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    const timeout = setTimeout(() => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
      setTooltip({ text, visible: true });
    }, 500);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setTooltip({ text: '', visible: false });
  };

  return (
    <nav className="bg-resonance-surface/80 text-resonance-cream border-b border-resonance-border fixed w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <img src={brandIcon} alt="Resonance" className="w-8 h-8 opacity-80" />
          <h1 className="text-xl font-display uppercase tracking-[0.15em] hidden sm:block">Resonance</h1>
        </div>

        {/* Icon Navigation */}
        <div className="flex gap-1.5 items-center">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              onMouseEnter={(e) => handleMouseEnter(e, item.tooltip)}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-resonance-gold text-resonance-bg shadow-[0_0_15px_rgba(201,169,110,0.3)]'
                  : 'text-resonance-muted hover:text-resonance-cream hover:bg-resonance-border'
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-4.5 h-4.5" />
            </NavLink>
          ))}

          {/* User Menu */}
          <div className="relative ml-3 pl-3 border-l border-resonance-border user-menu-container">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-resonance-muted hover:text-resonance-cream transition-colors"
              aria-label="User menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              {/* Avatar or initials fallback */}
              <div className="w-8 h-8 rounded-full bg-resonance-gold/20 border border-resonance-gold/40 flex items-center justify-center text-resonance-gold font-ui text-xs font-bold overflow-hidden">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="Your avatar" className="w-full h-full object-cover" />
                  : (profile?.display_name?.[0] || userEmail?.[0]?.toUpperCase() || '✧')
                }
              </div>
              <span className="hidden lg:block text-[10px] font-ui uppercase tracking-widest text-resonance-muted max-w-32 truncate">
                {profile?.display_name || userEmail?.split('@')[0]}
              </span>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-12 w-48 bg-resonance-surface border border-resonance-border rounded-xl shadow-2xl z-50 overflow-hidden"
                role="menu"
              >
                <NavLink to="/profile" role="menuitem"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-ui text-resonance-cream hover:bg-resonance-border transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={14} /> Your Profile
                </NavLink>
                <NavLink to="/settings" role="menuitem"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-ui text-resonance-cream hover:bg-resonance-border transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={14} /> Settings
                </NavLink>
                <div className="border-t border-resonance-border" />
                <button
                  onClick={() => { setMenuOpen(false); onSignOut(); }}
                  role="menuitem"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-ui text-resonance-muted hover:text-resonance-danger hover:bg-resonance-danger/10 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-resonance-surface border border-resonance-border text-resonance-cream text-[10px] font-ui uppercase tracking-widest px-3 py-1.5 rounded-full pointer-events-none transition-opacity duration-200 z-50 shadow-xl"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltip.text}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
