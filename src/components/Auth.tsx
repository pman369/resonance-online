import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';
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

  const getFriendlyError = (err: any) => {
    const message = err.message || '';
    if (message.includes('Invalid login credentials')) {
      return "Credentials not recognized. Please verify and try again.";
    }
    if (message.includes('User already registered')) {
      return "This email is already registered. Please sign in.";
    }
    return message || "An unexpected error occurred. Please try again.";
  };

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
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error) throw error;
          setMessage('Magic link sent. Please check your inbox. 🔮');
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
        setMessage('Confirmation link sent. Please check your email. ✨');
        setEmail('');
        setPassword('');
        setUsername('');
      }
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-resonance-bg px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.05)_0%,transparent_70%)]"></div>
      </div>

      <div className="relative w-full max-w-[400px] z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <img src={brandIcon} alt="Resonance" className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h1 className="text-3xl font-display uppercase tracking-[0.3em] text-resonance-cream mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-resonance-muted font-ui text-[10px] uppercase tracking-[0.4em]">
            {isLogin ? 'Continue your journey' : 'Join the collective field'}
          </p>
        </motion.div>

        <motion.div 
          layout
          className="bg-resonance-surface/40 backdrop-blur-2xl rounded-[32px] p-10 border border-resonance-border shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-4 bg-resonance-danger/10 border border-resonance-danger/20 rounded-2xl text-resonance-cream text-[11px] font-body italic text-center"
              >
                {error}
              </motion.div>
            )}
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-4 bg-resonance-gold/10 border border-resonance-gold/20 rounded-2xl text-resonance-gold text-[11px] font-body italic text-center"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resonance-muted group-focus-within:text-resonance-gold transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-resonance-bg/50 border border-resonance-border rounded-2xl text-resonance-cream font-ui text-xs tracking-wider focus:border-resonance-gold/50 focus:outline-none transition-all"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div key="email" layout className="space-y-2">
                <label className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resonance-muted group-focus-within:text-resonance-gold transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-resonance-bg/50 border border-resonance-border rounded-2xl text-resonance-cream font-ui text-xs tracking-wider focus:border-resonance-gold/50 focus:outline-none transition-all"
                    required
                  />
                </div>
              </motion.div>

              {(!isLogin || authMethod === 'password') && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resonance-muted group-focus-within:text-resonance-gold transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-resonance-bg/50 border border-resonance-border rounded-2xl text-resonance-cream font-ui text-xs tracking-wider focus:border-resonance-gold/50 focus:outline-none transition-all"
                      required={!isLogin || authMethod === 'password'}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-resonance-muted hover:text-resonance-gold transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-resonance-gold text-resonance-bg font-ui font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-resonance-bg border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? (authMethod === 'password' ? 'Sign In' : 'Send Magic Link') : 'Create Account'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-8 pt-6 border-t border-resonance-border/50 flex flex-col items-center gap-4">
              <button 
                onClick={() => setAuthMethod(authMethod === 'password' ? 'magic-link' : 'password')}
                className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted hover:text-resonance-gold transition-colors flex items-center gap-2"
              >
                {authMethod === 'password' ? (
                  <><Sparkles size={12} /> Use Magic Link</>
                ) : (
                  <><Lock size={12} /> Use Password</>
                )}
              </button>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
            className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted hover:text-resonance-cream transition-colors"
          >
            {isLogin ? (
              <span className="flex items-center justify-center gap-2">New here? <span className="text-resonance-gold font-bold">Join the collective</span></span>
            ) : (
              <span className="flex items-center justify-center gap-2"><ChevronLeft size={14} /> Back to Sign In</span>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
