import { useEffect, useRef, useState } from 'react';

/**
 * 以真實時間乘上 speed，產生「縮放後的 ms」。
 * speed < 1 變慢；speed > 1 變快。慢四倍 => 0.25
 */
export function useScaledTime(options: {
  running: boolean;
  speed?: number; // 預設 1
  initialMs?: number; // 預設 0（可用來做暫停/恢復）
}) {
  const { running, speed = 1, initialMs = 0 } = options;

  const [ms, setMs] = useState(initialMs);
  const rafRef = useRef<number | null>(null);
  const lastRealRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRealRef.current = null;
      return;
    }

    const loop = (now: number) => {
      if (lastRealRef.current == null) {
        lastRealRef.current = now;
      } else {
        const realDelta = now - lastRealRef.current; // 真實經過 ms
        lastRealRef.current = now;
        setMs((prev) => prev + realDelta * speed); // 縮放
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRealRef.current = null;
    };
  }, [running, speed]);

  return ms; // 縮放後的「已經過毫秒」
}
