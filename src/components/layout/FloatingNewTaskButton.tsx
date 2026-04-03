"use client";

export default function FloatingNewTaskButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center gap-2.5 fixed bottom-8 right-8 z-40 px-7 py-3.5 bg-lime-accent text-slate-900 font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
      style={{
        boxShadow:
          "0 8px 30px rgba(184, 242, 117, 0.4), 0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-300">
        add
      </span>
      <span>Nueva Tarea</span>
    </button>
  );
}
