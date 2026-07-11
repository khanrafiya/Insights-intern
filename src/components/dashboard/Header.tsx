import { Bell, Menu, Search } from "lucide-react";
import { currentUser } from "@/data/mockData";
import { initialsOf } from "@/utils/format";

interface Props {
  onMenu: () => void;
  search: string;
  onSearch: (v: string) => void;
}

export function Header({ onMenu, search, onSearch }: Props) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur border-b flex items-center gap-3 px-4 lg:px-6">
      <button onClick={onMenu} className="lg:hidden p-2 -ml-2 rounded hover:bg-muted">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search customers, cities, transactions..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/60 border border-transparent focus:bg-background focus:border-ring focus:outline-none text-sm transition"
        />
      </div>

      <button className="relative p-2 rounded-lg hover:bg-muted">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
      </button>

      <div className="flex items-center gap-3 pl-3 border-l">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold leading-tight">{currentUser.name}</div>
          <div className="text-[11px] text-muted-foreground">{currentUser.role}</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center text-sm font-semibold">
          {initialsOf(currentUser.name)}
        </div>
      </div>
    </header>
  );
}
