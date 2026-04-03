"use client";

import { useEffect } from "react";
import type { Profile } from "@/lib/types";

interface TeamMembersModalProps {
  open: boolean;
  onClose: () => void;
  members: Profile[];
}

export default function TeamMembersModal({
  open,
  onClose,
  members,
}: TeamMembersModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl w-full max-w-sm rounded-xl p-6 border border-white/20 dark:border-slate-700/40 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Equipo</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scroll">
          {members.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Cargando equipo...
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <img
                  src={member.avatar_url || "/logo.png"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {member.full_name || "Sin nombre"}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {member.role}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
