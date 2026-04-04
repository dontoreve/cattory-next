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
  { href: "/calendar", icon: "calendar_month", label: "Calendario" },
] as const;

export default function MobileNav({ onNewTask, onMoreClick }: MobileNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav
      className="md:hidden fixed z-40 left-4 right-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/30 dark:border-slate-700/40 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center justify-around px-2 h-14"
      style={{
        bottom: "max(12px, env(safe-area-inset-bottom, 12px))",
        transform: "translateZ(0)",
      }}
    >
      {/* First two tabs */}
      {TABS.slice(0, 2).map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`flex items-center justify-center size-11 rounded-xl transition-colors ${
            isActive(tab.href) ? "text-primary" : "text-slate-400"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "26px",
              ...(isActive(tab.href) ? { fontVariationSettings: "'FILL' 1" } : {}),
            }}
          >
            {tab.icon}
          </span>
        </Link>
      ))}

      {/* Center: New Task button — inside the bar */}
      <button
        onClick={onNewTask}
        className="flex items-center justify-center size-11 rounded-xl bg-primary active:bg-primary/80 transition-colors"
      >
        <span className="material-symbols-outlined text-white" style={{ fontSize: "24px" }}>
          add
        </span>
      </button>

      {/* Calendar tab */}
      {TABS.slice(2).map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`flex items-center justify-center size-11 rounded-xl transition-colors ${
            isActive(tab.href) ? "text-primary" : "text-slate-400"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "26px",
              ...(isActive(tab.href) ? { fontVariationSettings: "'FILL' 1" } : {}),
            }}
          >
            {tab.icon}
          </span>
        </Link>
      ))}

      {/* More button */}
      <button
        onClick={onMoreClick}
        className="flex items-center justify-center size-11 rounded-xl transition-colors text-slate-400"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
          menu
        </span>
      </button>
    </nav>
  );
}
