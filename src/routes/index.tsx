import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";

import { Sidebar, type SectionKey } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CategoryDonut, CityBarChart, RevenueAreaChart } from "@/components/dashboard/Charts";
import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardSkeleton } from "@/components/dashboard/Skeleton";
import {
  categoryDistribution,
  kpis,
  revenueTrend,
  salesByCity,
  transactions,
} from "@/data/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Insighta — Interactive Analytics Dashboard" },
      { name: "description", content: "A responsive analytics dashboard with KPIs, charts, and interactive customer insights." },
      { property: "og:title", content: "Insighta — Interactive Analytics Dashboard" },
      { property: "og:description", content: "KPIs, revenue trends, city-wise sales, and searchable transactions." },
    ],
  }),
  component: DashboardPage,
});

const RANGES = [
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "All time", days: 9999 },
];

function DashboardPage() {
  const [section, setSection] = useState<SectionKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rangeDays, setRangeDays] = useState(180);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Filter transactions by date range + top-bar search
  const filteredTxns = useMemo(() => {
    const cutoff = Date.now() - rangeDays * 86400000;
    const q = search.trim().toLowerCase();
    return transactions
      .filter((t) => new Date(t.date).getTime() >= cutoff)
      .filter((t) =>
        q === ""
          ? true
          : t.name.toLowerCase().includes(q) ||
            t.city.toLowerCase().includes(q) ||
            t.email.toLowerCase().includes(q),
      );
  }, [rangeDays, search]);

  // Trend slice by range
  const trend = useMemo(() => {
    const monthsToShow = rangeDays >= 9999 ? 12 : Math.max(3, Math.round(rangeDays / 30));
    return revenueTrend.slice(-monthsToShow);
  }, [rangeDays]);

  // City sales recomputed from filtered txns
  const cityData = useMemo(() => {
    const map = new Map<string, number>();
    salesByCity.forEach((c) => map.set(c.city, 0));
    filteredTxns.forEach((t) => map.set(t.city, (map.get(t.city) ?? 0) + t.amount));
    return Array.from(map, ([city, sales]) => ({ city, sales: Math.round(sales) }))
      .filter((d) => d.sales > 0)
      .sort((a, b) => b.sales - a.sales);
  }, [filteredTxns]);

  // Category recomputed from filtered txns (percentages)
  const catData = useMemo(() => {
    const map = new Map<string, number>();
    filteredTxns.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
    const rows = Array.from(map, ([name, v]) => ({
      name,
      value: Math.round((v / total) * 100),
    }));
    return rows.length ? rows : categoryDistribution;
  }, [filteredTxns]);

  const sectionTitles: Record<SectionKey, { t: string; s: string }> = {
    overview: { t: "Overview", s: "Live snapshot of your business performance" },
    reports: { t: "Reports", s: "Deep-dive charts across revenue and geography" },
    customers: { t: "Customers", s: "Recent transactions and customer activity" },
    settings: { t: "Settings", s: "Preferences and workspace configuration" },
  };
  const cur = sectionTitles[section];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        active={section}
        onSelect={setSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenu={() => setSidebarOpen(true)} search={search} onSearch={setSearch} />

        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Page title + date range */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">{cur.t}</h1>
              <p className="text-sm text-muted-foreground">{cur.s}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card px-3 h-10 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                value={rangeDays}
                onChange={(e) => setRangeDays(Number(e.target.value))}
                className="bg-transparent focus:outline-none text-sm font-medium pr-2"
              >
                {RANGES.map((r) => (
                  <option key={r.days} value={r.days}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <DashboardSkeleton />
          ) : section === "settings" ? (
            <SettingsPanel />
          ) : (
            <>
              {/* KPIs */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((k) => (
                  <KPICard key={k.label} {...k} />
                ))}
              </section>

              {/* Charts */}
              {section !== "customers" && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <ChartCard
                    title="Revenue Trend"
                    subtitle="Monthly revenue in INR"
                    className="lg:col-span-2"
                  >
                    <RevenueAreaChart data={trend} />
                  </ChartCard>
                  <ChartCard title="Category Split" subtitle="Share of total sales">
                    <CategoryDonut data={catData} />
                  </ChartCard>
                  <ChartCard
                    title="Sales by City"
                    subtitle="Top Indian cities by revenue"
                    className="lg:col-span-3"
                  >
                    <CityBarChart data={cityData} />
                  </ChartCard>
                </section>
              )}

              {/* Table */}
              {section !== "reports" && <DataTable rows={filteredTxns} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="rounded-2xl border bg-card p-6 max-w-2xl">
      <h2 className="font-semibold">Workspace Settings</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Configure your Insighta workspace. Preferences here are for demo purposes.
      </p>
      <div className="mt-5 space-y-4">
        {["Email notifications", "Weekly digest", "Anonymous usage analytics"].map((l) => (
          <label key={l} className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm">{l}</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
          </label>
        ))}
      </div>
    </div>
  );
}
