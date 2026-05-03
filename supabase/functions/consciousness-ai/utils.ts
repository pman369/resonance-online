import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
export const MODEL_NAME = "sonar";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_WINDOW_MINUTES = 1;
const RATE_LIMIT_MAX = 10; // Reduced from 30 to 10 for AI sustainability

export async function checkRateLimit(supabase: any, ip: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      client_ip: ip,
      max_requests: RATE_LIMIT_MAX,
      window_minutes: RATE_LIMIT_WINDOW_MINUTES
    });
    
    if (error) {
      console.error('Rate limit RPC error:', error);
      // Fail open if the RPC fails so we don't break the app
      return true;
    }
    
    return !!data;
  } catch (err) {
    console.error('Rate limit check failed:', err);
    return true;
  }
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
