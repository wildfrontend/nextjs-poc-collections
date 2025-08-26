import { useEffect, useRef, useState } from 'react';

const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const RunningClockDemo = () => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const [displaySeconds, setDisplaySeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const endAtRef = useRef<number | null>(null);
  const pausedRemainingMsRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const stopAtZero = () => {
    clearTimer();
    endAtRef.current = null;
    pausedRemainingMsRef.current = 0;
    setIsRunning(false);
    setDisplaySeconds(0);
  };

  const tick = () => {
    const endAt = endAtRef.current;
    if (!endAt) return;

    const now = Date.now();
    const msLeft = Math.max(0, endAt - now);

    const secLeft = Math.ceil(msLeft / 1000);
    setDisplaySeconds(secLeft);

    if (msLeft <= 0) {
      stopAtZero();
      return;
    }
    const nextDelay = msLeft % 1000 || 1000;
    timeoutRef.current = setTimeout(tick, nextDelay);
  };

  useEffect(() => {
    if (isRunning) {
      // 一進入 running 立即 tick 一次，秒數立刻正確
      clearTimer();
      tick();
      // 修正：頁面被隱藏/喚醒後，立刻糾偏
      const onVis = () => {
        if (isRunning) {
          clearTimer();
          tick();
        }
      };
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('focus', onVis);

      return () => {
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('focus', onVis);
        clearTimer();
      };
    } else {
      clearTimer();
    }
  }, [isRunning]);

  // 事件處理
  const handleStart = () => {
    const total = Math.max(0, Math.floor(minutes) * 60 + Math.floor(seconds)); // 65秒會變 1:05，自動正規化
    if (total === 0) {
      stopAtZero();
      return;
    }
    const ms = total * 1000;
    endAtRef.current = Date.now() + ms;
    pausedRemainingMsRef.current = 0;
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    if (isRunning) {
      // 暫停：記錄剩餘毫秒
      const endAt = endAtRef.current ?? Date.now();
      const msLeft = Math.max(0, endAt - Date.now());
      pausedRemainingMsRef.current = msLeft;
      endAtRef.current = null;
      setIsRunning(false);
    } else {
      // 繼續：用剩餘毫秒重建 endAt
      const msLeft = pausedRemainingMsRef.current;
      if (msLeft <= 0) {
        stopAtZero();
        return;
      }
      endAtRef.current = Date.now() + msLeft;
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    stopAtZero();
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label>
        <input
          type="number"
          step={1}
          min={0}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
        Minutes
      </label>
      <label>
        <input
          type="number"
          min={0}
          step={1}
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
        />
        Seconds
      </label>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <button onClick={handleStart}>START</button>
        <button onClick={handlePauseResume}>PAUSE / RESUME</button>
        <button onClick={handleReset}>RESET</button>
      </div>
      <h1 data-testid="running-clock">{formatTime(displaySeconds)}</h1>
    </div>
  );
};

export default RunningClockDemo;
