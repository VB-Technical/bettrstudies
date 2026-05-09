import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SubjectIcon } from "@/components/SubjectIcon";
import { getChapterPercent, isChapterPassed, useProfile, useProgressTick } from "@/lib/store";
import { getSubject, type Chapter } from "@/lib/syllabus";
import { CheckCircle2, Lock, Play, FileText, Headphones, Network, ArrowLeft, Pause, Download, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/subject/$subjectId")({
  component: SubjectPage,
});

type Mode = null | "menu" | "text" | "audio" | "mind";

function SubjectPage() {
  const { subjectId } = useParams({ from: "/subject/$subjectId" });
  const [profile] = useProfile();
  useProgressTick();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>(null);

  const subject = profile.board ? getSubject(profile.board, subjectId, profile.secondLang, profile.thirdLang, profile.firstLang) : undefined;
  if (!subject) {
    return (
      <AppShell>
        <PageHeader title="Subject not found" back="/home" />
      </AppShell>
    );
  }

  const open = openIdx !== null;
  const chapter = openIdx !== null ? subject.chapters[openIdx] : null;

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
                  onClick={() => { setOpenIdx(i); setMode("menu"); }}
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

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpenIdx(null); setMode(null); } }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {chapter && mode === "menu" && (
            <ReviewMenu
              chapterIdx={openIdx!}
              chapter={chapter}
              onPick={setMode}
            />
          )}
          {chapter && mode === "text" && (
            <TextReview chapter={chapter} subjectId={subject.id} chapterIdx={openIdx!} onBack={() => setMode("menu")} />
          )}
          {chapter && mode === "audio" && (
            <AudioReview chapter={chapter} onBack={() => setMode("menu")} />
          )}
          {chapter && mode === "mind" && (
            <MindMapReview chapter={chapter} subject={subject.name} onBack={() => setMode("menu")} />
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function ReviewMenu({ chapterIdx, chapter, onPick }: { chapterIdx: number; chapter: Chapter; onPick: (m: Mode) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>How do you want to learn?</DialogTitle>
        <DialogDescription>Chapter {chapterIdx + 1} • {chapter.title}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 mt-2">
        {[
          { mode: "text" as const, icon: FileText, title: "Text Review", desc: "Read full notes in a pop-up" },
          { mode: "audio" as const, icon: Headphones, title: "Audio Review", desc: "Listen to a spoken summary" },
          { mode: "mind" as const, icon: Network, title: "Mind Map Image", desc: "AI-generated visual map (Gemini)" },
        ].map(({ mode, icon: Icon, title, desc }) => (
          <button
            key={mode}
            onClick={() => onPick(mode)}
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
    </>
  );
}

function BackBar({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <button onClick={onBack} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground -mt-1">
      <ArrowLeft className="h-3.5 w-3.5" /> {title}
    </button>
  );
}

type Lang = "english" | "kannada" | "hindi" | "sanskrit" | "urdu";
const LANG_OPTS: { value: Lang; label: string; bcp47: string }[] = [
  { value: "english", label: "English", bcp47: "en-IN" },
  { value: "kannada", label: "ಕನ್ನಡ", bcp47: "kn-IN" },
  { value: "hindi", label: "हिन्दी", bcp47: "hi-IN" },
  { value: "sanskrit", label: "संस्कृतम्", bcp47: "sa-IN" },
  { value: "urdu", label: "اردو", bcp47: "ur-IN" },
];

function useChapterOverview(chapter: Chapter, subjectName: string, lang: Lang) {
  const [data, setData] = useState<{ overview: string; spoken: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancel = false;
    setLoading(true); setError(null); setData(null);
    supabase.functions.invoke("chapter-overview", {
      body: { title: chapter.title, brief: chapter.brief, topics: chapter.topics, subject: subjectName, language: lang },
    }).then(({ data, error }) => {
      if (cancel) return;
      if (error) { setError(error.message); return; }
      const d = data as { overview?: string; spoken?: string; error?: string };
      if (d?.error) { setError(d.error); return; }
      setData({ overview: d.overview ?? "", spoken: d.spoken ?? "" });
    }).catch((e) => { if (!cancel) setError(e?.message ?? "Failed"); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [chapter.title, subjectName, lang]);
  return { data, loading, error };
}

function LangPicker({ value, onChange }: { value: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {LANG_OPTS.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border transition",
            value === o.value ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function TextReview({ chapter, subjectId, subjectName, chapterIdx, onBack }: { chapter: Chapter; subjectId: string; subjectName: string; chapterIdx: number; onBack: () => void }) {
  const [lang, setLang] = useState<Lang>("english");
  const { data, loading, error } = useChapterOverview(chapter, subjectName, lang);

  const downloadPdf = () => {
    const body = data?.overview || `${chapter.brief}\n\n${chapter.topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    const blob = new Blob([`${chapter.title}\n\n${body}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subjectId}-ch${chapterIdx + 1}-${chapter.title.replace(/\s+/g, "-")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded");
  };
  return (
    <>
      <BackBar onBack={onBack} title="All options" />
      <DialogHeader>
        <DialogTitle>{chapter.title}</DialogTitle>
        <DialogDescription className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Gemini overview
        </DialogDescription>
      </DialogHeader>
      <LangPicker value={lang} onChange={setLang} />
      <article className="space-y-3 text-sm leading-relaxed max-h-[45vh] overflow-y-auto rounded-xl bg-muted/30 p-4 whitespace-pre-wrap">
        {loading && <span className="inline-flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Writing your overview…</span>}
        {error && <span className="text-destructive">{error}</span>}
        {!loading && !error && (data?.overview || chapter.brief)}
      </article>
      <Button onClick={downloadPdf} className="mt-2 w-full bg-gradient-primary text-primary-foreground shadow-soft" disabled={loading}>
        <Download className="h-4 w-4" /> Download as PDF
      </Button>
    </>
  );
}

function AudioReview({ chapter, subjectName, onBack }: { chapter: Chapter; subjectName: string; onBack: () => void }) {
  const [lang, setLang] = useState<Lang>("english");
  const { data, loading, error } = useChapterOverview(chapter, subjectName, lang);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesReady, setVoicesReady] = useState(false);

  // Poll synth state to keep button label honest across browsers
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const sync = () => {
      const s = window.speechSynthesis;
      if (!s.speaking && !s.paused) setStatus("idle");
      else if (s.paused) setStatus("paused");
      else setStatus("playing");
    };
    const id = setInterval(sync, 400);
    const onVoices = () => setVoicesReady(true);
    if (window.speechSynthesis.getVoices().length) setVoicesReady(true);
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    return () => {
      clearInterval(id);
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Stop audio if language or text changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setStatus("idle");
    }
  }, [lang, data?.spoken]);

  const text = data?.spoken || `${chapter.title}. ${chapter.brief}`;

  const pickVoice = (bcp47: string) => {
    const voices = window.speechSynthesis.getVoices();
    const exact = voices.find((v) => v.lang?.toLowerCase() === bcp47.toLowerCase());
    if (exact) return exact;
    const prefix = bcp47.split("-")[0].toLowerCase();
    return voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) || voices[0];
  };

  const start = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const opt = LANG_OPTS.find((o) => o.value === lang)!;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opt.bcp47;
    const v = pickVoice(opt.bcp47);
    if (v) u.voice = v;
    u.rate = 0.95; u.pitch = 1;
    u.onend = () => { setStatus("idle"); utterRef.current = null; };
    u.onerror = (e) => {
      console.error("TTS", e);
      setStatus("idle"); utterRef.current = null;
      toast.error(`No ${opt.label} voice available on this device — try English.`);
    };
    utterRef.current = u;
    setStatus("playing");
    setTimeout(() => synth.speak(u), 50);
  };

  const toggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Speech is not supported on this device");
      return;
    }
    const synth = window.speechSynthesis;
    if (status === "playing") { synth.pause(); setStatus("paused"); return; }
    if (status === "paused") { synth.resume(); setStatus("playing"); return; }
    start();
  };

  const disabled = loading || !text || !voicesReady;

  return (
    <>
      <BackBar onBack={onBack} title="All options" />
      <DialogHeader>
        <DialogTitle>{chapter.title}</DialogTitle>
        <DialogDescription className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Gemini-written audio review
        </DialogDescription>
      </DialogHeader>
      <LangPicker value={lang} onChange={setLang} />

      <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            disabled={disabled}
            aria-label={status === "playing" ? "Pause" : "Play"}
            className="grid h-16 w-16 place-items-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md ring-1 ring-white/20 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : status === "playing" ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">
              {status === "playing" ? "Speaking" : status === "paused" ? "Paused" : "Ready"}
            </p>
            <p className="font-bold text-lg leading-tight truncate">{chapter.title}</p>
            <p className="text-sm text-white/85">
              {loading ? "Writing summary in " + (LANG_OPTS.find((o) => o.value === lang)?.label) + "…"
                : error ? "Failed to load — using fallback text"
                : status === "paused" ? "Tap play to resume"
                : status === "playing" ? "Tap to pause"
                : "Tap play to listen"}
            </p>
          </div>
        </div>
        <div className="mt-4 h-1 rounded-full bg-white/20 overflow-hidden">
          <div className={cn("h-full bg-white rounded-full transition-all", status === "playing" ? "animate-pulse w-2/3" : status === "paused" ? "w-1/3" : "w-0")} />
        </div>
      </div>

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer font-semibold">Show transcript</summary>
        <p className="mt-2 leading-relaxed whitespace-pre-wrap">{text}</p>
      </details>
    </>
  );
}


function MindMapReview({ chapter, subject, onBack }: { chapter: Chapter; subject: string; onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-mindmap", {
        body: { title: chapter.title, topics: chapter.topics, subject },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      const img = (data as { image?: string })?.image;
      if (!img) throw new Error("No image returned");
      setImage(img);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generate(); /* eslint-disable-next-line */ }, []);

  const download = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `mindmap-${chapter.title.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
    toast.success("Mind map saved");
  };

  return (
    <>
      <BackBar onBack={onBack} title="All options" />
      <DialogHeader>
        <DialogTitle>{chapter.title}</DialogTitle>
        <DialogDescription className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-generated mind map (Gemini)
        </DialogDescription>
      </DialogHeader>

      <div className="aspect-square w-full rounded-2xl border border-border bg-muted/30 grid place-items-center overflow-hidden">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Drawing your mind map…</p>
            <p className="text-xs">This usually takes 10-20s</p>
          </div>
        )}
        {!loading && image && (
          <img src={image} alt={`Mind map for ${chapter.title}`} className="w-full h-full object-contain" />
        )}
        {!loading && error && (
          <div className="text-center p-4">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={generate} disabled={loading}>
          <Sparkles className="h-4 w-4" /> Regenerate
        </Button>
        <Button onClick={download} disabled={!image} className="bg-gradient-primary text-primary-foreground shadow-soft">
          <Download className="h-4 w-4" /> Download PNG
        </Button>
      </div>
    </>
  );
}
