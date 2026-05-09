// Generates a board-style question paper using Lovable AI.
// Returns structured JSON: { sections: [{ title, questions: string[] }] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  board: string;
  subject: string;
  chapters: string[];
}

import { rateLimit, readJsonWithLimit, clampString, PayloadTooLarge } from "../_shared/guard.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const limited = rateLimit(req, { limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  try {
    let body: Body;
    try {
      body = await readJsonWithLimit<Body>(req, 200_000);
    } catch (e) {
      if (e instanceof PayloadTooLarge) {
        return new Response(JSON.stringify({ error: "Payload too large" }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw e;
    }
    const board = clampString(body.board, 50) ?? "";
    const subject = clampString(body.subject, 200) ?? "";
    const chapters = (Array.isArray(body.chapters) ? body.chapters : []).slice(0, 50)
      .map((c) => (typeof c === "string" ? c.slice(0, 300) : "")).filter(Boolean);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!board || !subject || chapters.length === 0) throw new Error("board, subject, chapters required");

    const sys = `You are an experienced Class 10 ${board} board examiner authoring an official-style mock question paper for the subject "${subject}". Write questions in clear English (transliterate any non-Latin chapter names if needed). Reference the actual chapter content; never produce placeholder text like "Define a key term".`;

    const user = `Chapters available:
${chapters.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Generate a full 80-mark, 3-hour board paper following this blueprint:
- Section A: 20 × 1 mark (MCQ or one-word/fill-in-the-blank). Each MCQ must include 4 options labelled (a)-(d).
- Section B: 6 × 2 marks (Very Short Answer)
- Section C: 7 × 3 marks (Short Answer)
- Section D: 7 × 5 marks (Long Answer; include "OR" internal choice)

Distribute questions across the chapters listed. Each question must be a real, content-specific question about that chapter (concepts, definitions, characters, events, formulas, etc.). Number questions within each section starting at 1. Return via the provided tool only.`;

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
            { role: "user", content: user },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "emit_paper",
                description: "Return the generated question paper",
                parameters: {
                  type: "object",
                  properties: {
                    sections: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          questions: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                        required: ["title", "questions"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["sections"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "emit_paper" },
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
    console.error("generate-paper failed:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
