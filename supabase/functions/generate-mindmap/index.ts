// Generates a mind-map illustration via Lovable AI image gen (Gemini "nano banana").
// Returns: { image: "data:image/png;base64,..." }

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, topics, subject } = (await req.json()) as Body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!title) throw new Error("title required");

    const topicList = (topics || []).slice(0, 8).map((t, i) => `${i + 1}. ${t}`).join("\n");

    const prompt = `Create a clean, colorful, hand-drawn style MIND MAP infographic illustration on a white background for the chapter titled "${title}"${subject ? ` from ${subject}` : ""}.

Central node text (large, bold): "${title}"

Branches radiating outward, each with its own bright color, connected by curved lines, each branch clearly labelled with EXACTLY this text:
${topicList}

Style: educational poster, friendly rounded sans-serif typography, all text MUST be perfectly legible English, no spelling mistakes, no extra text, plenty of white space, suitable for a class 10 student study aid. Square 1:1 image.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit hit. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${resp.status}`);
    }

    const data = await resp.json();
    const image = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!image) {
      console.error("No image in response", JSON.stringify(data).slice(0, 500));
      throw new Error("No image returned");
    }

    return new Response(JSON.stringify({ image }), {
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
