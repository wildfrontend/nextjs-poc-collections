"use client";

import { useMemo, useState } from "react";
import { useScaledTime } from "./hook";

const formatMs = (ms: number) => {
  const totalMs = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = totalMs % 1000;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const mmm = String(millis).padStart(3, "0");
  return `${mm}:${ss}.${mmm}`;
};

function TimerCore({
  running,
  speed,
  initialMs,
}: {
  running: boolean;
  speed: number;
  initialMs: number;
}) {
  const ms = useScaledTime({ running, speed, initialMs });
  const display = useMemo(() => formatMs(ms), [ms]);
  return (
    <div>
      <strong>Scaled Time:</strong> <span data-testid="slow-timer-ms">{display}</span>
    </div>
  );
}

const SlowTimerDemo: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [initialMs, setInitialMs] = useState(0);
  const [seed, setSeed] = useState(0); // change key to remount core for reset

  const onStart = () => setRunning(true);
  const onPauseResume = () => setRunning((v) => !v);
  const onReset = () => {
    setRunning(false);
    setInitialMs(0);
    setSeed((s) => s + 1); // remount TimerCore so internal ms resets
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>
          Speed:
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </label>
        <button onClick={onStart} disabled={running}>
          START
        </button>
        <button onClick={onPauseResume}>{running ? "PAUSE" : "RESUME"}</button>
        <button onClick={onReset}>RESET</button>
      </div>
      <TimerCore key={seed} running={running} speed={speed} initialMs={initialMs} />
    </div>
  );
};

export default SlowTimerDemo;
