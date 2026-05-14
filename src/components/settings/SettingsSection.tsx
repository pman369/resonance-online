import React from 'react';

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({ icon: Icon, title, description, children }: SettingsSectionProps) {
  return (
    <div className="bg-resonance-surface p-8 rounded-2xl border border-resonance-border shadow-xl space-y-6">
      <div className="flex items-center gap-4 pb-6 border-b border-resonance-border">
        <div className="w-10 h-10 bg-resonance-gold/10 rounded-full flex items-center justify-center border border-resonance-gold/30">
          <Icon className="w-5 h-5 text-resonance-gold" />
        </div>
        <div>
          <h2 className="text-xl font-display text-resonance-cream">{title}</h2>
          {description && (
            <p className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
