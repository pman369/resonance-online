import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, corsHeaders, PERPLEXITY_API_KEY } from "./utils.ts";
import * as handlers from "./handlers.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace("/consciousness-ai", "");

    // 1. Unauthenticated endpoints (Health Check)
    if (path === "/health") {
      return new Response(JSON.stringify({
        success: true,
        data: {
          status: "ok",
          message: "Resonance Edge Function is running",
          aiAvailable: !!PERPLEXITY_API_KEY,
          timestamp: new Date().toISOString()
        }
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Server configuration error: Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Database-backed Rate Limiting
    const clientIP = req.headers.get("x-forwarded-for") || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    const isAllowed = await checkRateLimit(supabase, clientIP);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please slow down and take a breath. 🌬️" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Verify Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Parse body and route logic
    let body = {};
    if (req.method === "POST") {
      body = await req.json();
    }

    let result;

    switch (path) {
      case "/consciousness/map":
        result = await handlers.handleConsciousnessMap(body);
        break;
      case "/synchronicity":
        result = await handlers.handleSynchronicity(body);
        break;
      case "/wisdom":
        result = await handlers.handleWisdom(body);
        break;
      case "/shadow":
        result = await handlers.handleShadow(body);
        break;
      case "/feed":
        result = await handlers.handleFeed();
        break;
      case "/intention":
        result = await handlers.handleIntention();
        break;
      default:
        return new Response(
          JSON.stringify({
            error: "Endpoint not found",
            path: path
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    const status = error.message?.includes("Unauthorized") || error.message?.includes("log in") ? 401 : 500;
    
    return new Response(
      JSON.stringify({
        error: error.message || "Could not complete request. Please try again.",
      }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
