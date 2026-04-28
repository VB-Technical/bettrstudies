import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sun, Moon, Check } from "lucide-react";
import { applyTheme, setProfile, useProfile } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/theme")({
  component: ThemeStep,
});

function ThemeStep() {
  const navigate = useNavigate();
  const [profile] = useProfile();
  const theme = profile.theme;

  const choose = (t: "light" | "dark") => {
    setProfile({ theme: t });
    applyTheme(t);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Step 1 of 3</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Pick your vibe</h1>
        <p className="mt-2 text-muted-foreground">Choose how Bettr should look. You can change this later in Account.</p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {(["light", "dark"] as const).map((t) => {
            const active = theme === t;
            const Icon = t === "light" ? Sun : Moon;
            return (
              <button
                key={t}
                onClick={() => choose(t)}
                className={cn(
                  "group relative aspect-[3/4] rounded-3xl border-2 p-5 text-left transition-all overflow-hidden",
                  active ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-2 rounded-2xl",
                    t === "light" ? "bg-white" : "bg-zinc-900"
                  )}
                  aria-hidden
                />
                <div className="relative flex h-full flex-col justify-between">
                  <Icon className={cn("h-6 w-6", t === "light" ? "text-amber-500" : "text-indigo-300")} />
                  <div className="space-y-2">
                    <div className={cn("h-2 w-12 rounded-full", t === "light" ? "bg-zinc-300" : "bg-zinc-700")} />
                    <div className={cn("h-2 w-20 rounded-full", t === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
                    <div className={cn("h-8 w-full rounded-lg bg-gradient-primary opacity-90")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("font-semibold", t === "light" ? "text-zinc-900" : "text-zinc-100")}>
                      {t === "light" ? "Light" : "Dark"}
                    </span>
                    {active && (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => navigate({ to: "/onboarding/board" })}
          className="mt-10 w-full h-12 bg-gradient-primary text-primary-foreground font-semibold shadow-elegant"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
