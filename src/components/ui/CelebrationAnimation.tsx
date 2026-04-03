"use client";

import { useCallback, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

const PARTICLE_COLORS = [
  "#10b981", "#34d399", "#6ee7b7", "#fbbf24",
  "#f59e0b", "#818cf8", "#a78bfa", "#c084fc",
];

const CELEBRATION_MESSAGES = [
  { text: "excelente trabajo", emoji: "\uD83D\uDD25" },
  { text: "eso fue rapido", emoji: "\u26A1" },
  { text: "sigue asi, vas increible", emoji: "\uD83D\uDE80" },
  { text: "otra tarea menos", emoji: "\u2728" },
  { text: "imparable", emoji: "\uD83D\uDCAA" },
  { text: "maquina total", emoji: "\uD83E\uDD16" },
  { text: "productividad al 100", emoji: "\uD83D\uDCCA" },
  { text: "crack absoluto", emoji: "\uD83C\uDFC6" },
  { text: "que nivel", emoji: "\uD83C\uDF1F" },
  { text: "otro gol", emoji: "\u26BD" },
  { text: "eso es flow", emoji: "\uD83C\uDFB5" },
  { text: "vamos con todo", emoji: "\uD83D\uDD25" },
];

export function useCelebration() {
  const { showToast } = useToast();
  const styleInjected = useRef(false);

  const celebrate = useCallback(
    (originEl?: HTMLElement | null, userName?: string) => {
      // Inject keyframes once
      if (!styleInjected.current) {
        const style = document.createElement("style");
        style.textContent = `
          @keyframes celebrateParticle {
            0% { transform: translate(0,0) scale(1); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
          }
          @keyframes celebrateRing {
            0% { transform: scale(0.3); border-color: #10b981; opacity: 1; }
            100% { transform: scale(1.8); border-color: transparent; opacity: 0; }
          }
          @keyframes celebrateCheck {
            0% { transform: scale(0) rotate(-45deg); opacity: 0; }
            60% { transform: scale(1.3) rotate(10deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
        styleInjected.current = true;
      }

      // Origin point
      let cx = window.innerWidth / 2;
      let cy = window.innerHeight / 2;
      if (originEl) {
        const rect = originEl.getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 2;
      }

      const container = document.createElement("div");
      container.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;`;
      document.body.appendChild(container);

      // Ring
      const ring = document.createElement("div");
      ring.style.cssText = `
        position:absolute;left:${cx - 30}px;top:${cy - 30}px;width:60px;height:60px;
        border-radius:50%;border:3px solid #10b981;
        animation:celebrateRing 0.6s ease-out forwards;
      `;
      container.appendChild(ring);

      // Checkmark
      const check = document.createElement("span");
      check.className = "material-symbols-outlined";
      check.textContent = "check_circle";
      check.style.cssText = `
        position:absolute;left:${cx - 16}px;top:${cy - 16}px;font-size:32px;
        color:#10b981;z-index:9999;
        font-variation-settings:'FILL' 1;
        animation:celebrateCheck 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
      `;
      container.appendChild(check);

      // Burst particles
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        const dist = 40 + Math.random() * 50;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const size = 4 + Math.random() * 6;
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];

        const p = document.createElement("div");
        p.style.cssText = `
          position:absolute;left:${cx - size / 2}px;top:${cy - size / 2}px;
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};z-index:9999;
          --tx:${tx}px;--ty:${ty}px;
          animation:celebrateParticle 0.7s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
          animation-delay:${Math.random() * 0.15}s;
        `;
        container.appendChild(p);
      }

      // Progress bar pulse
      const progressBar = document.querySelector(".progress-glow");
      if (progressBar) {
        progressBar.classList.add("animate-pulse");
        setTimeout(() => progressBar.classList.remove("animate-pulse"), 1600);
      }

      // Cleanup
      setTimeout(() => container.remove(), 900);

      // Toast
      const msg =
        CELEBRATION_MESSAGES[
          Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
        ];
      const name = userName || "";
      const toastText = name
        ? `${msg.emoji} ${name}, ${msg.text}!`
        : `${msg.emoji} ${msg.text}!`;
      showToast(toastText, "success");
    },
    [showToast]
  );

  return celebrate;
}
