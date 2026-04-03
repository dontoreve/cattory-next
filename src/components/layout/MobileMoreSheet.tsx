"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMoreSheetProps {
  open: boolean;
  onClose: () => void;
  onTeamClick?: () => void;
  onNewProjectClick?: () => void;
  onManageProjectsClick?: () => void;
  onRecurringClick?: () => void;
}

export default function MobileMoreSheet({
  open,
  onClose,
  onTeamClick,
  onNewProjectClick,
  onManageProjectsClick,
  onRecurringClick,
}: MobileMoreSheetProps) {
  const { role } = useAuth();
  const sheetRef = useRef<HTMLDivElement>(null);

  const closeSheet = useCallback(() => {
    const el = sheetRef.current;
    if (!el) return onClose();
    el.classList.add("bottom-sheet-hidden");
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  // When open changes to true, animate in
  useEffect(() => {
    if (open && sheetRef.current) {
      // Force reflow then remove hidden class
      sheetRef.current.classList.remove("bottom-sheet-hidden");
    }
  }, [open]);

  if (!open) return null;

  function handleAction(callback?: () => void) {
    const el = sheetRef.current;
    if (el) el.classList.add("bottom-sheet-hidden");
    setTimeout(() => {
      onClose();
      callback?.();
    }, 300);
  }

  return (
    <div
      ref={sheetRef}
      className="md:hidden fixed inset-0 z-50 bottom-sheet-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeSheet}
      />

      {/* Sheet */}
      <div className="bottom-sheet-panel absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-t-2xl">
        <div
          className="p-4 space-y-1"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))" }}
        >
          {/* Drag handle */}
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4" />

          {/* Backlog (admin only) */}
          {role === "admin" && (
            <Link
              href="/backlog"
              onClick={() => handleAction()}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">
                history
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Backlog
              </span>
            </Link>
          )}

          {/* Tareas Creadas (member only) */}
          {role === "member" && (
            <Link
              href="/tareas-creadas"
              onClick={() => handleAction()}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">
                task_alt
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Tareas Creadas
              </span>
            </Link>
          )}

          {/* Equipo (all roles) */}
          <button
            onClick={() => handleAction(onTeamClick)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">
              group
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Equipo
            </span>
          </button>

          {/* Admin-only actions */}
          {role === "admin" && (
            <>
              <button
                onClick={() => handleAction(onNewProjectClick)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  add_circle
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Nuevo Proyecto
                </span>
              </button>

              <button
                onClick={() => handleAction(onManageProjectsClick)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  settings
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Gestionar Proyectos
                </span>
              </button>

              <button
                onClick={() => handleAction(onRecurringClick)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  repeat
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Tareas Recurrentes
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
