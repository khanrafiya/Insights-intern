import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction, TxnStatus } from "@/data/mockData";
import { formatDate, formatINR, initialsOf } from "@/utils/format";
import { cn } from "@/lib/utils";
import { TransactionDrawer } from "./TransactionDrawer";

type SortKey = keyof Pick<Transaction, "name" | "city" | "amount" | "status" | "date">;

const statusStyle: Record<TxnStatus, string> = {
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Failed: "bg-red-500/10 text-red-600 border-red-500/20",
  Refunded: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

interface Props {
  rows: Transaction[];
}

const PAGE_SIZE = 8;

export function DataTable({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<"all" | TxnStatus>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) =>
        query === "" ? true : r.name.toLowerCase().includes(query) || r.city.toLowerCase().includes(query) || r.email.toLowerCase().includes(query),
      )
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
  }, [rows, status, q, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between border-b">
        <div>
          <h3 className="font-semibold text-sm">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} of {rows.length} shown
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, city, email..."
            className="h-9 px-3 rounded-lg text-sm bg-muted/60 border border-transparent focus:bg-background focus:border-ring focus:outline-none w-full sm:w-64"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as "all" | TxnStatus);
              setPage(1);
            }}
            className="h-9 px-3 rounded-lg text-sm bg-muted/60 border border-transparent focus:bg-background focus:border-ring focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              {([
                ["name", "Customer"],
                ["city", "City"],
                ["amount", "Amount"],
                ["status", "Status"],
                ["date", "Date"],
              ] as [SortKey, string][]).map(([k, label]) => (
                <th key={k} className="text-left font-semibold px-5 py-3">
                  <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground">
                    {label} <SortIcon k={k} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className="border-t hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary grid place-items-center text-xs font-semibold">
                      {initialsOf(r.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{r.city}</td>
                <td className="px-5 py-3 font-semibold">{formatINR(r.amount)}</td>
                <td className="px-5 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", statusStyle[r.status])}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{formatDate(r.date)}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t text-xs text-muted-foreground">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <TransactionDrawer txn={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
