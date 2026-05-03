import { callPerplexity } from "./utils.ts";

export async function handleConsciousnessMap(body: any) {
  const { journalText } = body;
  if (!journalText?.trim()) {
    throw new Error("Journal text is required");
  }

  const prompt = `You are a consciousness mapping AI. Analyze this journal entry with deep empathy and insight. Identify:
1. Core emotional frequency (what state they're vibrating in)
2. Growth edges (areas ready for expansion)
3. Flow triggers (what brings them into presence)
4. Unconscious patterns (gentle observations)
5. Next step wisdom (one actionable insight)

Be poetic, profound, and personal. Speak as a wise mirror, not a therapist.

Journal entry: "${journalText}"

Respond ONLY with valid JSON in this exact format:
{
  "frequency": "brief description of their current vibration",
  "growthEdges": ["edge1", "edge2"],
  "flowTriggers": ["trigger1", "trigger2"],
  "patterns": "gentle observation of a pattern",
  "nextStep": "one profound, actionable insight"
}`;

  return await callPerplexity(
    "RESPOND ONLY WITH VALID JSON. NO OTHER TEXT. NO MARKDOWN FORMATTING.",
    prompt
  );
}

export async function handleSynchronicity(body: any) {
  const { interest } = body;
  if (!interest?.trim()) {
    throw new Error("Interest is required");
  }

  const prompt = `You are a synchronicity engine. The user is exploring: "${interest}"

Generate 5 meaningful "coincidences" that feel serendipitous and perfectly timed:
- 2 book/resource recommendations with brief insight why they're perfect right now
- 1 practice/exercise to embody this learning
- 1 question to contemplate
- 1 person archetype they might benefit from connecting with

Make it feel magical but not contrived. Like the universe is winking at them.

Respond ONLY with valid JSON in this exact format:
{
  "resources": [{"title": "title", "insight": "why now"}],
  "practice": "embodied practice description",
  "question": "contemplation question",
  "connection": "type of person to seek out"
}`;

  return await callPerplexity(
    "RESPOND ONLY WITH VALID JSON. NO OTHER TEXT. NO MARKDOWN FORMATTING.",
    prompt
  );
}

export async function handleWisdom(body: any) {
  const { situation } = body;
  if (!situation?.trim()) {
    throw new Error("Situation is required");
  }

  const prompt = `You are a bridge between ancient wisdom and modern life. The user's situation: "${situation}"

Draw from diverse traditions (Buddhist, Stoic, Indigenous, Taoist, Sufi, etc.) to offer:
1. A teaching/principle that speaks to this moment
2. A practice they can do today (meditation, breathwork, movement, ritual)
3. A reframe that shifts perspective
4. The tradition/lineage you're honoring

Be specific and practical while honoring depth. Make ancient wisdom accessible without diluting it.

Respond ONLY with valid JSON in this exact format:
{
  "teaching": "the principle or teaching",
  "practice": "specific practice with instructions",
  "reframe": "new way to see their situation",
  "tradition": "tradition name and brief context"
}`;

  return await callPerplexity(
    "RESPOND ONLY WITH VALID JSON. NO OTHER TEXT. NO MARKDOWN FORMATTING.",
    prompt
  );
}

export async function handleShadow(body: any) {
  const { shadowPrompt } = body;
  if (!shadowPrompt?.trim()) {
    throw new Error("Prompt is required");
  }

  const prompt = `You are a shadow integration guide. Trauma-informed, culturally sensitive, deeply compassionate.

The user shared: "${shadowPrompt}"

Offer:
1. A gentle reflection on what might be in their shadow/blind spot
2. Why this pattern might have formed (protective function)
3. A safe question to explore it further
4. A compassionate reframe
5. When to seek professional support (be clear about limits)

Be gentle but honest. Create safety while inviting growth.

Respond ONLY with valid JSON in this exact format:
{
  "reflection": "gentle observation of shadow/pattern",
  "origin": "why this might have formed",
  "explorationQuestion": "safe question to sit with",
  "reframe": "compassionate reframe",
  "seekSupport": "when to consider therapy/professional help"
}`;

  return await callPerplexity(
    "RESPOND ONLY WITH VALID JSON. NO OTHER TEXT. NO MARKDOWN FORMATTING.",
    prompt
  );
}

export async function handleFeed() {
  const prompt = `Generate 6 diverse consciousness-related news items across these categories:
- Science (consciousness research, neuroscience breakthroughs)
- Movement (global movements toward wellbeing, collective practices)
- Wisdom (teachings from thought leaders, timeless insights)
- Transformation (personal growth stories, breakthrough moments)
- Environment (nature healing, ecological consciousness)
- Technology (tech serving consciousness, ethical AI)

Each item should have:
- A compelling title
- A brief summary (2-3 sentences)
- A deeper insight (what this means for consciousness)
- An action step (how to engage with this)

Respond ONLY with valid JSON in this exact format:
[
  {
    "category": "science|movement|wisdom|transformation|environment|technology",
    "title": "compelling headline",
    "summary": "brief overview",
    "insight": "deeper meaning",
    "action": "concrete action step"
  }
]`;

  return await callPerplexity(
    "RESPOND ONLY WITH VALID JSON. NO OTHER TEXT. NO MARKDOWN FORMATTING.",
    prompt
  );
}

export async function handleIntention() {
  const prompt = `Generate a personalized daily intention for consciousness elevation. Include:
1. A core intention/theme for the day
2. A morning practice (3-5 minutes)
3. A midday check-in prompt
4. An evening reflection question

Make it profound yet practical, elevated yet grounded.

Respond ONLY with valid JSON in this exact format:
{
  "intention": "core intention for today",
  "morning": "brief morning practice",
  "midday": "check-in prompt",
  "evening": "reflection question"
}`;

  return await callPerplexity(
    "RESPOND ONLY WITH VALID JSON. NO OTHER TEXT. NO MARKDOWN FORMATTING.",
    prompt
  );
}

