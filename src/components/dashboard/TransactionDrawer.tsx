import { useEffect } from "react";
import { X, Mail, MapPin, Calendar, Tag, Receipt, Copy } from "lucide-react";
import type { Transaction, TxnStatus } from "@/data/mockData";
import { formatDate, formatINR, initialsOf } from "@/utils/format";
import { cn } from "@/lib/utils";

const statusStyle: Record<TxnStatus, string> = {
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Failed: "bg-red-500/10 text-red-600 border-red-500/20",
  Refunded: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

interface Props {
  txn: Transaction | null;
  onClose: () => void;
}

export function TransactionDrawer({ txn, onClose }: Props) {
  const open = txn !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Transaction details"
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-card border-l shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {txn && (
          <>
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Transaction</div>
                <div className="font-semibold text-sm flex items-center gap-2 mt-0.5">
                  {txn.id}
                  <button
                    onClick={() => navigator.clipboard?.writeText(txn.id)}
                    className="p-1 rounded hover:bg-muted text-muted-foreground"
                    aria-label="Copy transaction ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Customer */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center text-base font-semibold">
                  {initialsOf(txn.name)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{txn.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{txn.email}</div>
                </div>
              </div>

              {/* Amount */}
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border p-5">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Amount</div>
                <div className="mt-1 text-3xl font-bold tracking-tight">{formatINR(txn.amount)}</div>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 mt-3 rounded-md text-xs font-medium border",
                    statusStyle[txn.status],
                  )}
                >
                  {txn.status}
                </span>
              </div>

              {/* Details */}
              <dl className="space-y-3 text-sm">
                <Row icon={Mail} label="Email" value={txn.email} />
                <Row icon={MapPin} label="City" value={txn.city} />
                <Row icon={Tag} label="Category" value={txn.category} />
                <Row icon={Calendar} label="Date" value={formatDate(txn.date)} />
                <Row icon={Receipt} label="Reference" value={txn.id} />
              </dl>

              {/* Timeline */}
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-3">Activity</div>
                <ol className="relative border-l ml-2 space-y-4">
                  {[
                    { t: "Payment initiated", d: txn.date },
                    { t: "Verification complete", d: txn.date },
                    { t: `Status: ${txn.status}`, d: txn.date },
                  ].map((s, i) => (
                    <li key={i} className="pl-4 relative">
                      <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15" />
                      <div className="text-sm font-medium">{s.t}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(s.d)}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="p-4 border-t flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-lg border text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
              <button className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                Download receipt
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-medium text-right truncate max-w-[60%]">{value}</div>
    </div>
  );
}
