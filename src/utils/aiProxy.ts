export interface IntentResult {
  route: string;
  intensity: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity';
  confidence: number;
  matchedKeywords: string[];
  reframe: string;
}

const INTENT_MAP: Array<{
  route: string;
  keywords: string[];
  reframes: string[];
}> = [
  {
    route: '/shadow',
    keywords: ['shadow', 'fear', 'shame', 'guilt', 'trauma', 'wound', 'darkness', 'trigger', 'anger', 'protector', 'defense', 'scared', 'hurt', 'pain', 'sadness', 'insecure', 'jealousy'],
    reframes: [
      "We hear the voice of a protector trying to keep you safe. Let's step into Shadow Integration to meet it with compassion.",
      "An emotional edge has appeared. Let us create a safe container in Shadow Work to honor this part of your journey."
    ]
  },
  {
    route: '/wisdom',
    keywords: ['wisdom', 'ancient', 'buddha', 'buddhism', 'tao', 'taoism', 'stoic', 'stoicism', 'zen', 'lineage', 'philosophy', 'teaching', 'sufi', 'indigenous', 'ancestors', 'linage'],
    reframes: [
      "Seeking timeless perspectives? Tuning into Ancient Wisdom to bridge lineage teachings with your present moment.",
      "Connecting your inquiry with the ancestors. Let's consult the lineages in the Ancient Wisdom module."
    ]
  },
  {
    route: '/mapping',
    keywords: ['map', 'frequency', 'consciousness', 'vibe', 'energy', 'state', 'analyze', 'journal', 'frequency mapping', 'mood', 'feeling'],
    reframes: [
      "Ready to reflect and document your state. Navigating to Consciousness Mapping to plot your current frequency.",
      "Creating space for psychological mirroring. Let's map your present-moment awareness."
    ]
  },
  {
    route: '/synchronicity',
    keywords: ['sync', 'synchronicity', 'coincidence', 'sign', 'universe', 'meaningful', 'oracle', 'guidance', 'destiny', 'fate', 'random'],
    reframes: [
      "Scanning the field for meaningful alignments. Accessing the Synchronicity Engine...",
      "Looking beyond randomness. Let's surface what is waiting for you in the Synchronicity Engine."
    ]
  },
  {
    route: '/coherence',
    keywords: ['coherence', 'collective', 'field', 'global', 'unite', 'heart', 'cohesion', 'resonance field', 'interconnected', 'we'],
    reframes: [
      "Tuning your heart frequency with the collective field. Navigating to Collective Coherence.",
      "Sensing the shared field of presence. Let's synchronize with active participants globally."
    ]
  },
  {
    route: '/presence',
    keywords: ['presence', 'breathe', 'breath', 'live', 'exit', 'quit', 'leave', 'disconnect', 'offline', 'stop', 'rest', 'peace', 'silence', 'still', 'meditate'],
    reframes: [
      "Entering pure awareness. The portal is preparing the Presence Protocol to guide your transition offline.",
      "Honoring your screen-free exit. Initiating the Presence decay sequence for offline integration."
    ]
  },
  {
    route: '/feed',
    keywords: ['feed', 'insights', 'stories', 'stream', 'recent', 'field', 'news', 'share', 'posts', 'updates'],
    reframes: [
      "Connecting with the shared flow of insights. Loading the Consciousness Feed.",
      "Gathering collective growth notes. Opening the Live Field Insights."
    ]
  },
  {
    route: '/history',
    keywords: ['history', 'past', 'journey', 'archive', 'previous', 'log', 'records', 'timeline', 'saved', 'reflections'],
    reframes: [
      "Opening your sacred archive. Retracing your developmental history...",
      "Retrieving past reflections to illuminate your current trajectory."
    ]
  },
  {
    route: '/community',
    keywords: ['community', 'hub', 'chat', 'connect', 'group', 'discussion', 'forums', 'spaces', 'circle'],
    reframes: [
      "Connecting to the local resonance circle. Opening the Community Hub.",
      "Joining the coherent circle. Navigating to the Community space."
    ]
  },
  {
    route: '/transparency',
    keywords: ['transparency', 'code', 'open', 'how it works', 'algorithm', 'ethics', 'audit', 'rules', 'data', 'privacy'],
    reframes: [
      "Opening the mirror's code. Accessing Radical Transparency for full architectural audits.",
      "Honoring sovereignty through clarity. Loading the transparency metrics and source files."
    ]
  },
  {
    route: '/notes',
    keywords: ['note', 'notes', 'scratchpad', 'write', 'thought', 'idea', 'memo', 'draft', 'jot'],
    reframes: [
      "Opening a blank slate for your thoughts. Activating the Notes scratchpad.",
      "Accessing your private integration notebook."
    ]
  },
  {
    route: '/profile',
    keywords: ['profile', 'me', 'account', 'identity', 'avatar', 'display name'],
    reframes: [
      "Viewing your manifest identity. Navigating to your Profile page.",
      "Tuning your individual configurations. Opening Profile..."
    ]
  },
  {
    route: '/settings',
    keywords: ['settings', 'preferences', 'audio', 'theme', 'configure', 'toggles', 'options'],
    reframes: [
      "Opening the control center. Loading Settings and system configurations.",
      "Adjusting sensory layers. Opening Settings..."
    ]
  }
];

