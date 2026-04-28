import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/tutor")({
  component: Tutor,
});

interface Msg { role: "user" | "tutor"; text: string; }

const SUGGESTIONS = [
  "Explain Pythagoras theorem with an example",
  "Why does iron rust? (Class 10 Science)",
  "Difference between metals and non-metals",
  "Help me solve: x² – 5x + 6 = 0",
];

function Tutor() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "tutor", text: "Hi! I'm your AI tutor. Ask me anything from your Class 10 syllabus." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "tutor",
          text:
            `Great question! Here's a concise explanation: ${text.slice(0, 60)}…\n\n` +
            `Key points:\n• Concept definition\n• Why it matters\n• Worked example\n\nWant me to make a mnemonic or quiz you on this?`,
        },
      ]);
      setThinking(false);
    }, 900);
  };

  return (
    <AppShell>
      <PageHeader title="Tutor Queries" subtitle="Stuck on something? Ask away." showLogo />

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden flex flex-col" style={{ minHeight: "60vh" }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "tutor" && (
                <div className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                {m.text}
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
