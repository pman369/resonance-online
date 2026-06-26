import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import brandIcon from '../assets/brand-icon.png';

interface AuthProps {
  onAuthSuccess?: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic-link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        if (authMethod === 'password') {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          onAuthSuccess?.();
        } else {
          const { error } = await supabase.auth.signInWithOtp({ 
            email,
            options: { emailRedirectTo: window.location.origin }
          });
          if (error) throw error;
          setMessage('A magic link has been sent to your field. 🔮');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim().toLowerCase() || email.split('@')[0],
              full_name: username.trim() || email.split('@')[0],
            },
          },
        });
        if (error) throw error;
        setMessage('Verification signal sent. Check your inbox. ✨');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected frequency interruption occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-resonance-bg overflow-hidden">
      {/* Hero Visual Area */}
      <div className="relative w-full md:w-1/2 lg:w-[60%] h-[30vh] md:h-screen bg-resonance-surface overflow-hidden border-b md:border-b-0 md:border-r border-resonance-border">
        {/* Generative Visual (using CSS gradients for extreme performance/vibes) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,229,255,0.12)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(170,0,255,0.06)_180deg,transparent_360deg)] animate-spin-slow"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="w-20 h-20 mb-8 mx-auto relative">
              <div className="absolute inset-0 bg-resonance-gold/20 rounded-full blur-2xl animate-pulse"></div>
              <img src={brandIcon} alt="Resonance" className="relative w-full h-full opacity-90 brightness-110" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display uppercase tracking-[0.4em] text-resonance-cream mb-6">
              Resonance
            </h1>
            <p className="text-resonance-muted font-body italic text-lg md:text-xl max-w-md mx-auto leading-relaxed">
              "The universe is not made of atoms; <br/> it's made of stories."
            </p>
          </motion.div>
        </div>

        {/* Ambient Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      </div>

      {/* Auth Form Area */}
      <div className="w-full md:w-1/2 lg:w-[40%] h-full flex flex-col justify-center items-center p-8 md:p-16 relative z-10">
        <div className="w-full max-w-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-view' : 'signup-view'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-10">
                <h2 className="text-2xl font-display uppercase tracking-[0.2em] text-resonance-cream mb-2">
                  {isLogin ? 'Enter the Field' : 'Begin Connection'}
                </h2>
                <p className="text-[10px] font-ui uppercase tracking-[0.3em] text-resonance-muted">
                  {isLogin ? 'Welcome back to the collective' : 'Initialize your presence'}
                </p>
              </div>

              {(error || message) && (
                <div className={`mb-8 p-4 rounded-2xl text-[11px] font-ui uppercase tracking-widest text-center border ${
                  error ? 'bg-resonance-danger/10 border-resonance-danger/20 text-resonance-danger' : 'bg-resonance-gold/10 border-resonance-gold/20 text-resonance-gold'
                }`}>
                  {error || message}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted ml-1">Username</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resonance-muted group-focus-within:text-resonance-gold transition-colors" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-resonance-surface/50 border border-resonance-border rounded-2xl text-resonance-cream font-ui text-xs tracking-wider focus:border-resonance-gold/50 focus:outline-none transition-all"
                        required={!isLogin}
                        placeholder="Choose a name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resonance-muted group-focus-within:text-resonance-gold transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-resonance-surface/50 border border-resonance-border rounded-2xl text-resonance-cream font-ui text-xs tracking-wider focus:border-resonance-gold/50 focus:outline-none transition-all"
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {(!isLogin || authMethod === 'password') && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resonance-muted group-focus-within:text-resonance-gold transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-resonance-surface/50 border border-resonance-border rounded-2xl text-resonance-cream font-ui text-xs tracking-wider focus:border-resonance-gold/50 focus:outline-none transition-all"
                        required={!isLogin || authMethod === 'password'}
                        minLength={8}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-resonance-muted hover:text-resonance-gold transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 mt-4 bg-resonance-gold text-resonance-bg font-ui font-bold uppercase tracking-[0.25em] text-[10px] rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-resonance-bg border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? (authMethod === 'password' ? 'Sign In' : 'Send Link') : 'Initialize Account'}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-8 bg-resonance-border/50"></div>
                  <span className="text-[9px] font-ui uppercase tracking-[0.3em] text-resonance-muted">or</span>
                  <div className="h-px w-8 bg-resonance-border/50"></div>
                </div>

                <button
                  onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
                  className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted hover:text-resonance-cream transition-colors block w-full"
                >
                  {isLogin ? (
                    <span>New to the field? <span className="text-resonance-gold font-bold">Join the collective</span></span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><ChevronLeft size={14} /> Back to Sign In</span>
                  )}
                </button>

                {isLogin && (
                  <button 
                    onClick={() => setAuthMethod(authMethod === 'password' ? 'magic-link' : 'password')}
                    className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted hover:text-resonance-gold transition-colors"
                  >
                    {authMethod === 'password' ? 'Switch to Magic Link' : 'Switch to Password'}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
