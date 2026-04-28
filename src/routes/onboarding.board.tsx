import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { setProfile, useProfile } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, Building2 } from "lucide-react";

export const Route = createFileRoute("/onboarding/board")({
  component: BoardStep,
});

function BoardStep() {
  const navigate = useNavigate();
  const [profile] = useProfile();

  const pick = (board: "cbse" | "state") => setProfile({ board });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Step 2 of 3</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Which board are you on?</h1>
        <p className="mt-2 text-muted-foreground">We'll tailor chapters, blueprints and exam patterns to your syllabus.</p>

        <div className="mt-10 space-y-4">
          {[
            { id: "cbse" as const, name: "CBSE", desc: "Central Board of Secondary Education", icon: Building2 },
            { id: "state" as const, name: "Karnataka State Board", desc: "KSEEB / SSLC syllabus", icon: GraduationCap },
          ].map(({ id, name, desc, icon: Icon }) => {
            const active = profile.board === id;
            return (
              <button
                key={id}
                onClick={() => pick(id)}
                className={cn(
                  "w-full rounded-2xl border-2 p-5 text-left transition-all flex items-center gap-4",
                  active
                    ? "border-primary bg-primary/5 shadow-elegant"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-xl",
                    active ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{name}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          disabled={!profile.board}
          onClick={() => navigate({ to: "/onboarding/languages" })}
          className="mt-10 w-full h-12 bg-gradient-primary text-primary-foreground font-semibold shadow-elegant disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
