import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const today = new Date().toISOString().split("T")[0];

  // Get users who don't have today's intention yet
  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .limit(100);

  for (const user of users || []) {
    const { data: existing } = await supabase
      .from("daily_intentions")
      .select("id")
      .eq("user_id", user.id)
      .eq("intention_date", today)
      .single();

    if (!existing) {
      // Generate via Perplexity API
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("PERPLEXITY_API_KEY")!}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: "Generate a daily intention for a consciousness elevation platform user. Return JSON only with keys: core_intention, morning_practice, midday_checkin, evening_reflection. Keep each under 100 words."
          }]
        })
      });

      const aiData = await response.json();
      const text = aiData.choices?.[0]?.message?.content || "{}";

      try {
        const intention = JSON.parse(text.replace(/```json|```/g, "").trim());
        await supabase.from("daily_intentions").upsert({
          user_id: user.id,
          intention_date: today,
          ...intention,
          ai_generated: true
        });
      } catch (_) {}
    }
  }

  return new Response(JSON.stringify({ success: true }));
});
