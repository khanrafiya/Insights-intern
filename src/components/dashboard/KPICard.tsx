import { ArrowDownRight, ArrowUpRight, IndianRupee, Users, UserPlus, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  revenue: IndianRupee,
  users: Users,
  signups: UserPlus,
  conversion: TrendingUp,
};

interface Props {
  label: string;
  value: string;
  change: number;
  up: boolean;
  icon: string;
}

export function KPICard({ label, value, change, up, icon }: Props) {
  const Icon = iconMap[icon] ?? TrendingUp;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="mt-2 text-2xl font-bold tracking-tight truncate">{value}</div>
        </div>
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold",
            up ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
          )}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change)}%
        </span>
        <span className="text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
}
