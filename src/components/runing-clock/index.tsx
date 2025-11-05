import { useEffect, useRef, useState } from 'react';

const getTotalSeconds = (minutes: number, seconds: number) =>
  minutes * 60 + seconds;

const formatTimer = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return `${mm}:${ss}`;
};

const RunningClock: React.FC = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const tickingRef = useRef<number | null>(null);
  const endAtRef = useRef<number>(0);

  const clearTimer = () => {
    if (tickingRef.current != null) {
      cancelAnimationFrame(tickingRef.current);
      tickingRef.current = null;
    }
  };

  const ticking = () => {
    const now = Date.now();
    const msLeft = endAtRef.current - now;
    const secsLeft = Math.max(0, Math.ceil(msLeft / 1000));

    if (totalSeconds !== secsLeft) {
      setTotalSeconds(secsLeft);
    }

    if (msLeft <= 0) {
      clearTimer();
      setIsRunning(false);
      setTotalSeconds(0);
    } else {
      tickingRef.current = requestAnimationFrame(ticking);
    }
  };

  const onStart = () => {
    const total = getTotalSeconds(minutes, seconds);
    if (total <= 0) return;

    endAtRef.current = Date.now() + total * 1000;
    setTotalSeconds(total);
    setIsRunning(true);
  };

  const togglePause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else if (totalSeconds > 0) {
      endAtRef.current = Date.now() + totalSeconds * 1000;
      setIsRunning(true);
    }
  };

  const onReset = () => {
    clearTimer();
    setMinutes(0);
    setSeconds(0);
    setTotalSeconds(0);
    setIsRunning(false);
    endAtRef.current = 0;
  };

  useEffect(() => {
    if (isRunning) {
      tickingRef.current = requestAnimationFrame(ticking);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isRunning]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label>
        <input
          onChange={(e) => setMinutes(Number(e.target.value || 0))}
          type="number"
          value={minutes}
        />
        Minutes
      </label>
      <label>
        <input
          onChange={(e) => setSeconds(Number(e.target.value || 0))}
          type="number"
          value={seconds}
        />
        Seconds
      </label>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button onClick={onStart}>START</button>
        <button onClick={togglePause}>PAUSE / RESUME</button>
        <button onClick={onReset}>RESET</button>
      </div>
      <h1 data-testid="running-clock">{formatTimer(totalSeconds)}</h1>
    </div>
  );
};

export default RunningClock;