const RESISTANCE_WORDS = ['fear', 'anger', 'hurt', 'pain', 'shadow', 'hate', 'scared', 'anxious', 'resist', 'block', 'broken', 'wound'];
const REFLECTIVE_WORDS = ['why', 'how', 'reflect', 'learn', 'journal', 'wisdom', 'meditate', 'seek', 'meaning', 'soul', 'purpose'];

export function analyzeIntent(input: string): IntentResult {
  const cleanInput = input.toLowerCase().trim();
  
  if (!cleanInput) {
    return {
      route: '/home',
      intensity: 'neutral',
      confidence: 1.0,
      matchedKeywords: [],
      reframe: "Returning to the center of Resonance. Welcome back to presence."
    };
  }

  let bestMatch = {
    route: '/home',
    confidence: 0,
    matchedKeywords: [] as string[],
    reframe: "Focusing awareness. Initiating transition to the requested module."
  };

  // Scan through routes for keyword matches
  INTENT_MAP.forEach(item => {
    const matches = item.keywords.filter(keyword => cleanInput.includes(keyword));
    // Score based on matching keyword lengths (favors specific words over short substrings)
    const score = matches.reduce((acc, word) => acc + word.length, 0);
    
    if (score > bestMatch.confidence) {
      const randomReframe = item.reframes[Math.floor(Math.random() * item.reframes.length)];
      bestMatch = {
        route: item.route,
        confidence: score,
        matchedKeywords: matches,
        reframe: randomReframe
      };
    }
  });

  // Calculate intensity based on emotional modifiers
  let intensity: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity' = 'neutral';
  
  const hasResistance = RESISTANCE_WORDS.some(w => cleanInput.includes(w));
  const hasReflective = REFLECTIVE_WORDS.some(w => cleanInput.includes(w));

  if (hasResistance) {
    intensity = 'high-resistance';
  } else if (hasReflective) {
    intensity = 'reflective';
  } else if (cleanInput.length < 8) {
    intensity = 'low-intensity';
  }

  // Fallback to Consciousness Mapping if they are journaling long text but no specific keyword matches
  if (bestMatch.route === '/home' && cleanInput.split(/\s+/).length > 6) {
    bestMatch = {
      route: '/mapping',
      confidence: 1,
      matchedKeywords: ['long_input_journal'],
      reframe: "Reflective stream detected. Navigating to Consciousness Mapping to process your entry."
    };
  }

  return {
    route: bestMatch.route,
    intensity,
    confidence: bestMatch.confidence > 0 ? Math.min(1.0, bestMatch.confidence / 10) : 0.5,
    matchedKeywords: bestMatch.matchedKeywords,
    reframe: bestMatch.reframe
  };
}
