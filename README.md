# Resonance - Consciousness Elevation Platform

🌀 **AI-amplified consciousness elevation platform built with React, TypeScript, Vite, Tailwind CSS, and Supabase.**

## ✨ Features

### Authentication & User Management
- 🔐 Email/Password authentication via Supabase
- ✉️ Magic link login support
- 👤 Automatic profile creation on signup
- 🔒 Secure session management with RLS policies

### Consciousness Tools
- **🧠 Consciousness Mapping** - AI analyzes journal entries to reflect your frequency
- **🔮 Synchronicity Engine** - Generate meaningful coincidences and resources
- **📖 Ancient Wisdom** - Bridge traditional wisdom to modern situations
- **🌙 Shadow Integration** - Compassionate exploration of blind spots
- **📰 Consciousness Feed** - Curated consciousness insights
- **💫 Daily Intentions** - Generate and track daily practices
- **🌍 Collective Coherence** - Track global consciousness metrics
- **👁️ Radical Transparency** - See exactly how the AI works

### Community Features (Database Ready)
- 📝 Notes with Supabase storage
- 👥 Community Circles
- 💬 Discussions & Replies
- 📖 Community Stories
- ❤️ Likes & Comments system

### Digital Wellness
- ⏱️ Digital Sabbath timer
- 📵 Offline encouragement
- 🧘 Presence protocols

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier works)
- (Optional) Gemini API key for AI features

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration (get from your Supabase project)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Supabase Backend

Follow these steps:

1. Create a new Supabase project
2. Run the SQL migrations to create tables
3. Enable Row Level Security (RLS)
4. Deploy Edge Functions (for AI proxy)
5. Configure authentication providers

**Quick Setup Command:**
```bash
# If you have Supabase CLI installed
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build & Deploy

### Development Build
```bash
npm run build
npm run preview
```

### Production Deployment

The frontend is configured for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use any static hosting:
```bash
npm run build
# Deploy the `dist` folder to your hosting
```

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React + Vite) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐
│Supabase │
│  Auth   │
│  DB     │
│  Edge   │
│  Funcs  │
└────┬────┘
     │
     ▼
┌─────────────┐
│  AI APIs    │
│ (Perplexity,│
│  Gemini,    │
│  etc.)      │
└─────────────┘
```

## 📁 Project Structure

```
resonance-web/
├── src/
│   ├── components/        # React components
│   │   ├── Auth.tsx      # Login/Signup page
│   │   ├── Notes.tsx     # Notes with Supabase
│   │   └── ...           # Feature components
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client
│   │   └── AuthContext.tsx # Auth provider
│   ├── api/
│   │   └── client.ts     # API client for backend
│   ├── utils/
│   │   └── supabase/     # Supabase utilities
│   ├── assets/           # Images and icons
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── supabase/
│   ├── functions/        # Edge Functions
│   │   ├── perplexity-proxy/
│   │   └── generate-daily-intentions/
│   └── config.toml       # Supabase config
├── public/
│   └── favicon.ico       # Brand icon
├── .env                  # Environment variables (not committed)
├── .env.vite            # Vite environment (example)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ User data isolated by `user_id`
- ✅ API keys stored server-side only
- ✅ Rate limiting on backend endpoints (30 req/min)
- ✅ Secure authentication with Supabase
- ✅ JWT-based session management

## 🗄️ Database Schema

The app uses 22 tables in Supabase:

**Core Tables:**
- `profiles` - User profiles (extends auth.users)
- `consciousness_entries` - Journal entries with AI analysis
- `synchronicity_sessions` - Synchronicity tracking
- `wisdom_sessions` - Wisdom consultations
- `shadow_entries` - Shadow integration work
- `daily_intentions` - Daily practice intentions

**Community Tables:**
- `community_stories`, `story_likes`, `story_comments`
- `circles`, `circle_members`
- `discussions`, `discussion_replies`, `discussion_likes`

**Utility Tables:**
- `coherence_logs`, `global_coherence`
- `feed_items`, `session_logs`, `notes`



## 🤖 AI Integration

The application uses Supabase Edge Functions as a secure proxy to interact with AI APIs (like Perplexity AI or Gemini). This ensures that API keys are never exposed to the client.

To deploy the functions to your Supabase project:
```bash
npx supabase functions deploy consciousness-ai
npx supabase secrets set PERPLEXITY_API_KEY=your-key
```

To run functions locally for development:
```bash
npx supabase functions serve
```

## 🧪 Testing

### Test Authentication
1. Open the app
2. Sign up with a new email
3. Check email for confirmation link
4. Log in and explore features

### Test Notes (Supabase Integration)
1. Navigate to Notes
2. Create a new note
3. Refresh page - note should persist
4. Delete note - should remove from database

### Test AI Features
1. Ensure edge functions are deployed or running locally
2. Try Consciousness Mapping
3. Enter journal text
4. See AI analysis results

## 📝 Documentation

- `README.md` - This file (project overview and setup)

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** Google Gemini API / Perplexity API
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## 📄 License

Open source core, proprietary UX/content

## 🙏 Acknowledgments

Built with intention to amplify human consciousness through technology.

**North Star:** *"We succeed when you trust yourself more, not the AI more."*

---

**Need help?** Check the documentation files or open an issue.
