import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, ScanLine, AlertTriangle, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/notes-check")({
  component: NotesCheck,
});

interface Result {
  weightage: number;
  recognized: string;
  issues: { word: string; correction: string }[];
  matches: number;
  feedback: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function NotesCheck() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [topic, setTopic] = useState("");

  const handleFile = async (f: File | null | undefined) => {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error("Image too large", { description: "Please use an image under 8 MB." });
      return;
    }
    const dataUrl = await fileToBase64(f);
    setPreview(dataUrl);
    setImageData(dataUrl);
    setResult(null);
  };

  const runScan = async () => {
    if (!imageData) return;
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-notes", {
        body: { imageBase64: imageData, topic: topic.trim() || undefined },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      setResult(data as Result);
      toast.success("Notes analysed");
    } catch (e) {
      toast.error("Couldn't analyse notes", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setImageData(null);
    setResult(null);
  };

  return (
    <AppShell>
      <PageHeader title="Notes Checker" subtitle="Snap your handwritten notes — AI will OCR & grade them" showLogo />

      {!preview ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <ScanLine className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold">Upload notes to check</h3>
          <p className="text-sm text-muted-foreground mt-1">Clear photo of your handwritten notes (JPEG/PNG)</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button onClick={() => cameraRef.current?.click()} className="bg-gradient-primary text-primary-foreground shadow-soft">
              <Camera className="h-4 w-4" />
              Camera
            </Button>
            <Button onClick={() => fileRef.current?.click()} variant="secondary">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
      ) : (
        <>
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-soft">
            <img src={preview} alt="Your notes" className="w-full max-h-80 object-contain bg-muted" />
            <button
              onClick={reset}
              className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur shadow-soft hover:bg-background"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {!result && (
            <>
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Topic (optional)
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, Light Reflection…"
                  className="mt-1"
                  disabled={scanning}
                />
                <p className="mt-1 text-xs text-muted-foreground">Helps the AI grade against the right concepts.</p>
              </div>
              <Button onClick={runScan} disabled={scanning} className="mt-4 w-full h-12 bg-gradient-primary text-primary-foreground shadow-elegant">
                {scanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing notes…</> : "Run AI check"}
              </Button>
            </>
          )}

          {result && (
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
                <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">Weightage Score</p>
                <p className="mt-1 text-5xl font-extrabold">{result.weightage}<span className="text-2xl">/100</span></p>
                <p className="text-sm text-white/85 mt-1">{result.matches} key concepts matched textbook</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Recognized text</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {highlightIssues(result.recognized, result.issues)}
                </p>
              </div>

              {result.issues.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" /> Mistakes ({result.issues.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.issues.map((iss, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="rounded-md bg-destructive/10 text-destructive px-2 py-0.5 font-mono line-through">{iss.word}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="rounded-md bg-success/10 text-success px-2 py-0.5 font-mono font-semibold">{iss.correction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border border-success/30 bg-success/5 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">{result.feedback}</p>
              </div>

              <Button onClick={reset} variant="secondary" className="w-full">
                Check another page
              </Button>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

function highlightIssues(text: string, issues: { word: string; correction: string }[]) {
  if (!issues.length) return text;
  const set = new Set(issues.map((i) => i.word.toLowerCase()));
  const parts = text.split(/(\s+)/);
  return parts.map((w, i) => {
    const clean = w.replace(/[.,;:!?()"']/g, "").toLowerCase();
    return set.has(clean) ? (
      <mark key={i} className="bg-destructive/15 text-destructive rounded px-1 py-0.5 font-medium">
        {w}
      </mark>
    ) : (
      <span key={i}>{w}</span>
    );
  });
}
