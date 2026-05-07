import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { useProfile } from "@/lib/store";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/tutor")({
  component: Tutor,
});

interface Msg { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Explain Pythagoras theorem with an example",
  "Why does iron rust? (Class 10 Science)",
  "Difference between metals and non-metals",
  "Help me solve: x² – 5x + 6 = 0",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tutor-chat`;

function Tutor() {
  const [profile] = useProfile();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Hi${profile.name ? ` ${profile.name}` : ""}! I'm your AI tutor. Ask me anything from your Class 10 syllabus — concepts, sums, stories, grammar — and I'll explain step by step. ✨`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking]);

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Msg = { role: "user", content: text };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setInput("");
    setThinking(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          context: { board: profile.board, name: profile.name },
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Too many requests", { description: "Try again in a minute." });
        else if (resp.status === 402) toast.error("AI credits exhausted", { description: "Add funds in workspace settings." });
        else toast.error("Tutor unavailable", { description: `Error ${resp.status}` });
        setThinking(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";
      let started = false;
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantText += delta;
              if (!started) {
                started = true;
                setMsgs((m) => [...m, { role: "assistant", content: assistantText }]);
              } else {
                setMsgs((m) => m.map((msg, i) => (i === m.length - 1 ? { ...msg, content: assistantText } : msg)));
              }
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Tutor failed", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setThinking(false);
    }
  };

  return (
    <AppShell>
      <PageHeader title="AI Tutor" subtitle="Stuck on something? Ask away." showLogo />

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden flex flex-col" style={{ minHeight: "60vh" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-primary text-primary-foreground rounded-br-md whitespace-pre-line"
                    : "bg-secondary text-secondary-foreground rounded-bl-md prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5"
                }`}
              >
                {m.role === "assistant" ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {msgs.length <= 1 && (
          <div className="border-t border-border p-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs rounded-full border border-border bg-background hover:border-primary/40 hover:text-primary px-3 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 flex gap-2 bg-background"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 bg-secondary rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={!input.trim() || thinking} className="h-11 w-11 p-0 bg-gradient-primary text-primary-foreground shadow-soft">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
