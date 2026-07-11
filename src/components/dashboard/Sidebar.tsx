import { LayoutDashboard, BarChart3, Users, Settings, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionKey = "overview" | "reports" | "customers" | "settings";

const items: { key: SectionKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "customers", label: "Customers", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

interface Props {
  active: SectionKey;
  onSelect: (k: SectionKey) => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ active, onSelect, open, onClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-sidebar text-sidebar-foreground transform transition-transform lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">Insighta</div>
              <div className="text-[10px] text-sidebar-foreground/60">Analytics Suite</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-sidebar-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = active === it.key;
            return (
              <button
                key={it.key}
                onClick={() => {
                  onSelect(it.key);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-sidebar-border p-4">
          <div className="text-xs font-semibold">Pro Tip</div>
          <div className="text-[11px] text-sidebar-foreground/70 mt-1">
            Use the date range filter to sync all charts and tables.
          </div>
        </div>
      </aside>
    </>
  );
}
