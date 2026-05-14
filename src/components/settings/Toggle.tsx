interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ id, checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-6 group">
      <div className="flex-1">
        <label htmlFor={id} className="font-ui text-sm text-resonance-cream block cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="font-ui text-xs text-resonance-muted leading-relaxed mt-1">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-12 h-6 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-resonance-gold focus-visible:ring-offset-2 focus-visible:ring-offset-resonance-bg ${
          checked
            ? 'bg-resonance-gold border-resonance-gold'
            : 'bg-resonance-border border-resonance-border'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-resonance-bg shadow transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
          aria-hidden="true"
        />
        <span className="sr-only">{checked ? 'Enabled' : 'Disabled'}</span>
      </button>
    </div>
  );
}
