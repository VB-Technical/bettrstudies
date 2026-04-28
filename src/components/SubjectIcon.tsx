import type { SubjectIconKey } from "@/lib/syllabus";

interface Props {
  type: SubjectIconKey;
  className?: string;
}

// Modern, hand-tuned SVG glyphs per subject. Use currentColor.
export function SubjectIcon({ type, className }: Props) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "english":
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <path d="M10 12h20a6 6 0 0 1 6 6v22H16a6 6 0 0 1-6-6V12Z" />
          <path d="M16 18h14M16 24h14M16 30h10" />
          <path d="M30 12v6h6" />
        </svg>
      );
    case "language":
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <circle cx="24" cy="24" r="14" />
          <path d="M10 24h28M24 10c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14Z" />
        </svg>
      );
    case "math":
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <rect x="8" y="8" width="32" height="32" rx="6" />
          <path d="M16 18h6M19 15v6M28 17l6 6M34 17l-6 6M16 32h8M28 30h8M28 34h8" />
        </svg>
      );
    case "science":
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <path d="M19 8h10M21 8v10l-9 16a4 4 0 0 0 3.5 6h17a4 4 0 0 0 3.5-6L27 18V8" />
          <circle cx="22" cy="30" r="1.5" fill="currentColor" />
          <circle cx="28" cy="34" r="1.5" fill="currentColor" />
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <circle cx="24" cy="24" r="16" />
          <path d="M8 24h32M24 8c5 5 8 10 8 16s-3 11-8 16c-5-5-8-10-8-16s3-11 8-16Z" />
        </svg>
      );
    case "elective":
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <rect x="6" y="10" width="36" height="24" rx="3" />
          <path d="M16 40h16M20 34v6M28 34v6" />
          <path d="M14 18l4 4-4 4M22 26h10" />
        </svg>
      );
  }
}
