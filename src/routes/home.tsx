import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SubjectIcon } from "@/components/SubjectIcon";
import { getProfile, getSubjectPercent, useProfile, useProgressTick } from "@/lib/store";
import { getSubjects } from "@/lib/syllabus";
import { Flame, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [profile] = useProfile();
  useProgressTick();

  useEffect(() => {
    const p = getProfile();
    if (!p.authed) navigate({ to: "/" });
    else if (!p.onboarded) navigate({ to: "/onboarding/theme" });
  }, [navigate]);

  const subjects = useMemo(
    () => (profile.board ? getSubjects(profile.board) : []),
    [profile.board]
  );

  const overall = useMemo(() => {
    if (!subjects.length) return 0;
    const sum = subjects.reduce((acc, s) => acc + getSubjectPercent(s.id, s.chapters.length), 0);
    return Math.round(sum / subjects.length);
  }, [subjects]);

  if (!profile.board) return null;

  return (
    <AppShell>
      <PageHeader
        title={`Hi, ${profile.name.split(" ")[0]} 👋`}
        subtitle={profile.board === "cbse" ? "CBSE • Class 10" : "Karnataka State Board • Class 10"}
        showLogo
      />

      {/* Stats Card */}
      <section className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Overall progress</p>
            <p className="mt-1 text-4xl font-extrabold">{overall}%</p>
            <p className="mt-1 text-sm text-white/85 flex items-center gap-1.5">
              <Flame className="h-4 w-4" /> Keep your streak alive
            </p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
            <TrendingUp className="h-10 w-10" />
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {subjects.slice(0, 6).map((s) => {
            const pct = getSubjectPercent(s.id, s.chapters.length);
            return (
              <div key={s.id} className="rounded-xl bg-white/10 backdrop-blur p-2.5 ring-1 ring-white/15">
                <p className="text-[10px] font-medium text-white/80 truncate">{s.name}</p>
                <p className="text-base font-bold leading-tight">{pct}%</p>
                <div className="mt-1 h-1 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subjects */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Subjects</h2>
          <span className="text-xs text-muted-foreground">Tap to start</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((s) => {
            const pct = getSubjectPercent(s.id, s.chapters.length);
            return (
              <Link
                key={s.id}
                to="/subject/$subjectId"
                params={{ subjectId: s.id }}
                className="group relative rounded-2xl bg-card p-4 border border-border hover:border-primary/40 transition-all shadow-soft hover:shadow-elegant overflow-hidden"
              >
                <div
                  className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-15 group-hover:opacity-25 transition-opacity"
                  style={{ background: `var(--${s.colorVar})` }}
                  aria-hidden
                />
                <div className="relative">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-xl text-white"
                    style={{ background: `var(--${s.colorVar})` }}
                  >
                    <SubjectIcon type={s.iconKey} className="h-7 w-7" />
                  </div>
                  <h3 className="mt-3 font-semibold leading-tight">{s.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.chapters.length} chapters</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
