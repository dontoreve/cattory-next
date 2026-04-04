"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

// ── Context ───────────────────────────────────────────────────────
const MouseXContext = createContext<MotionValue<number> | null>(null);

// ── DockChip ──────────────────────────────────────────────────────
interface DockChipProps {
  children: ReactNode;
  onClick: () => void;
  className: string;
}

export function DockChip({ children, onClick, className }: DockChipProps) {
  const contextMouseX = useContext(MouseXContext);
  // Always create a fallback so hooks are unconditional
  const fallbackMouseX = useMotionValue(Infinity);
  const mouseX = contextMouseX ?? fallbackMouseX;

  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const el = ref.current;
    if (!el || val === Infinity) return Infinity;
    const rect = el.getBoundingClientRect();
    return val - (rect.left + rect.width / 2);
  });

  // Scale: 1.0 far → 1.5 at center
  const scaleRaw = useTransform(distance, [-100, 0, 100], [1.0, 1.5, 1.0]);
  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 200, damping: 14 });

  // Float upward at center
  const yRaw = useTransform(distance, [-100, 0, 100], [0, -6, 0]);
  const y = useSpring(yRaw, { mass: 0.1, stiffness: 200, damping: 14 });

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{ scale, y, transformOrigin: "bottom center" }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ── DockGroup ─────────────────────────────────────────────────────
interface DockGroupProps {
  children: ReactNode;
  className?: string;
}

export function DockGroup({ children, className = "" }: DockGroupProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <MouseXContext.Provider value={mouseX}>
      <div
        className={`flex gap-2 flex-wrap items-end ${className}`}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {children}
      </div>
    </MouseXContext.Provider>
  );
}
