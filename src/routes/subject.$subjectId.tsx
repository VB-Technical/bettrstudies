import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SubjectIcon } from "@/components/SubjectIcon";
import { getChapterPercent, isChapterPassed, useProfile, useProgressTick } from "@/lib/store";
import { getSubject } from "@/lib/syllabus";
import { CheckCircle2, Lock, Play, FileText, Headphones, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/subject/$subjectId")({
  component: SubjectPage,
});

function SubjectPage() {
  const { subjectId } = useParams({ from: "/subject/$subjectId" });
  const [profile] = useProfile();
  useProgressTick();
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const subject = profile.board ? getSubject(profile.board, subjectId, profile.secondLang, profile.thirdLang, profile.firstLang) : undefined;
  if (!subject) {
    return (
      <AppShell>
        <PageHeader title="Subject not found" back="/home" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title={subject.name} subtitle={`${subject.chapters.length} chapters • Class 10`} back="/home" />

      <div
        className="rounded-3xl p-5 text-white shadow-elegant relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--${subject.colorVar}), color-mix(in oklab, var(--${subject.colorVar}) 60%, var(--primary-glow)))` }}
      >
        <div className="absolute -right-8 -bottom-8 opacity-20">
          <SubjectIcon type={subject.iconKey} className="h-40 w-40" />
        </div>
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Now studying</p>
          <h2 className="mt-1 text-2xl font-bold">{subject.name}</h2>
          <p className="mt-1 text-sm text-white/85 max-w-xs">
            Master each chapter to unlock the next. Pass the chapter test to progress.
          </p>
        </div>
      </div>

      <h3 className="mt-7 mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Chapters</h3>
      <ol className="space-y-2.5">
        {subject.chapters.map((c, i) => {
          const passed = isChapterPassed(subject.id, i);
          const prevPassed = i === 0 || isChapterPassed(subject.id, i - 1);
          const locked = !prevPassed;
          const pct = getChapterPercent(subject.id, i);

          return (
            <li key={i}>
              {locked ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4 opacity-70">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">Chapter {i + 1}</p>
                    <p className="font-semibold truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pass Chapter {i} test to unlock</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenIdx(i)}
                  className={cn(
                    "w-full text-left flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-soft",
                    passed ? "border-success/30" : "border-border"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold text-sm",
                      passed
                        ? "bg-success/15 text-success"
                        : "bg-gradient-primary text-primary-foreground shadow-soft"
                    )}
                  >
                    {passed ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">Chapter {i + 1}</p>
                    <p className="font-semibold truncate">{c.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden max-w-[180px]">
                        <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium">{pct}%</span>
                    </div>
                  </div>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </li>
          );
        })}
      </ol>

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How do you want to learn?</DialogTitle>
            <DialogDescription>
              {openIdx !== null && subject.chapters[openIdx]
                ? `Chapter ${openIdx + 1} • ${subject.chapters[openIdx].title}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-2">
            {[
              { mode: "text", icon: FileText, title: "Text Review", desc: "Read notes & download as PDF" },
              { mode: "audio", icon: Headphones, title: "Audio Review", desc: "Listen to a spoken overview" },
              { mode: "mind", icon: Network, title: "Mind Map Image", desc: "Visual map you can save as PNG" },
            ].map(({ mode, icon: Icon, title, desc }) => (
              <button
                key={mode}
                onClick={() => {
                  const idx = openIdx!;
                  setOpenIdx(null);
                  navigate({
                    to: "/subject/$subjectId/chapter/$chapterIdx",
                    params: { subjectId: subject.id, chapterIdx: String(idx) },
                    search: { mode } as never,
                  });
                }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/50 hover:shadow-soft transition-all"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-bold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
