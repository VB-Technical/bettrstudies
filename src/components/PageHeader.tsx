import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  back?: string;
  right?: React.ReactNode;
  showLogo?: boolean;
}

export function PageHeader({ title, subtitle, back, right, showLogo }: Props) {
  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {back ? (
          <Link to={back} className="mt-1 grid h-10 w-10 place-items-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        ) : showLogo ? (
          <div className="mt-1 grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Sparkles className="h-5 w-5" />
          </div>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold text-balance leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </header>
  );
}
