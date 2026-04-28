import { Link, useLocation } from "@tanstack/react-router";
import { Home, ScanLine, FileText, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/notes-check", label: "Notes Check", icon: ScanLine },
  { to: "/writing-exam", label: "Writing Exam", icon: FileText },
  { to: "/tutor", label: "Tutor", icon: MessageCircle },
  { to: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-3xl grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to || loc.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn("relative grid place-items-center h-9 w-9 rounded-xl transition-all", active && "bg-primary/10")}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
