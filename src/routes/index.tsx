import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Loader2, Rocket, Trophy, Flame, Star } from "lucide-react";
import { applyTheme, getProfile, setProfile } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const [busy, setBusy] = useState<null | "google" | "guest">(null);
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const p = getProfile();
    applyTheme(p.theme);
    setLoaded(true);

    // Sync supabase session into local profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const next = setProfile({
          authed: true,
          guest: false,
          name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || u.email?.split("@")[0] || "Learner",
          email: u.email ?? undefined,
        });
        if (next.onboarded) navigate({ to: "/home" });
        else navigate({ to: "/onboarding/theme" });
        return;
      }
      if (p.onboarded && p.authed) {
        navigate({ to: "/home" });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        const u = session.user;
        const next = setProfile({
          authed: true,
          guest: false,
          name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || u.email?.split("@")[0] || "Learner",
          email: u.email ?? undefined,
        });
        navigate({ to: next.onboarded ? "/home" : "/onboarding/theme" });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const continueAs = async (mode: "google" | "guest") => {
    if (busy) return;
    setBusy(mode);
    try {
      if (mode === "guest") {
        const name = guestName.trim();
        if (!name) {
          toast.error("Please enter your name to continue");
          setBusy(null);
          return;
        }
        setProfile({
          authed: true,
          guest: true,
          name,
          email: undefined,
        });
        navigate({ to: "/onboarding/theme" });
        return;
      }
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed", { description: result.error.message });
        setBusy(null);
        return;
      }
      if (result.redirected) return; // browser navigating away
      // Tokens set — onAuthStateChange will redirect.
    } catch (e) {
      toast.error("Sign-in error", { description: e instanceof Error ? e.message : String(e) });
      setBusy(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* gradient bg */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" aria-hidden />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl" aria-hidden />

      <div className={`relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-between px-6 py-16 text-primary-foreground transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur-md shadow-glow ring-1 ring-white/20 animate-pulse">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter">Bettr</h1>
          <p className="mt-3 text-lg/relaxed text-white/90 max-w-xs font-medium">
            Level up your <span className="font-bold">Class 10</span> journey. Learn. Win. Repeat. 🚀
          </p>
          <div className="mt-6 grid grid-cols-4 gap-2 w-full max-w-xs">
            {[
              { Icon: Rocket, label: "Boost" },
              { Icon: Flame, label: "Streaks" },
              { Icon: Star, label: "XP" },
              { Icon: Trophy, label: "Win" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 backdrop-blur-md px-2 py-3 ring-1 ring-white/15">
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white/85">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={() => continueAs("google")}
            disabled={busy !== null}
            className="w-full h-12 bg-white text-foreground hover:bg-white/95 font-semibold text-base shadow-elegant"
          >
            {busy === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
            {busy === "google" ? "Signing in…" : "Sign in with Google"}
          </Button>

          <div className="relative flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">or jump in as guest</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <Input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") continueAs("guest");
            }}
            placeholder="Your name (e.g. Aarav)"
            className="h-12 bg-white/15 backdrop-blur-md border-white/25 text-white placeholder:text-white/60 focus-visible:ring-white/60 text-base"
            maxLength={32}
          />
          <Button
            onClick={() => continueAs("guest")}
            disabled={busy !== null || !guestName.trim()}
            className="w-full h-12 bg-gradient-primary text-primary-foreground font-semibold text-base shadow-elegant disabled:opacity-50"
          >
            {busy === "guest" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
            Start my journey
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
