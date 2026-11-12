"use client";
import { useEffect, useRef, useState } from "react";

/** 進入畫面時數字由 0 跑到目標值；使用者設定「減少動態」或無 JS 時直接顯示最終值。 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const target = Number(value);
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown((0).toFixed(decimals));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          // 快速捲過（已在畫面上方）時直接顯示最終值，不停在 0。
          if (e.boundingClientRect.top < 0) { io.disconnect(); setShown(value); }
          return;
        }
        io.disconnect();
        const start = performance.now();
        const dur = 1200;
        const tick = (t: number) => {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown((target * eased).toFixed(decimals));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals, value]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {shown}
    </span>
  );
}
