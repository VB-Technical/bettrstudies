import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/lib/store";
import { getSubjects } from "@/lib/syllabus";
import { Download, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/writing-exam")({
  component: WritingExam,
});

function WritingExam() {
  const [profile] = useProfile();
  const subjects = profile.board ? getSubjects(profile.board) : [];
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || "");
  const [boardSim, setBoardSim] = useState(true);
  const [generating, setGenerating] = useState(false);

  const subject = subjects.find((s) => s.id === subjectId);

  const generate = () => {
    if (!subject) return;
    setGenerating(true);
    setTimeout(() => {
      const blob = new Blob([buildPaper(profile.board === "cbse" ? "CBSE" : "Karnataka State", subject.name, subject.chapters.map((c) => c.title))], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${subject.id}-board-paper.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
      setGenerating(false);
      toast.success("Question paper generated");
    }, 1100);
  };

  return (
    <AppShell>
      <PageHeader title="Exam Engine" subtitle="Generate full-length board-style papers" showLogo />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Subject</h3>
        <div className="grid grid-cols-2 gap-2">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubjectId(s.id)}
              className={cn(
                "rounded-xl border-2 p-3 text-left transition-all",
                subjectId === s.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.chapters.length} chapters</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft flex items-center justify-between">
        <div>
          <p className="font-semibold">Board Exam Simulation</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Follow {profile.board === "cbse" ? "CBSE" : "Karnataka State"} 2025-26 weightage & blueprint
          </p>
        </div>
        <Switch checked={boardSim} onCheckedChange={setBoardSim} />
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Blueprint</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { label: "MCQ", marks: "1×20" },
            { label: "VSA", marks: "2×6" },
            { label: "SA", marks: "3×7" },
            { label: "LA", marks: "5×7" },
          ].map((b) => (
            <div key={b.label} className="rounded-xl bg-secondary p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{b.label}</p>
              <p className="font-bold mt-1">{b.marks}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center">Total: 80 marks • 3 hours</p>
      </div>

      <Button onClick={generate} disabled={!subject || generating} className="mt-5 w-full h-12 bg-gradient-primary text-primary-foreground shadow-elegant">
        {generating ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Download className="h-4 w-4" />}
        {generating ? "Generating paper…" : "Generate & download paper (PDF)"}
      </Button>

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Recent papers</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                <FileText className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">Mock Paper #{i}</p>
                <p className="text-xs text-muted-foreground">80 marks • 3 hrs • {profile.board?.toUpperCase()}</p>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function buildPaper(board: string, subject: string, chapters: string[]) {
  return [
    `${board} • Class 10 • ${subject}`,
    `Mock Question Paper`,
    `Time: 3 hrs   Max marks: 80`,
    ``,
    `Section A (1 mark each)`,
    ...Array.from({ length: 20 }, (_, i) => `${i + 1}. Define a key term from "${chapters[i % chapters.length]}".`),
    ``,
    `Section B (2 marks each)`,
    ...Array.from({ length: 6 }, (_, i) => `${i + 1}. Briefly explain a concept from "${chapters[i % chapters.length]}".`),
    ``,
    `Section C (3 marks each)`,
    ...Array.from({ length: 7 }, (_, i) => `${i + 1}. Discuss with example: "${chapters[i % chapters.length]}".`),
    ``,
    `Section D (5 marks each)`,
    ...Array.from({ length: 7 }, (_, i) => `${i + 1}. Long answer based on "${chapters[i % chapters.length]}".`),
  ].join("\n");
}
