// Streaming AI tutor for Class 10 students using Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  context?: { board?: string; subject?: string; chapter?: string; name?: string };
}

import { rateLimit, readJsonWithLimit, clampString, PayloadTooLarge } from "../_shared/guard.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const limited = rateLimit(req, { limit: 20, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let parsed: Body;
    try {
      parsed = await readJsonWithLimit<Body>(req, 200_000);
    } catch (e) {
      if (e instanceof PayloadTooLarge) {
        return new Response(JSON.stringify({ error: "Message too large" }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }
    const messages = (Array.isArray(parsed.messages) ? parsed.messages : []).slice(-30)
      .filter((m) => m && typeof m.content === "string" && ["user", "assistant", "system"].includes(m.role))
      .map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }));
    const context = parsed.context ? {
      board: clampString(parsed.context.board, 50),
      subject: clampString(parsed.context.subject, 200),
      chapter: clampString(parsed.context.chapter, 200),
      name: clampString(parsed.context.name, 100),
    } : undefined;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (messages.length === 0) throw new Error("messages required");

    const ctxLine = [
      context?.name ? `Student: ${context.name}` : null,
      context?.board ? `Board: ${context.board}` : null,
      context?.subject ? `Subject: ${context.subject}` : null,
      context?.chapter ? `Chapter: ${context.chapter}` : null,
    ].filter(Boolean).join(" • ");

    const system = `You are Bettr's friendly Class 10 AI tutor for Indian students (CBSE / Karnataka State Board). ${ctxLine ? `Context — ${ctxLine}.` : ""}
Rules:
- Explain at a Class 10 level: short, clear, encouraging.
- Use bullet points, simple analogies, and worked examples for problems.
- For maths/science problems: show every step.
- For languages: give meaning, grammar point, and a sample sentence.
- End most replies with a tiny follow-up question or quick quiz to keep them engaged.
- Use markdown. Keep answers under ~250 words unless they ask for detail.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI gateway", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("tutor-chat failed:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
