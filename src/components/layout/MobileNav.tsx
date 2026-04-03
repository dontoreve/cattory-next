"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  onNewTask?: () => void;
  onMoreClick?: () => void;
}

const TABS = [
  { href: "/", icon: "auto_awesome", label: "Prioridad" },
  { href: "/kanban", icon: "view_kanban", label: "Kanban" },
  // Center FAB is handled separately
  { href: "/calendar", icon: "calendar_month", label: "Calendario" },
] as const;

export default function MobileNav({ onNewTask, onMoreClick }: MobileNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav
      className="md:hidden fixed z-40 left-4 right-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/30 dark:border-slate-700/40 rounded-full shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center justify-around px-3 h-16"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        transform: "translateZ(0)",
      }}
    >
      {/* First two tabs */}
      {TABS.slice(0, 2).map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`mobile-nav-item flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-colors ${
            isActive(tab.href) ? "text-primary" : "text-slate-400"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "22px",
              ...(isActive(tab.href)
                ? { fontVariationSettings: "'FILL' 1" }
                : {}),
            }}
          >
            {tab.icon}
          </span>
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </Link>
      ))}

      {/* Center FAB: Nueva Tarea */}
      <button
        onClick={onNewTask}
        className="flex flex-col items-center justify-center -mt-4"
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-lime-accent shadow-lg shadow-lime-accent/30 -mt-5 ring-4 ring-white/60 dark:ring-slate-900/60">
          <span
            className="material-symbols-outlined text-slate-900"
            style={{ fontSize: "28px" }}
          >
            add
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
          Nueva Tarea
        </span>
      </button>

      {/* Calendar tab */}
      {TABS.slice(2).map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`mobile-nav-item flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-colors ${
            isActive(tab.href) ? "text-primary" : "text-slate-400"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "22px",
              ...(isActive(tab.href)
                ? { fontVariationSettings: "'FILL' 1" }
                : {}),
            }}
          >
            {tab.icon}
          </span>
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </Link>
      ))}

      {/* More button */}
      <button
        onClick={onMoreClick}
        className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-colors text-slate-400"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
          menu
        </span>
        <span className="text-[10px] font-semibold">Mas</span>
      </button>
    </nav>
  );
}
