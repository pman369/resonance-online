import { useRef, useState, type ChangeEvent } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

interface ProfileAvatarProps {
  currentUrl: string | null;
  displayName: string | null;
  email: string | null;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onUploadComplete?: (url: string) => void;
}

export function ProfileAvatar({
  currentUrl,
  displayName,
  email,
  editable = false,
  size = 'md',
  onUploadComplete
}: ProfileAvatarProps) {
  const { uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-3xl',
  };

  const initials = (displayName || email || '✧')
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || '✧';

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadAvatar(file);
      if (onUploadComplete) onUploadComplete(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative group">
      <div className={`${sizeClasses[size]} rounded-full bg-resonance-surface border-2 border-resonance-gold/30 flex items-center justify-center text-resonance-gold font-display font-bold overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-resonance-gold/60`}>
        {currentUrl ? (
          <img src={currentUrl} alt={displayName || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-resonance-bg/60 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-resonance-gold animate-spin" />
          </div>
        )}
      </div>

      {editable && !isUploading && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            aria-label="Upload profile photo"
            className="absolute bottom-0 right-0 w-8 h-8 bg-resonance-gold text-resonance-bg rounded-full flex items-center justify-center shadow-lg transform translate-x-1/4 translate-y-1/4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileSelect}
            aria-hidden="true"
            tabIndex={-1}
          />
        </>
      )}

      {error && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] bg-resonance-danger text-resonance-cream text-[10px] uppercase tracking-widest px-2 py-1 rounded shadow-xl animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}
    </div>
  );
}
