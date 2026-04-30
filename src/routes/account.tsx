import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { applyTheme, resetProfile, useProfile } from "@/lib/store";
import { LogOut, Moon, Sun, ChevronRight, Languages, GraduationCap, Bell, Shield } from "lucide-react";

export const Route = createFileRoute("/account")({
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const [profile, set] = useProfile();

  const langLabel = (l?: string) => l ? l.charAt(0).toUpperCase() + l.slice(1) : "—";

  return (
    <AppShell>
      <PageHeader title="Account" showLogo />

      <section className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20 text-2xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg leading-tight truncate">{profile.name}</p>
            <p className="text-sm text-white/85 truncate">{profile.email || "Guest mode"}</p>
            <p className="mt-1 text-xs text-white/80">
              {profile.board === "cbse" ? "CBSE" : "Karnataka State"} • Class 10
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-card shadow-soft divide-y divide-border">
        <Row icon={profile.theme === "dark" ? Moon : Sun} label="Theme" value={profile.theme === "dark" ? "Dark" : "Light"}>
          <Switch
            checked={profile.theme === "dark"}
            onCheckedChange={(v) => {
              const t = v ? "dark" : "light";
              set({ theme: t });
              applyTheme(t);
            }}
          />
        </Row>
        <Row icon={GraduationCap} label="Board" value={profile.board === "cbse" ? "CBSE" : "Karnataka State"}>
          <button onClick={() => navigate({ to: "/onboarding/board" })} className="text-muted-foreground"><ChevronRight className="h-5 w-5" /></button>
        </Row>
        <Row icon={Languages} label="Languages" value={`${langLabel(profile.firstLang)}, ${langLabel(profile.secondLang)}, ${langLabel(profile.thirdLang)}`}>
          <button onClick={() => navigate({ to: "/onboarding/languages" })} className="text-muted-foreground"><ChevronRight className="h-5 w-5" /></button>
        </Row>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card shadow-soft divide-y divide-border">
        <Row icon={Bell} label="Notifications" value="Daily reminders">
          <Switch defaultChecked />
        </Row>
        <Row icon={Shield} label="Privacy" value="Manage your data">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Row>
      </section>

      <Button
        onClick={async () => {
          try { await supabase.auth.signOut(); } catch {}
          resetProfile();
          applyTheme("light");
          navigate({ to: "/" });
        }}
        variant="outline"
        className="mt-6 w-full h-12 border-destructive/30 text-destructive hover:bg-destructive/5"
      >
        <LogOut className="h-4 w-4" />
        {profile.guest ? "Exit guest session" : "Sign out"}
      </Button>

      <p className="mt-6 text-center text-xs text-muted-foreground">Bettr v1.0 • Made with ❤️ for Class 10</p>
    </AppShell>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{value}</p>
      </div>
      {children}
    </div>
  );
}
