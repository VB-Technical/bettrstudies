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
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/writing-exam")({
  component: WritingExam,
});

function WritingExam() {
  const [profile] = useProfile();
  const subjects = profile.board ? getSubjects(profile.board, profile.medium, profile.secondLang, profile.thirdLang) : [];
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || "");
  const [boardSim, setBoardSim] = useState(true);
  const [generating, setGenerating] = useState(false);

  const subject = subjects.find((s) => s.id === subjectId);

  const generate = () => {
    if (!subject) return;
    setGenerating(true);
    setTimeout(() => {
      try {
        const boardName = profile.board === "cbse" ? "CBSE" : "Karnataka State";
        const chapters = subject.chapters.map((c) => c.title);
        renderPaperPdf(boardName, subject.name, chapters, `${subject.id}-board-paper.pdf`);
        toast.success("Question paper generated");
      } catch (e) {
        toast.error("Failed to generate paper");
      } finally {
        setGenerating(false);
      }
    }, 600);
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

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function renderPaperPdf(board: string, subject: string, chapters: string[], filename: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (h: number) => {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeLine = (text: string, opts: { size?: number; bold?: boolean; gap?: number; align?: "left" | "center" } = {}) => {
    const size = opts.size ?? 11;
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    for (const line of lines) {
      ensureSpace(size + 4);
      if (opts.align === "center") {
        doc.text(line, pageW / 2, y, { align: "center" });
      } else {
        doc.text(line, margin, y);
      }
      y += size + 4;
    }
    y += opts.gap ?? 0;
  };

  // Header
  writeLine(`${board} • Class 10 • ${subject}`, { size: 14, bold: true, align: "center" });
  writeLine("Mock Question Paper (2025-26)", { size: 12, bold: true, align: "center", gap: 4 });
  writeLine("Time: 3 hours                                                                Max Marks: 80", { size: 10, align: "center", gap: 6 });
  doc.setDrawColor(150);
  ensureSpace(10);
  doc.line(margin, y, pageW - margin, y);
  y += 14;

  writeLine("General Instructions:", { size: 11, bold: true });
  [
    "1. All questions are compulsory.",
    "2. Section A carries 1 mark each (MCQ / Fill in the blanks).",
    "3. Section B carries 2 marks each (Very Short Answer).",
    "4. Section C carries 3 marks each (Short Answer).",
    "5. Section D carries 5 marks each (Long Answer).",
  ].forEach((l) => writeLine(l, { size: 10 }));
  y += 8;

  const sections: { title: string; count: number; marks: number; build: (i: number) => string }[] = [
    {
      title: "SECTION A — Multiple Choice / Fill in the blanks (1 mark × 20 = 20)",
      count: 20,
      marks: 1,
      build: (i) => `${i + 1}. Define / identify a key term from the chapter "${pick(chapters, i)}".`,
    },
    {
      title: "SECTION B — Very Short Answer (2 marks × 6 = 12)",
      count: 6,
      marks: 2,
      build: (i) => `${i + 1}. Briefly explain an important concept from "${pick(chapters, i + 3)}". (2)`,
    },
    {
      title: "SECTION C — Short Answer (3 marks × 7 = 21)",
      count: 7,
      marks: 3,
      build: (i) => `${i + 1}. Discuss with an example a major idea presented in "${pick(chapters, i + 1)}". (3)`,
    },
    {
      title: "SECTION D — Long Answer (5 marks × 7 = 35) — Internal choice provided",
      count: 7,
      marks: 5,
      build: (i) =>
        `${i + 1}. Write a detailed answer based on "${pick(chapters, i + 2)}".\n   OR\n   Write a detailed answer based on "${pick(chapters, i + 5)}". (5)`,
    },
  ];

  sections.forEach((s) => {
    y += 6;
    writeLine(s.title, { size: 11, bold: true, gap: 4 });
    for (let i = 0; i < s.count; i++) {
      writeLine(s.build(i), { size: 10, gap: 2 });
    }
  });

  // Footer on last page
  y += 10;
  ensureSpace(20);
  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 14;
  writeLine("— End of Paper —", { size: 10, bold: true, align: "center" });

  doc.save(filename);
}

