// Generates a high-quality mind-map illustration via a 2-step pipeline:
//   1. Gemini text model plans a clean structured mind map (short labels, grouped branches).
//   2. Gemini image model renders that plan as a polished infographic.
// Returns: { image: "data:image/png;base64,...", plan: {...} }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  title: string;
  topics: string[];
  subject?: string;
}

interface Branch { label: string; sub: string[] }
interface Plan { center: string; branches: Branch[] }

import { rateLimit, readJsonWithLimit, clampString, PayloadTooLarge } from "../_shared/guard.ts";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function planMindMap(
  apiKey: string,
  title: string,
  subject: string,
  topics: string[],
): Promise<Plan> {
  const sys = `You design clean, student-friendly mind maps. Output STRICT JSON only.
Rules:
- "center": 1-4 words, the chapter name (you may shorten if too long).
- "branches": 5 to 7 items. Each branch is one core idea of the chapter.
- Each branch.label: 1-3 words, Title Case, NO punctuation.
- Each branch.sub: 2-3 short keywords, each 1-3 words, NO sentences.
- Cover the whole chapter, group related topics, do NOT just copy the input list verbatim if it is messy.
- All text MUST be correctly spelled English.`;
  const usr = `Chapter: "${title}"
Subject: ${subject || "general"}
Raw topics from textbook (may be noisy):
${topics.map((t, i) => `- ${t}`).join("\n")}

Return JSON of shape:
{ "center": string, "branches": [ { "label": string, "sub": [string, ...] }, ... ] }`;

  const r = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`plan ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const raw = j?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Plan;
  // sanitize
  const center = (parsed.center || title).toString().slice(0, 40);
  const branches = (Array.isArray(parsed.branches) ? parsed.branches : [])
    .slice(0, 7)
    .map((b) => ({
      label: (b?.label || "").toString().slice(0, 24),
      sub: (Array.isArray(b?.sub) ? b.sub : []).slice(0, 3)
        .map((s) => (s || "").toString().slice(0, 22)).filter(Boolean),
    }))
    .filter((b) => b.label);
  if (branches.length < 3) {
    // fallback to topics if model returned junk
    return {
      center,
      branches: topics.slice(0, 6).map((t) => ({ label: t.slice(0, 24), sub: [] })),
    };
  }
  return { center, branches };
}

function planToPrompt(plan: Plan, subject: string): string {
  const lines = plan.branches.map((b, i) => {
    const sub = b.sub.length ? ` (sub-twigs: ${b.sub.join(", ")})` : "";
    return `${i + 1}. "${b.label}"${sub}`;
  }).join("\n");
  return `Design a polished, modern MIND MAP infographic on a clean off-white background, square 1:1.

CENTER NODE (large rounded pill, bold): "${plan.center}"${subject ? `  —  small caption beneath: "${subject}"` : ""}

${plan.branches.length} primary branches radiate outward in a balanced radial layout, each in its OWN distinct pastel color, connected to the center by smooth curved lines. Each primary node is a rounded rectangle with bold legible text. Beneath each primary node, draw small thinner branches to its sub-twigs as small soft chips.

EXACT branch text (use these labels VERBATIM, spelled exactly as written, nothing else):
${lines}

Style requirements:
- Friendly rounded sans-serif typography, ALL text crisp and perfectly legible.
- Tasteful pastel palette (mint, peach, lavender, sky, butter, rose, sage), soft shadows.
- Generous white space, NO clutter, NO duplicate labels, NO extra random text, NO watermarks.
- Educational poster aesthetic suitable for a class-10 student.
- Square 1:1 image.`;
}

async function renderImage(apiKey: string, prompt: string): Promise<string> {
  const r = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    console.error("image gateway", r.status, text);
    const err: any = new Error(`image ${r.status}`);
    err.status = r.status;
    throw err;
  }
  const data = await r.json();
  const image = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!image) throw new Error("No image returned");
  return image;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const limited = rateLimit(req, { limit: 6, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let body: Body;
    try {
      body = await readJsonWithLimit<Body>(req, 100_000);
    } catch (e) {
      if (e instanceof PayloadTooLarge) {
        return new Response(JSON.stringify({ error: "Payload too large" }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }
    const title = clampString(body.title, 200);
    const subject = clampString(body.subject, 200);
    const topics = (Array.isArray(body.topics) ? body.topics : []).slice(0, 16)
      .map((t) => (typeof t === "string" ? t.slice(0, 200) : "")).filter(Boolean);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!title) throw new Error("title required");

    // Step 1 — plan
    let plan: Plan;
    try {
      plan = await planMindMap(LOVABLE_API_KEY, title, subject, topics);
    } catch (e) {
      console.error("plan failed, using raw topics", e);
      plan = {
        center: title.slice(0, 40),
        branches: topics.slice(0, 6).map((t) => ({ label: t.slice(0, 24), sub: [] })),
      };
    }

    // Step 2 — render
    const prompt = planToPrompt(plan, subject);
    let image: string;
    try {
      image = await renderImage(LOVABLE_API_KEY, prompt);
    } catch (e: any) {
      if (e?.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit hit. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (e?.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }

    return new Response(JSON.stringify({ image, plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-mindmap failed:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
