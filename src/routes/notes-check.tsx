import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ScanLine, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/notes-check")({
  component: NotesCheck,
});

interface MockResult {
  weightage: number;
  recognized: string;
  issues: { word: string; correction: string }[];
  matches: number;
}

function NotesCheck() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<MockResult | null>(null);

  const handleFile = (f: File | null | undefined) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResult(null);
  };

  const runScan = () => {
    if (!preview) return;
    setScanning(true);
    setTimeout(() => {
      setResult({
        weightage: 78,
        recognized:
          "Photosynthesis is the process by which green plants prepar food using sunlite, water and carbon dioxide. The chloroplast contains chlorophil which traps light energy.",
        issues: [
          { word: "prepar", correction: "prepare" },
          { word: "sunlite", correction: "sunlight" },
          { word: "chlorophil", correction: "chlorophyll" },
        ],
        matches: 12,
      });
      setScanning(false);
      toast.success("Notes analysed");
    }, 1400);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
  };

  return (
    <AppShell>
      <PageHeader title="Notes Checker" subtitle="Snap your handwritten notes — we'll OCR & cross-check" showLogo />

      {!preview ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <ScanLine className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold">Upload notes to check</h3>
          <p className="text-sm text-muted-foreground mt-1">JPEG / PNG of your handwritten notes</p>
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
            <Button onClick={runScan} disabled={scanning} className="mt-4 w-full h-12 bg-gradient-primary text-primary-foreground shadow-elegant">
              {scanning ? "Analysing notes…" : "Run AI check"}
            </Button>
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
                <p className="text-sm leading-relaxed">
                  {highlightIssues(result.recognized, result.issues)}
                </p>
              </div>

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

              <div className="rounded-2xl border border-success/30 bg-success/5 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">Your notes cover the core concepts well. Fix the spellings and add a diagram for full marks.</p>
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

function highlightIssues(text: string, issues: { word: string; correction: string }[]) {
  const words = text.split(/(\s+)/);
  const set = new Set(issues.map((i) => i.word));
  return words.map((w, i) =>
    set.has(w) ? (
      <mark key={i} className="bg-destructive/15 text-destructive rounded px-1 py-0.5 font-medium">
        {w}
      </mark>
    ) : (
      <span key={i}>{w}</span>
    )
  );
}
