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

  // Scale: 1.0 far → 1.18 at center — subtle, no overlapping
  const scaleRaw = useTransform(distance, [-80, 0, 80], [1.0, 1.18, 1.0]);
  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 220, damping: 18 });

  // Float upward at center — barely noticeable lift
  const yRaw = useTransform(distance, [-80, 0, 80], [0, -3, 0]);
  const y = useSpring(yRaw, { mass: 0.1, stiffness: 220, damping: 18 });

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
