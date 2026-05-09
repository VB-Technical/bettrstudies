// Generates a chapter overview (text + spoken summary) in a chosen language using Lovable AI Gateway (Gemini).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  title: string;
  brief?: string;
  topics?: string[];
  subject?: string;
  language?: "english" | "kannada" | "hindi" | "sanskrit" | "urdu";
}

const LANG_NAME: Record<string, string> = {
  english: "English",
  kannada: "Kannada (ಕನ್ನಡ)",
  hindi: "Hindi (हिन्दी)",
  sanskrit: "Sanskrit (संस्कृतम्)",
  urdu: "Urdu (اردو)",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { title, brief, topics, subject, language = "english" } = (await req.json()) as Body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!title) throw new Error("title required");

    const langName = LANG_NAME[language] ?? "English";
    const system = `You are an expert Class 10 teacher writing a chapter overview for an Indian student. Write entirely in ${langName}. Be warm, motivating, and crystal clear at a Class 10 level.`;
    const user = `Subject: ${subject ?? "—"}
Chapter: ${title}
Existing brief: ${brief ?? "(none)"}
Key topics: ${(topics ?? []).join(", ") || "(none)"}

Produce a JSON object with exactly two keys:
- "overview": a 120-180 word study overview in ${langName}, with a short intro paragraph then a bullet list of the key ideas (use markdown).
- "spoken": a 90-130 word spoken summary in ${langName} written for natural text-to-speech narration — short sentences, no markdown, no bullet symbols, friendly tone, ends with one motivating line.

Return ONLY the JSON. No prose, no code fences.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const status = resp.status;
      const msg = status === 429 ? "Too many requests. Try again shortly."
        : status === 402 ? "AI credits exhausted. Add funds in workspace settings."
        : "AI gateway error";
      console.error("gateway", status, await resp.text().catch(() => ""));
      return new Response(JSON.stringify({ error: msg }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await resp.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { overview?: string; spoken?: string } = {};
    try { parsed = JSON.parse(content); } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch { /* ignore */ } }
    }
    const overview = parsed.overview?.trim() || content.trim();
    const spoken = parsed.spoken?.trim() || overview.replace(/[#*_`>-]+/g, " ").replace(/\s+/g, " ").trim();

    return new Response(JSON.stringify({ overview, spoken, language }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chapter-overview failed:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
