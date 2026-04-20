import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
export const MODEL_NAME = "sonar";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting store (in-memory, per IP)
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 30;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  const requests = rateLimitStore.get(ip)!.filter(time => now - time < RATE_LIMIT_WINDOW);
  if (requests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  requests.push(now);
  rateLimitStore.set(ip, requests);
  return true;
}

// Helper to call Perplexity API
export async function callPerplexity(systemMessage: string, userMessage: string) {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("AI service not configured. Please add PERPLEXITY_API_KEY to your Supabase secrets.");
  }

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ]
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Perplexity API request failed");
  }

  const data = await response.json();
  let responseText = data.choices[0].message.content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(responseText);
    return { success: true, data: parsed };
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    return {
      success: true,
      data: { rawResponse: responseText },
      warning: "Response was not valid JSON"
    };
  }
}
