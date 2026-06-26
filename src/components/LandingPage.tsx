import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Waves, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Infinity
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- Types ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  blurContent: string;
}

// --- Components ---

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, blurContent }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative p-8 bg-resonance-surface border border-resonance-border rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 text-resonance-gold">{icon}</div>
        <h3 className="text-2xl font-display text-resonance-cream mb-4">{title}</h3>
        
        <div className="relative mb-6 flex-grow">
          <div className="text-resonance-muted text-sm leading-relaxed filter blur-[4px] select-none">
            {blurContent}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-3 py-1 bg-resonance-surface/80 border border-resonance-gold/50 rounded-full">
              <span className="text-[10px] font-ui uppercase tracking-widest text-resonance-gold flex items-center gap-1.5">
                <Lock size={10} /> Members Only
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-resonance-muted font-ui text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

interface AuthModuleProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthModule: React.FC<AuthModuleProps> = ({ isLogin, setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('✉️ AuthModule: handleAuth triggered', { isLogin, email, hasPassword: !!password, username });
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        console.log('🔑 AuthModule: Attempting signInWithPassword...');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error('❌ AuthModule: signInWithPassword failed:', error.message);
          throw error;
        }
        console.log('✅ AuthModule: signInWithPassword success:', data.user?.email);
      } else {
        console.log('🌱 AuthModule: Attempting signUp...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || email.split('@')[0],
              full_name: username.trim() || email.split('@')[0],
            },
          },
        });
        if (error) {
          console.error('❌ AuthModule: signUp failed:', error.message);
          throw error;
        }
        console.log('✅ AuthModule: signUp success:', data.user?.email);
        setSuccessMsg('Check your email for the confirmation link! ✨');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth" className="py-24 px-6 border-t border-resonance-border bg-resonance-bg/50">
      <div className="max-w-md mx-auto relative">
        {/* Decorative background element */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-resonance-gold/10 via-transparent to-resonance-gold/5 rounded-[40px] blur-xl pointer-events-none" />
        
        <motion.div 
          layout
          className="relative bg-resonance-surface border border-resonance-border rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <span className="text-[10px] font-ui uppercase tracking-[0.3em] text-resonance-gold mb-2 block font-bold">
                  {isLogin ? 'Welcome Back' : 'Connection Hub'}
                </span>
                <h2 className="text-3xl font-display text-resonance-cream">
                  {isLogin ? 'Re-enter the Field' : 'Initialize Connection'}
                </h2>
              </div>

              {(errorMsg || successMsg) && (
                <div className={`mb-6 p-4 rounded-xl text-[11px] font-ui uppercase tracking-widest text-center border ${
                  errorMsg ? 'bg-resonance-danger/10 border-resonance-danger/20 text-resonance-danger' : 'bg-resonance-gold/10 border-resonance-gold/20 text-resonance-gold'
                }`}>
                  {errorMsg || successMsg}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted ml-1">Username</label>
                    <input
                      type="text"
                      placeholder="Identified as..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-resonance-bg/50 border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui text-sm focus:outline-none focus:border-resonance-gold/50 transition-all"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@energy.field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-resonance-bg/50 border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui text-sm focus:outline-none focus:border-resonance-gold/50 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-ui uppercase tracking-widest text-resonance-muted ml-1">Secure Key</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-resonance-bg/50 border border-resonance-border rounded-xl px-4 py-3 text-resonance-cream font-ui text-sm focus:outline-none focus:border-resonance-gold/50 transition-all"
                      required
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

                {!isLogin && (
                  <label className="flex items-center gap-3 cursor-pointer group mt-4">
                    <input type="checkbox" className="w-4 h-4 bg-resonance-bg border-resonance-border rounded accent-resonance-gold" required />
                    <span className="text-[11px] text-resonance-muted font-ui">
                      I accept the <span className="text-resonance-gold group-hover:underline">Collective Agreement</span>
                    </span>
                  </label>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-resonance-gold text-resonance-bg font-ui font-bold uppercase tracking-widest text-xs rounded-full hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-resonance-bg border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Enter Field' : 'Begin Journey'}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-resonance-border/50 text-center">
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); setUsername(''); }}
                  className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted hover:text-resonance-gold transition-colors"
                >
                  {isLogin ? (
                    <span className="flex items-center gap-2">New to the collective? <span className="text-resonance-gold font-bold">Join here</span></span>
                  ) : (
                    <span className="flex items-center gap-2">Already resonated? <span className="text-resonance-gold font-bold">Sign In</span></span>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 100);
      
      const authSection = document.getElementById('auth');
      if (authSection) {
        const rect = authSection.getBoundingClientRect();
        // Show if scrolled down AND auth section is not yet visible
        setShowMobileCTA(window.scrollY > 600 && rect.top > window.innerHeight);
      } else {
        setShowMobileCTA(window.scrollY > 600);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAuth = (loginMode: boolean) => {
    setIsLogin(loginMode);
    document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-resonance-bg text-resonance-cream relative selection:bg-resonance-gold selection:text-resonance-bg overflow-x-hidden">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Breathing Radial Gradient */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-resonance-gold rounded-full blur-[120px] pointer-events-none"
        />

        {/* Top Nav */}
        <nav className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-500 ${showStickyNav ? 'bg-resonance-bg/80 backdrop-blur-md border-b border-resonance-border' : ''}`}>
          <div className="font-display uppercase tracking-[0.15em] text-lg">Resonance</div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => scrollToAuth(true)}
              className="font-ui text-sm text-resonance-cream hover:text-resonance-gold transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => scrollToAuth(false)}
              className="font-ui text-sm px-6 py-2 bg-resonance-gold text-resonance-bg rounded-full font-semibold hover:brightness-110 transition-all"
            >
              Join
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-3xl z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-6 block"
          >
            A place to feel heard.
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display leading-[1.1] mb-8"
          >
            Some things don't have an audience. <br className="hidden md:block" /> Until now.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-xl md:text-2xl font-body italic text-resonance-muted mb-12 max-w-xl mx-auto"
          >
            Resonance is where the quiet, the honest, and the deeply felt find form. Journal. Share. Listen. Belong.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => scrollToAuth(false)}
              className="px-8 py-4 bg-resonance-gold text-resonance-bg font-ui font-semibold rounded-full hover:brightness-110 transition-all"
            >
              Begin Your Journey
            </button>
            <button className="px-8 py-4 bg-transparent text-resonance-cream font-ui font-semibold flex items-center justify-center gap-2 hover:text-resonance-gold transition-colors group">
              Learn What This Is <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          <span className="text-[10px] font-ui uppercase tracking-[0.2em] text-resonance-muted">Scroll</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-resonance-gold to-transparent"
          />
        </div>

        {/* Visitor Restriction Badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1.5 bg-resonance-surface border border-resonance-border rounded-full flex items-center gap-2">
            <Lock size={12} className="text-resonance-muted" />
            <span className="text-[11px] font-ui text-resonance-muted tracking-wide">Full access requires a free account</span>
          </div>
        </div>
      </header>

      {/* Manifesto Section */}
      <section className="py-32 px-6 border-y border-resonance-border relative overflow-hidden">
        <div className="max-w-[740px] mx-auto text-center relative z-10">
          <span className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-8 block">Our Manifesto</span>
          <h2 className="text-4xl md:text-5xl font-display mb-16 border-l-4 border-resonance-gold pl-8 text-left leading-tight">
            We built this for the <br /> unposted thought.
          </h2>
          
          <div className="space-y-12 text-lg md:text-xl font-body leading-relaxed text-resonance-muted text-left">
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              The world has enough platforms for performance. We built one for presence. Resonance exists for the thoughts you almost deleted, the feelings you couldn't caption, and the parts of yourself you haven't introduced yet.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We believe that sharing something true is an act of courage. And that the right space — quiet, intentional, without algorithmic noise — can hold that courage without cheapening it.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Here, your expression is not content. It is signal. And signal deserves to travel to the people it will actually reach.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-resonance-cream"
            >
              This is Resonance. A frequency of your own.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-sm italic"
            >
              Built with care. Designed to protect your depth. Free to join.
            </motion.p>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] text-resonance-border/20 font-display pointer-events-none select-none">§</div>
      </section>

      {/* Feature Teaser Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={<BookOpen size={32} />}
            title="Your Journal"
            blurContent="Today I felt a strange sense of longing. Not for a person or a place, but for a version of myself I haven't met yet. The sunlight hit the floor and I realized..."
            description="Write daily reflections, voice your fears, or capture the moment. Only you decide what travels further."
          />
          <FeatureCard 
            icon={<Waves size={32} />}
            title="The Feed"
            blurContent="47 resonated with this: 'The silence between two people is never truly empty. It's filled with everything they aren't saying.' 2 hours ago."
            description="A curated stream of honest expression from people who chose to share. No virality. No noise."
          />
          <FeatureCard 
            icon={<Infinity size={32} />}
            title="Circles"
            blurContent="Circle: Deep Ecology. Members: 12. Recent Activity: New resonance found in 'The Overstory' discussion. 'We are the trees thinking about themselves.'"
            description="Join intimate groups built around shared resonance — not shared demographics."
          />
        </div>
        <div className="text-center">
          <p className="font-display text-2xl mb-8 text-resonance-muted">Ready to experience this?</p>
          <button 
            onClick={() => scrollToAuth(false)}
            className="px-8 py-4 bg-resonance-gold text-resonance-bg font-ui font-semibold rounded-full hover:brightness-110 transition-all inline-block"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Community Pulse */}
      <section className="py-32 px-6 bg-resonance-surface/50 border-y border-resonance-border">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[11px] font-ui uppercase tracking-[0.2em] text-resonance-muted mb-12 block">Live from Resonance</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-resonance-bg p-6 rounded-xl border border-resonance-border text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${i === 1 ? 'from-resonance-gold to-resonance-muted' : i === 2 ? 'from-resonance-danger to-resonance-gold' : 'from-resonance-muted to-resonance-cream'} opacity-50`} />
                  <div className="h-2 w-20 bg-resonance-border rounded" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-resonance-border rounded" />
                  <div className="h-3 w-3/4 bg-resonance-border rounded" />
                </div>
                <p className="text-[11px] text-resonance-gold font-ui">
                  {Math.floor(Math.random() * 100 + 20)} resonated with this
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-5xl md:text-7xl font-display text-resonance-gold mb-4">2,841</h3>
          <p className="text-xl font-body text-resonance-muted mb-8">moments shared this week</p>
          <p className="text-sm font-ui text-resonance-muted">Join to read, respond, and share your own.</p>
        </div>
      </section>

      {/* Visitor Restriction Notice */}
      <section className="py-32 px-6">
        <div className="max-w-xl mx-auto bg-resonance-surface border border-resonance-border rounded-2xl p-12 text-center">
          <Lock size={32} className="text-resonance-gold mx-auto mb-8" />
          <h2 className="text-3xl font-display text-resonance-cream mb-6">Some things here are meant for members.</h2>
          <p className="text-resonance-muted font-body leading-relaxed mb-12">
            Resonance is a protected space. To read posts, join Circles, use your Journal, or interact with others — you'll need a free account.
            <br /><br />
            We don't ask for much. Just enough to know you're a real person who chose to be here intentionally.
          </p>

          <div className="grid grid-cols-1 gap-4 text-left max-w-sm mx-auto mb-12">
            <div className="flex items-center gap-3 text-resonance-muted">
              <span className="text-resonance-muted/50 text-xl font-ui">✗</span>
              <span className="text-sm font-ui">Reading the feed requires an account</span>
            </div>
            <div className="flex items-center gap-3 text-resonance-muted">
              <span className="text-resonance-muted/50 text-xl font-ui">✗</span>
              <span className="text-sm font-ui">Posting or responding requires an account</span>
            </div>
            <div className="flex items-center gap-3 text-resonance-muted">
              <span className="text-resonance-muted/50 text-xl font-ui">✗</span>
              <span className="text-sm font-ui">Circles and community features require an account</span>
            </div>
            <div className="mt-4 pt-4 border-t border-resonance-border space-y-4">
              <div className="flex items-center gap-3 text-resonance-gold">
                <span className="text-xl font-ui">✓</span>
                <span className="text-sm font-ui">Creating an account is free</span>
              </div>
              <div className="flex items-center gap-3 text-resonance-gold">
                <span className="text-xl font-ui">✓</span>
                <span className="text-sm font-ui">No credit card required to start</span>
              </div>
              <div className="flex items-center gap-3 text-resonance-gold">
                <span className="text-xl font-ui">✓</span>
                <span className="text-sm font-ui">You control your privacy at every level</span>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] font-ui italic text-resonance-muted">
            Accounts are reviewed to maintain the quality and safety of the Resonance space. Most approvals happen instantly.
          </p>
        </div>
      </section>

      {/* Auth Section */}
      <AuthModule isLogin={isLogin} setIsLogin={setIsLogin} />

      {/* Mobile Sticky CTA Bar */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden"
          >
            <button 
              onClick={() => scrollToAuth(false)}
              className="w-full py-4 bg-resonance-gold text-resonance-bg font-ui font-bold rounded-full shadow-2xl flex items-center justify-center active:scale-[0.98] transition-transform"
            >
              Join Free
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-24 px-6 max-w-7xl mx-auto border-t border-resonance-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          <div>
            <div className="font-display uppercase tracking-[0.15em] text-lg mb-4 text-resonance-cream">Resonance</div>
            <p className="text-resonance-muted font-body italic">Feel more. Share wisely.</p>
          </div>
          
          <div className="flex flex-col gap-4 text-sm font-ui text-resonance-muted">
            <a href="#" className="hover:text-resonance-gold transition-colors">About</a>
            <a href="#" className="hover:text-resonance-gold transition-colors">Manifesto</a>
            <a href="#" className="hover:text-resonance-gold transition-colors">Community Agreement</a>
            <a href="#" className="hover:text-resonance-gold transition-colors">Blog</a>
            <a href="#" className="hover:text-resonance-gold transition-colors">Help</a>
          </div>

          <div className="text-sm font-ui text-resonance-muted">
            <p className="mb-4">© 2025 Resonance. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-resonance-gold transition-colors text-xs">Privacy Policy</a>
              <a href="#" className="hover:text-resonance-gold transition-colors text-xs">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <p className="text-[10px] italic text-resonance-muted/50 font-ui">
            This platform is designed with intention. Please use it accordingly.
          </p>
        </div>
      </footer>
    </div>
  );
}
