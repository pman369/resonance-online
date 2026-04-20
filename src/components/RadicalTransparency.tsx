import React from 'react';
import { Eye, Brain, Zap, Shield, Code } from 'lucide-react';

const RadicalTransparency: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold">Radical Transparency</h2>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">
          You have a right to know exactly how this works. No black boxes. No hidden agendas.
          Here's what's happening behind the scenes.
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl border border-indigo-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-indigo-900">How the AI Works</h3>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong className="text-indigo-900">Technology:</strong> We use Perplexity's Sonar models—advanced language models optimized for specialized insights and search-augmented responses.
          </p>
          <p>
            <strong className="text-indigo-900">What we send:</strong> Only the text you explicitly share (journal entries, questions, situations). No personal identifiers, no metadata.
          </p>
          <p>
            <strong className="text-indigo-900">What we get back:</strong> The AI generates responses based on sophisticated pattern matching. It's not conscious—it's intelligence at scale, used as a mirror for your own awareness.
          </p>
          <p>
            <strong className="text-indigo-900">Rate limits:</strong> 30 requests per minute per IP to prevent abuse and keep the collective field stable for everyone.
          </p>
        </div>
      </div>

      {/* What We Store */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-bold text-emerald-900">What We Store</h3>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Browser Environment (Your Device)</p>
              <p className="text-sm">Your immediate session data lives in your browser. We prioritize your privacy by keeping your active reflections local.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Supabase (Secure Storage)</p>
              <p className="text-sm">If you use Notes, those reflections are stored in your private Supabase account. You own your data. We don't analyze or sell it.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">AI API Privacy</p>
              <p className="text-sm">Perplexity processes your text to generate reflections. Their privacy policy applies. We don't log or store your inputs on our servers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Don't Do */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl border border-rose-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="w-6 h-6 text-rose-600" />
          <h3 className="text-xl font-bold text-rose-900">What We Don't Do</h3>
        </div>
        
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-rose-600 font-bold mt-1">✗</span>
            <span>We don't sell your data. Ever.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-rose-600 font-bold mt-1">✗</span>
            <span>We don't train models on your private inputs.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-rose-600 font-bold mt-1">✗</span>
            <span>We don't share data with third parties (except AI for processing).</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-rose-600 font-bold mt-1">✗</span>
            <span>We don't use tracking cookies or aggressive analytics.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-rose-600 font-bold mt-1">✗</span>
            <span>We don't claim the AI is conscious. It's a mirror, not a guru.</span>
          </li>
        </ul>
      </div>

      {/* Technical Stack */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border border-amber-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Code className="w-6 h-6 text-amber-600" />
          <h3 className="text-xl font-bold text-amber-900">Technical Stack</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-amber-900 mb-2">Frontend</p>
            <ul className="text-gray-700 space-y-1">
              <li>• React 18 + TypeScript</li>
              <li>• Vite (Modern Build Tool)</li>
              <li>• Tailwind CSS</li>
              <li>• Lucide Icons</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <p className="font-semibold text-amber-900 mb-2">Backend & AI</p>
            <ul className="text-gray-700 space-y-1">
              <li>• Supabase Edge Functions (Deno)</li>
              <li>• Perplexity AI (Sonar Models)</li>
              <li>• Supabase Auth & Database</li>
              <li>• Vercel (Deployment)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Our Philosophy */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl border-2 border-indigo-200 shadow-lg">
        <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">Our North Star</h3>
        <div className="space-y-4 text-gray-700 leading-relaxed max-w-3xl mx-auto">
          <p className="text-lg font-semibold text-indigo-600 italic text-center">
            "We succeed when you trust yourself more, not the AI more."
          </p>
          <p>
            This isn't about creating dependency on technology. It's about using technology
            as a mirror—to help you see yourself more clearly, trust your own wisdom more deeply,
            and live more consciously.
          </p>
          <p>
            The AI doesn't know you. It can't feel your pain, your joy, your becoming.
            It's pattern matching. But sometimes, seeing patterns reflected back helps
            you recognize what was already there.
          </p>
          <p>
            We're building this openly because transparency is trust. And trust is
            the foundation of any tool that claims to support human consciousness.
          </p>
        </div>
      </div>

      {/* Open Source */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Want to See the Code?</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          This project is open source. You can inspect every line, understand every decision,
          and even contribute improvements. Technology serving consciousness should be
          built in the light.
        </p>
        <p className="text-sm text-gray-600 italic">
          Check the repository to explore the full codebase, report issues, or suggest features.
        </p>
      </div>
    </div>
  );
};

export default RadicalTransparency;
