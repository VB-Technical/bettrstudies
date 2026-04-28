import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { setProfile, useProfile, type Language, type Medium } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/languages")({
  component: LanguagesStep,
});

const LANGS: { id: Language; label: string; native: string }[] = [
  { id: "english", label: "English", native: "English" },
  { id: "kannada", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "hindi", label: "Hindi", native: "हिन्दी" },
  { id: "sanskrit", label: "Sanskrit", native: "संस्कृतम्" },
  { id: "urdu", label: "Urdu", native: "اُردُو" },
];

function Pills({
  value,
  onChange,
  options,
}: {
  value?: Language;
  onChange: (l: Language) => void;
  options: { id: Language; label: string; native: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium border transition-all",
              active
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-card text-foreground border-border hover:border-primary/40"
            )}
          >
            <span>{o.label}</span>
            {o.id !== "none" && o.id !== "english" && (
              <span className="ml-2 opacity-70">{o.native}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LanguagesStep() {
  const navigate = useNavigate();
  const [profile] = useProfile();
  const isState = profile.board === "state";

  const finish = () => {
    setProfile({ onboarded: true });
    navigate({ to: "/home" });
  };

  const canContinue =
    !!profile.firstLang &&
    !!profile.secondLang &&
    !!profile.thirdLang &&
    (!isState || !!profile.medium);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-6 py-12 pb-24">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Step 3 of 3</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Languages</h1>
        <p className="mt-2 text-muted-foreground">
          {isState ? "Choose your medium of instruction and your three language papers." : "Pick your three language papers."}
        </p>

        {isState && (
          <section className="mt-8">
            <h3 className="text-sm font-semibold mb-3">Medium of instruction</h3>
            <div className="flex gap-2">
              {(["english", "kannada"] as Medium[]).map((m) => {
                const active = profile.medium === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setProfile({ medium: m })}
                    className={cn(
                      "flex-1 rounded-xl px-4 py-3 text-sm font-semibold border transition-all",
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-soft"
                        : "bg-card border-border hover:border-primary/40"
                    )}
                  >
                    {m === "english" ? "English" : "Kannada (ಕನ್ನಡ)"}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h3 className="text-sm font-semibold mb-3">First Language</h3>
          <Pills value={profile.firstLang} onChange={(l) => setProfile({ firstLang: l })} options={LANGS} />
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Second Language</h3>
          <Pills value={profile.secondLang} onChange={(l) => setProfile({ secondLang: l })} options={LANGS} />
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold mb-3">
            Third Language {!isState && <span className="text-muted-foreground font-normal">(CBSE allows None)</span>}
          </h3>
          <Pills
            value={profile.thirdLang}
            onChange={(l) => setProfile({ thirdLang: l })}
            options={isState ? LANGS : [...LANGS, { id: "none", label: "None", native: "" }]}
          />
        </section>

        <Button
          disabled={!canContinue}
          onClick={finish}
          className="mt-10 w-full h-12 bg-gradient-primary text-primary-foreground font-semibold shadow-elegant disabled:opacity-50"
        >
          Start learning
        </Button>
      </div>
    </div>
  );
}
