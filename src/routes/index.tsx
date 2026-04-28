import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { applyTheme, getProfile, setProfile } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Splash,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.8 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.06-1.1-.15-1.6H12Z" />
    </svg>
  );
}

function Splash() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = getProfile();
    applyTheme(p.theme);
    setLoaded(true);
    if (p.onboarded && p.authed) {
      navigate({ to: "/home" });
    }
  }, [navigate]);

  const continueAs = (mode: "google" | "guest") => {
    setProfile({
      authed: true,
      guest: mode === "guest",
      name: mode === "guest" ? "Guest Learner" : "Aarav Sharma",
      email: mode === "guest" ? undefined : "aarav@example.com",
    });
    navigate({ to: "/onboarding/theme" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* gradient bg */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" aria-hidden />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl" aria-hidden />

      <div className={`relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-between px-6 py-16 text-primary-foreground transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur-md shadow-glow ring-1 ring-white/20">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter">Bettr</h1>
          <p className="mt-3 text-lg/relaxed text-white/85 max-w-xs">
            Your Class 10 companion for <span className="font-semibold">CBSE</span> & <span className="font-semibold">Karnataka State</span> Board.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-white/80">
            {["Notes Check", "Mind Maps", "Study Songs", "Board Sim"].map((t) => (
              <span key={t} className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1.5 ring-1 ring-white/15">{t}</span>
            ))}
          </div>
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={() => continueAs("google")}
            className="w-full h-12 bg-white text-foreground hover:bg-white/95 font-semibold text-base shadow-elegant"
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
          <Button
            onClick={() => continueAs("guest")}
            variant="ghost"
            className="w-full h-12 text-white hover:bg-white/10 font-semibold text-base"
          >
            Continue as Guest
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-white/70 pt-2">
            By continuing you agree to Bettr's Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
