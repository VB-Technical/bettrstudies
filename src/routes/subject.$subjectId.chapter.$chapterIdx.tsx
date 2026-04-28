import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { passChapter, setChapterProgress, useProfile, useProgressTick, getChapterPercent } from "@/lib/store";
import { getSubject } from "@/lib/syllabus";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Headphones, Network, FileText, Sparkles, Music, Download, Pause, Play, CheckCircle2, Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/subject/$subjectId/chapter/$chapterIdx")({
  component: ChapterPage,
});

function ChapterPage() {
  const { subjectId, chapterIdx } = useParams({ from: "/subject/$subjectId/chapter/$chapterIdx" });
  const idx = parseInt(chapterIdx, 10);
  const [profile] = useProfile();
  useProgressTick();

  const subject = profile.board ? getSubject(profile.board, subjectId) : undefined;
  const chapter = subject?.chapters[idx];

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [mnemonic, setMnemonic] = useState(false);
  const [songPlaying, setSongPlaying] = useState(false);

  if (!subject || !chapter) {
    return (
      <AppShell>
        <PageHeader title="Chapter not found" back="/home" />
      </AppShell>
    );
  }

  const bumpProgress = (delta: number) => {
    const cur = getChapterPercent(subject.id, idx);
    setChapterProgress(subject.id, idx, Math.max(cur, Math.min(99, cur + delta)));
  };

  const downloadPdf = () => {
    const blob = new Blob([
      `${subject.name} — ${chapter.title}\n\n${chapter.brief}\n\nKey topics:\n` +
        chapter.topics.map((t, i) => `  ${i + 1}. ${t}`).join("\n"),
    ], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subject.id}-ch${idx + 1}-${chapter.title.replace(/\s+/g, "-")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded");
    bumpProgress(10);
  };

  const playAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Audio not supported on this device");
      return;
    }
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(`${chapter.title}. ${chapter.brief} Key topics: ${chapter.topics.join(", ")}.`);
    u.rate = 0.95;
    u.onend = () => setAudioPlaying(false);
    window.speechSynthesis.speak(u);
    setAudioPlaying(true);
    bumpProgress(15);
  };

  return (
    <AppShell>
      <PageHeader
        title={chapter.title}
        subtitle={`${subject.name} • Chapter ${idx + 1}`}
        back={`/subject/${subject.id}`}
      />

      <p className="text-muted-foreground leading-relaxed">{chapter.brief}</p>

      <Tabs defaultValue="audio" className="mt-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-secondary rounded-xl">
          {[
            { v: "audio", icon: Headphones, label: "Audio" },
            { v: "mind", icon: Network, label: "Mind Map" },
            { v: "text", icon: FileText, label: "Text" },
            { v: "ai", icon: Sparkles, label: "AI" },
            { v: "song", icon: Music, label: "Song" },
          ].map(({ v, icon: Icon, label }) => (
            <TabsTrigger
              key={v}
              value={v}
              className="flex flex-col gap-1 h-auto py-2 data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-primary"
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-semibold">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* AUDIO */}
        <TabsContent value="audio" className="mt-4">
          <div className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
            <div className="flex items-center gap-4">
              <button
                onClick={playAudio}
                className="grid h-16 w-16 place-items-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md ring-1 ring-white/20 transition-all"
                aria-label={audioPlaying ? "Pause audio" : "Play audio"}
              >
                {audioPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Audio Overview</p>
                <p className="font-bold text-lg leading-tight truncate">{chapter.title}</p>
                <p className="text-sm text-white/85">~ 2 min listen • text-to-speech</p>
              </div>
            </div>
            <div className="mt-5 h-1 rounded-full bg-white/20 overflow-hidden">
              <div className={`h-full bg-white rounded-full transition-all ${audioPlaying ? "animate-pulse w-2/3" : "w-0"}`} />
            </div>
          </div>
        </TabsContent>

        {/* MIND MAP */}
        <TabsContent value="mind" className="mt-4">
          <MindMap title={chapter.title} topics={chapter.topics} />
        </TabsContent>

        {/* TEXT */}
        <TabsContent value="text" className="mt-4">
          <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{chapter.brief}</p>
            <h4 className="mt-5 mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Key topics</h4>
            <ul className="space-y-2">
              {chapter.topics.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button onClick={downloadPdf} className="mt-6 w-full bg-gradient-primary text-primary-foreground shadow-soft">
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </article>
        </TabsContent>

        {/* AI OVERVIEW */}
        <TabsContent value="ai" className="mt-4">
          <article className="rounded-2xl border border-primary/30 bg-card p-5 shadow-soft relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-glow/20 blur-3xl" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                ENSEMBLE • Sonnet · Gemini · GPT-5
              </div>
              <h3 className="text-xl font-bold">Hybrid AI Overview</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {chapter.brief} A balanced synthesis prioritizes board-blueprint relevance, common pitfalls, and high-yield concepts.
              </p>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary p-3">
                <div>
                  <p className="font-semibold text-sm">Mnemonic / Abbreviation mode</p>
                  <p className="text-xs text-muted-foreground">Show memory aids for each topic</p>
                </div>
                <Switch checked={mnemonic} onCheckedChange={setMnemonic} />
              </div>

              <ul className="mt-4 space-y-2">
                {chapter.topics.map((t, i) => (
                  <li key={i} className="rounded-xl bg-muted/50 p-3">
                    <p className="font-semibold text-sm">{t}</p>
                    {mnemonic && (
                      <p className="mt-1 text-xs text-primary font-medium">
                        🧠 {makeMnemonic(t)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </TabsContent>

        {/* STUDY SONG */}
        <TabsContent value="song" className="mt-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                <Music className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Study Song</p>
                <p className="font-bold">"{chapter.title}, Remember Me"</p>
                <p className="text-xs text-muted-foreground">Lyrics by Sonnet • Music by Gemini</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-secondary p-4 font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {generateLyrics(chapter.title, chapter.topics)}
            </div>

            <Button
              onClick={() => {
                setSongPlaying((s) => !s);
                bumpProgress(10);
                toast.success(songPlaying ? "Paused" : "Now playing study song");
              }}
              className="mt-4 w-full bg-gradient-primary text-primary-foreground shadow-soft"
            >
              {songPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {songPlaying ? "Pause" : "Play"} study song
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chapter Test CTA */}
      <section className="mt-7 rounded-3xl bg-card border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              Chapter Test
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Pass to unlock Chapter {idx + 2}.</p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{getChapterPercent(subject.id, idx)}%</span>
        </div>
        <Progress value={getChapterPercent(subject.id, idx)} className="mt-3 h-2" />
        <Button
          onClick={() => {
            passChapter(subject.id, idx);
            toast.success("Chapter passed! Next chapter unlocked 🎉");
          }}
          className="mt-4 w-full bg-success text-success-foreground hover:bg-success/90"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark chapter test passed (demo)
        </Button>
        <Link
          to="/writing-exam"
          className="mt-2 block text-center text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          Practice with full Exam Engine →
        </Link>
      </section>
    </AppShell>
  );
}

function makeMnemonic(t: string) {
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return `Repeat: "${t}"`;
  const acronym = words.map((w) => w[0].toUpperCase()).join("");
  return `${acronym} — "${words.map((w) => capitalize(w)).join(" ")}"`;
}
function capitalize(w: string) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }

function generateLyrics(title: string, topics: string[]) {
  const t = topics.slice(0, 3);
  return `[Verse 1]\n${title} — let's break it down,\n${t[0] || "First idea"} wears the crown.\n\n[Chorus]\nLearn it slow, learn it right,\nBettr keeps your mind alight.\n\n[Verse 2]\n${t[1] || "Second piece"} fits in too,\n${t[2] || "Third one"} brings it through.`;
}

function MindMap({ title, topics }: { title: string; topics: string[] }) {
  const W = 360, H = 320, cx = W / 2, cy = H / 2;
  const r = 110;
  const nodes = topics.slice(0, 6);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft overflow-hidden">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Mind Map</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="mm-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-glow)" />
          </linearGradient>
        </defs>
        {nodes.map((_, i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return <line key={`l${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1.5" />;
        })}
        <circle cx={cx} cy={cy} r="48" fill="url(#mm-grad)" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12" fontWeight="700">
          {title.length > 14 ? title.slice(0, 12) + "…" : title}
        </text>
        {nodes.map((t, i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="32" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--foreground)" fontSize="9" fontWeight="600">
                {t.length > 12 ? t.slice(0, 10) + "…" : t}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
