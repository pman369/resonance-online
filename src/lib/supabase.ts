import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper: call AI via Edge Function (authenticated)
export async function callPerplexity(payload: {
  messages: Array<{ role: string; content: string }>;
  system?: string;
  max_tokens?: number;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/perplexity-proxy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  return res.json();
}

// Helper: real-time global coherence
export function subscribeToCoherence(callback: (data: any) => void) {
  return supabase
    .channel("global_coherence")
    .on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "global_coherence",
    }, (payload) => callback(payload.new))
    .subscribe();
}
