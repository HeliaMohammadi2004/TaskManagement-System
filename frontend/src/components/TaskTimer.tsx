"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface TaskTimerProps {
  taskId: number;
  startedAt?: string | null;
  finishedAt?: string | null;
  duration?: string | null; // "HH:MM:SS" or "MM:SS"
  onStart: (id: number) => Promise<void>;
  onStop: (id: number) => Promise<void>;
  isStarting?: boolean;
  isStopping?: boolean;
}

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
  </svg>
);
const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
  </svg>
);

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + Math.floor(parts[2]);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}
function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TaskTimer({
  taskId,
  startedAt,
  finishedAt,
  duration,
  onStart,
  onStop,
  isStarting = false,
  isStopping = false,
}: TaskTimerProps) {
  const isRunning = !!startedAt && !finishedAt;

  const getLiveSeconds = useCallback(() => {
    if (!isRunning || !startedAt) return null;
    return Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  }, [isRunning, startedAt]);

  const [liveSeconds, setLiveSeconds] = useState<number | null>(() => getLiveSeconds());
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!isRunning) {
      const t = setTimeout(() => {
        if (mounted) setLiveSeconds(null);
      }, 0);
      return () => {
        mounted = false;
        clearTimeout(t);
      };
    }

    const tStart = setTimeout(() => {
      if (mounted) setLiveSeconds(getLiveSeconds());
    }, 0);

    const interval = setInterval(() => {
      if (mounted) setLiveSeconds(getLiveSeconds());
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(tStart);
      clearInterval(interval);
    };
  }, [isRunning, getLiveSeconds]);

  const displayDuration = duration ? parseDurationToSeconds(duration) : null;
  const elapsed = liveSeconds ?? displayDuration ?? 0;
  const total = displayDuration ?? Math.max(elapsed, 1);
  const pct = Math.min(100, Math.round((elapsed / total) * 100));

  const isBusy = isStarting || isStopping;

  const handleStart = async () => {
    setActionError(null);
    try {
      await onStart(taskId);
    } catch (err) {
      setActionError("Failed to start timer");
      console.error(err);
    }
  };

  const handleStop = async () => {
    setActionError(null);
    try {
      await onStop(taskId);
    } catch (err) {
      setActionError("Failed to stop timer");
      console.error(err);
    }
  };

  const liveLabel = useMemo(() => {
    if (isRunning && liveSeconds !== null) return formatSeconds(liveSeconds);
    if (displayDuration !== null) return formatSeconds(displayDuration);
    return "not started";
  }, [isRunning, liveSeconds, displayDuration]);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${isRunning ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.25" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>

            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-600">Time</div>
              <div
                className="text-sm font-mono font-semibold tabular-nums text-slate-900"
                aria-live="polite"
              >
                {liveLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={handleStop}
              disabled={isBusy}
              title="Stop timer"
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-95 transition transform"
              aria-pressed="true"
            >
              {isStopping ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <StopIcon />}
              <span className="sr-only">Stop timer</span>
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={isBusy}
              title="Start timer"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:scale-95 transition transform"
              aria-pressed="false"
            >
              {isStarting ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <PlayIcon />}
              <span className="sr-only">Start timer</span>
              <span>{displayDuration !== null ? "Restart" : "Start"}</span>
            </button>
          )}
        </div>
      </div>

      {actionError && <p className="mt-2 text-sm text-red-600">{actionError}</p>}

      {(startedAt || finishedAt) && (
        <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
          {startedAt && (
            <span>
              Started: <span className="text-gray-700 font-medium">{new Date(startedAt).toLocaleString()}</span>
            </span>
          )}
          {finishedAt && (
            <span>
              Ended: <span className="text-gray-700 font-medium">{new Date(finishedAt).toLocaleString()}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
