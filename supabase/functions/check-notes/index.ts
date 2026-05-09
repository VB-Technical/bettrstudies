// Analyses a photo of handwritten notes using Lovable AI (Gemini vision).
// Returns: { weightage, recognized, issues:[{word,correction}], matches, feedback }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  imageBase64: string; // data URL or raw base64
  subject?: string;
  chapter?: string;
  topic?: string;
}

import { rateLimit, readJsonWithLimit, clampString, PayloadTooLarge } from "../_shared/guard.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const limited = rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let body: Body;
    try {
      body = await readJsonWithLimit<Body>(req, 12_000_000); // ~12 MB
    } catch (e) {
      if (e instanceof PayloadTooLarge) {
        return new Response(JSON.stringify({ error: "Image too large (max ~9MB)" }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }
    const imageBase64 = body.imageBase64;
    const subject = clampString(body.subject, 200);
    const chapter = clampString(body.chapter, 200);
    const topic = clampString(body.topic, 200);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!imageBase64 || typeof imageBase64 !== "string") throw new Error("imageBase64 required");
    if (imageBase64.length > 12_000_000) {
      return new Response(JSON.stringify({ error: "Image too large (max ~9MB)" }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const context = [
      subject ? `Subject: ${subject}` : null,
      chapter ? `Chapter: ${chapter}` : null,
      topic ? `Topic: ${topic}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const sys = `You are an expert Class 10 teacher grading a student's handwritten notes. Carefully OCR the photo, then evaluate how well the notes cover the textbook concepts. Identify spelling mistakes (give the misspelled word exactly as written and the correct spelling). Score the notes 0-100 based on coverage, correctness and clarity. Be honest but encouraging.`;

    const userText = `${context ? context + "\n\n" : ""}Read the handwritten notes in the image. Then return your analysis via the provided tool only.`;

    const resp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: sys },
            {
              role: "user",
              content: [
                { type: "text", text: userText },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "emit_review",
                description: "Return the notes review",
                parameters: {
                  type: "object",
                  properties: {
                    recognized: {
                      type: "string",
                      description: "Full OCR text of the notes as written, preserving the student's spellings.",
                    },
                    weightage: {
                      type: "number",
                      description: "Score 0-100 for how well the notes cover the topic.",
                    },
                    matches: {
                      type: "number",
                      description: "Number of key textbook concepts present in the notes.",
                    },
                    issues: {
                      type: "array",
                      description: "Spelling mistakes found.",
                      items: {
                        type: "object",
                        properties: {
                          word: { type: "string" },
                          correction: { type: "string" },
                        },
                        required: ["word", "correction"],
                        additionalProperties: false,
                      },
                    },
                    feedback: {
                      type: "string",
                      description: "1-2 sentence encouraging feedback with what to improve.",
                    },
                  },
                  required: ["recognized", "weightage", "matches", "issues", "feedback"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "emit_review" },
          },
        }),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text);
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit hit. Try again in a minute." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw new Error(`AI gateway ${resp.status}`);
    }

    const data = await resp.json();
    const args =
      data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("No tool call returned");
    const parsed = JSON.parse(args);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-notes failed:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
